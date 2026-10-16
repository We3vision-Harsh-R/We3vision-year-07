import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { buildHeadset, buildStand } from "./headset";
import { dustTexture, floorTexture, heroScreenTexture, rng, screenTexture, slatTexture, wallMarkTexture, windowTexture, type Tint } from "./textures";

// The office of the Metaverse page. The visitor walks along the middle of the room towards the hero table (first person, no avatar), stops
// in front of it and the headset on the table comes up to the face by itself; the screen gets darker and at the end it is black.
// All scroll maths is here: setProgress(0..1) is called by the page, render(dt) draws one frame. Metres, -z is "forward".

export type OfficeOptions = { mobile: boolean; hue: number; sat: number };
export type OfficeScene = {
  setProgress: (p: number, immediate?: boolean) => void;
  setTint: (hue: number, sat: number) => void;
  resize: (w: number, h: number) => void;
  render: (dtMs: number) => void;
  /** 0..1: how much of the view is the inside of the headset (the page fades to black with it) */
  readonly dark: number;
  /** for looking at the scene while developing */
  readonly debug: { camera: THREE.PerspectiveCamera; headset: THREE.Group; scene: THREE.Scene };
  dispose: () => void;
};

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = (t: number) => {
  const c = clamp(t);
  return c * c * (3 - 2 * c);
};
const inOut = (t: number) => {
  const c = clamp(t);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};

// where things are
const START_Z = 9.6;
const STOP_Z = -5.55;
const EYE = 1.62;
const TABLE = { x: 0, z: -7.05, top: 0.75, w: 2.7, d: 1.2 };
const HEADSET_SCALE = 1.2;
const HEADSET_REST = new THREE.Vector3(0.52, TABLE.top + 0.094, -6.74);

export function createOfficeScene(canvas: HTMLCanvasElement, opt: OfficeOptions): OfficeScene {
  const mobile = opt.mobile;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = !mobile;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  const tint: Tint = { h: (opt.hue + 354) % 360, s: opt.sat };
  const accentColor = () => new THREE.Color().setHSL(tint.h / 360, clamp(tint.s, 0, 1), 0.72);
  const accents: THREE.MeshBasicMaterial[] = [];
  const lights: { l: THREE.Light; dh: number; sat: number; light: number }[] = [];

  const scene = new THREE.Scene();
  scene.background = new THREE.Color().setHSL(tint.h / 360, 0.6 * tint.s, 0.03);
  scene.fog = new THREE.FogExp2(new THREE.Color().setHSL(tint.h / 360, 0.55 * tint.s, 0.05).getHex(), 0.034);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.3;

  const camera = new THREE.PerspectiveCamera(58, 1, 0.012, 60);
  camera.rotation.order = "YXZ";

  const tintLight = (l: THREE.Light, dh: number, sat: number, light: number) => {
    lights.push({ l, dh, sat, light });
    (l as THREE.Light & { color: THREE.Color }).color.setHSL(((tint.h + dh + 360) % 360) / 360, sat * tint.s, light);
  };

  // ---------------------------------------------------------------- the room
  const ROOM = { w: 14, front: START_Z + 3, back: -9.6, h: 3.8 };
  const len = ROOM.front - ROOM.back;
  const midZ = (ROOM.front + ROOM.back) / 2;

  // the floor: a mirror under a glossy dark tile (desktop), only the tile on a phone
  const floorTex = floorTexture(tint, aniso);
  floorTex.repeat.set(ROOM.w / 2, len / 2);
  const floorGeo = new THREE.PlaneGeometry(ROOM.w, len);
  if (!mobile) {
    const mirror = new Reflector(floorGeo, { textureWidth: Math.round(window.innerWidth * 0.5), textureHeight: Math.round(window.innerHeight * 0.5), color: 0x777777, clipBias: 0.003 });
    mirror.rotation.x = -Math.PI / 2;
    mirror.position.set(0, 0, midZ);
    scene.add(mirror);
  }
  const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.34, metalness: 0.2, transparent: !mobile, opacity: mobile ? 1 : 0.8, depthWrite: mobile });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0.002, midZ);
  floor.receiveShadow = true;
  scene.add(floor);

  // the ceiling with long light strips
  const ceilMat = new THREE.MeshStandardMaterial({ color: 0x120c1c, roughness: 0.9 });
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.w, len), ceilMat);
  ceil.rotation.x = Math.PI / 2;
  ceil.position.set(0, ROOM.h, midZ);
  scene.add(ceil);
  const stripMat = new THREE.MeshBasicMaterial({ color: 0xe8dcff });
  accents.push(stripMat);
  for (const x of [-4.6, -1.7, 1.7, 4.6]) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.03, len - 1.2), stripMat);
    s.position.set(x, ROOM.h - 0.015, midZ);
    scene.add(s);
  }
  // cross beams
  const beamMat = new THREE.MeshStandardMaterial({ color: 0x0c0814, roughness: 0.6, metalness: 0.5 });
  for (let z = ROOM.back + 1.5; z < ROOM.front; z += 3) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(ROOM.w, 0.16, 0.14), beamMat);
    b.position.set(0, ROOM.h - 0.08, z);
    scene.add(b);
  }

  // side walls: floor-to-ceiling glass with a night city behind
  for (const side of [-1, 1]) {
    const tex = windowTexture(tint, side > 0 ? 5 : 9, aniso);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(len, ROOM.h), new THREE.MeshBasicMaterial({ map: tex, fog: false, color: 0xcfc6e6 }));
    m.position.set(side * (ROOM.w / 2), ROOM.h / 2, midZ);
    m.rotation.y = -side * Math.PI / 2;
    scene.add(m);
  }
  // the end wall behind the hero table: dark slats and the glowing mark
  const slat = slatTexture(tint, aniso);
  slat.repeat.set(2, 1);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.w, ROOM.h), new THREE.MeshStandardMaterial({ map: slat, roughness: 0.7, metalness: 0.1 }));
  back.position.set(0, ROOM.h / 2, ROOM.back);
  back.receiveShadow = true;
  scene.add(back);
  const markMat = new THREE.MeshBasicMaterial({ map: wallMarkTexture(tint, aniso), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
  const mark = new THREE.Mesh(new THREE.PlaneGeometry(8.2, 2.05), markMat);
  mark.position.set(0, 2.25, ROOM.back + 0.02);
  scene.add(mark);
  // the entrance wall behind the visitor (only seen in the reflection)
  const entrance = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.w, ROOM.h), new THREE.MeshStandardMaterial({ color: 0x0b0714, roughness: 0.9 }));
  entrance.position.set(0, ROOM.h / 2, ROOM.front);
  entrance.rotation.y = Math.PI;
  scene.add(entrance);

  // ---------------------------------------------------------------- the desks (instanced)
  const deskTopMat = new THREE.MeshStandardMaterial({ color: 0xcfc9d8, roughness: 0.45, metalness: 0.1 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x17131f, roughness: 0.5, metalness: 0.6 });
  const chairMat = new THREE.MeshStandardMaterial({ color: 0x241f30, roughness: 0.85 });
  const screenTex = [0, 1, 2].map((k) => screenTexture(tint, k, aniso));
  const rowsZ = [8.0, 5.6, 3.2, 0.8, -1.6, -4.0];
  const spots: { x: number; z: number; dir: 1 | -1 }[] = [];
  for (const side of [-1, 1] as const) for (const z of rowsZ) spots.push({ x: side * 3.9, z, dir: side === -1 ? 1 : -1 });
  const n = spots.length;
  const iDeskTop = new THREE.InstancedMesh(new THREE.BoxGeometry(0.8, 0.04, 1.6), deskTopMat, n);
  const iLeg = new THREE.InstancedMesh(new THREE.BoxGeometry(0.05, 0.72, 0.05), darkMat, n * 4);
  const iMon = new THREE.InstancedMesh(new THREE.BoxGeometry(0.03, 0.34, 0.6), darkMat, n);
  const iStand = new THREE.InstancedMesh(new THREE.BoxGeometry(0.1, 0.12, 0.06), darkMat, n);
  const iSeat = new THREE.InstancedMesh(new THREE.BoxGeometry(0.5, 0.07, 0.5), chairMat, n);
  const iBack = new THREE.InstancedMesh(new THREE.BoxGeometry(0.06, 0.52, 0.48), chairMat, n);
  const iPost = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 12), darkMat, n);
  const iBase = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.28, 0.28, 0.03, 20), darkMat, n);
  const iKey = new THREE.InstancedMesh(new THREE.BoxGeometry(0.16, 0.014, 0.42), darkMat, n);
  const screens: THREE.InstancedMesh[] = screenTex.map((t) => new THREE.InstancedMesh(new THREE.PlaneGeometry(0.58, 0.32), new THREE.MeshBasicMaterial({ map: t, color: 0xdddddd }), n));
  const cnt = [0, 0, 0];
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const put = (im: THREE.InstancedMesh, i: number, x: number, y: number, z: number, ry = 0) => {
    e.set(0, ry, 0);
    q.setFromEuler(e);
    m4.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(1, 1, 1));
    im.setMatrixAt(i, m4);
  };
  spots.forEach((s, i) => {
    const kind = i % 3;
    const ry = s.dir === 1 ? 0 : Math.PI; // dir 1: the screen looks to +x (towards the aisle)
    put(iDeskTop, i, s.x, 0.74, s.z, 0);
    for (let k = 0; k < 4; k++) put(iLeg, i * 4 + k, s.x + (k % 2 ? 0.36 : -0.36), 0.36, s.z + (k < 2 ? 0.72 : -0.72));
    put(iMon, i, s.x - s.dir * 0.2, 1.1, s.z);
    put(iStand, i, s.x - s.dir * 0.2, 0.82, s.z);
    put(iKey, i, s.x + s.dir * 0.12, 0.77, s.z);
    put(iSeat, i, s.x + s.dir * 0.82, 0.47, s.z);
    put(iBack, i, s.x + s.dir * 1.04, 0.78, s.z);
    put(iPost, i, s.x + s.dir * 0.82, 0.24, s.z);
    put(iBase, i, s.x + s.dir * 0.82, 0.02, s.z);
    // the screen: a plane that looks to the aisle
    e.set(0, s.dir === 1 ? Math.PI / 2 : -Math.PI / 2, 0);
    q.setFromEuler(e);
    m4.compose(new THREE.Vector3(s.x - s.dir * 0.2 + s.dir * 0.0165, 1.1, s.z), q, new THREE.Vector3(1, 1, 1));
    screens[kind].setMatrixAt(cnt[kind]++, m4);
    void ry;
  });
  for (const im of [iDeskTop, iLeg, iMon, iStand, iSeat, iBack, iPost, iBase, iKey]) {
    im.castShadow = false;
    im.frustumCulled = false;
    scene.add(im);
  }
  screens.forEach((im, k) => {
    im.count = cnt[k];
    im.frustumCulled = false;
    scene.add(im);
  });

  // plants and low sofas along the windows
  const potMat = new THREE.MeshStandardMaterial({ color: 0x1a1523, roughness: 0.6 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x2c6b52, roughness: 0.8 });
  const r = rng(7);
  for (const side of [-1, 1]) {
    for (let z = 9.2; z > -8; z -= 3.4) {
      const g = new THREE.Group();
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.17, 0.42, 20), potMat);
      pot.position.y = 0.21;
      g.add(pot);
      for (let k = 0; k < 7; k++) {
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.16 + r() * 0.08, 10, 8), leafMat);
        leaf.scale.set(1, 1.6 + r() * 0.8, 0.45);
        leaf.position.set((r() - 0.5) * 0.3, 0.7 + r() * 0.5, (r() - 0.5) * 0.3);
        leaf.rotation.set((r() - 0.5) * 0.6, r() * 3, (r() - 0.5) * 0.6);
        g.add(leaf);
      }
      g.position.set(side * 6.55, 0, z + (r() - 0.5) * 0.6);
      scene.add(g);
    }
    // a long low sofa near the end
    const sofa = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.42, 3.2), new THREE.MeshStandardMaterial({ color: 0x2a2140, roughness: 0.95 }));
    sofa.position.set(side * 6.0, 0.21, -3.2);
    scene.add(sofa);
    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.4, 3.2), new THREE.MeshStandardMaterial({ color: 0x2a2140, roughness: 0.95 }));
    sofaBack.position.set(side * 6.4, 0.55, -3.2);
    scene.add(sofaBack);
  }

  // ---------------------------------------------------------------- the hero table
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x1d1527, roughness: 0.3, metalness: 0.35 });
  const tableTop = new THREE.Mesh(new THREE.BoxGeometry(TABLE.w, 0.06, TABLE.d), woodMat);
  tableTop.position.set(TABLE.x, TABLE.top - 0.03, TABLE.z);
  tableTop.castShadow = true;
  tableTop.receiveShadow = true;
  scene.add(tableTop);
  const edge = new THREE.Mesh(new THREE.BoxGeometry(TABLE.w + 0.012, 0.012, TABLE.d + 0.012), new THREE.MeshStandardMaterial({ color: 0xc9c6d4, roughness: 0.3, metalness: 1 }));
  edge.position.set(TABLE.x, TABLE.top - 0.062, TABLE.z);
  scene.add(edge);
  for (const sx of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, TABLE.top - 0.06, TABLE.d - 0.2), darkMat);
    leg.position.set(sx * (TABLE.w / 2 - 0.2), (TABLE.top - 0.06) / 2, TABLE.z);
    leg.castShadow = true;
    scene.add(leg);
  }
  // the PC: an ultrawide screen on a stand, a keyboard, a mouse and a small tower
  const heroTex = heroScreenTexture(tint, aniso);
  const monW = 0.98;
  const monH = monW * (540 / 1280);
  const monX = -0.42;
  const monZ = TABLE.z - 0.3;
  const bezel = new THREE.Mesh(new THREE.BoxGeometry(monW + 0.02, monH + 0.02, 0.025), new THREE.MeshStandardMaterial({ color: 0x0e0b14, roughness: 0.35, metalness: 0.6 }));
  bezel.position.set(monX, TABLE.top + 0.2 + monH / 2, monZ);
  bezel.castShadow = true;
  scene.add(bezel);
  const heroScreen = new THREE.Mesh(new THREE.PlaneGeometry(monW, monH), new THREE.MeshBasicMaterial({ map: heroTex, color: 0xffffff, toneMapped: false }));
  heroScreen.position.set(monX, TABLE.top + 0.2 + monH / 2, monZ + 0.0135);
  scene.add(heroScreen);
  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.2, 0.03), new THREE.MeshStandardMaterial({ color: 0xc9c6d4, roughness: 0.3, metalness: 1 }));
  neck.position.set(monX, TABLE.top + 0.1, monZ - 0.01);
  scene.add(neck);
  const foot = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.012, 0.2), new THREE.MeshStandardMaterial({ color: 0xc9c6d4, roughness: 0.3, metalness: 1 }));
  foot.position.set(monX, TABLE.top + 0.006, monZ + 0.04);
  scene.add(foot);
  const kb = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.018, 0.14), new THREE.MeshStandardMaterial({ color: 0x1b1824, roughness: 0.5, metalness: 0.5 }));
  kb.position.set(monX, TABLE.top + 0.009, TABLE.z + 0.2);
  kb.castShadow = true;
  scene.add(kb);
  const keysGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.1), new THREE.MeshBasicMaterial({ color: 0x4b2fa5, transparent: true, opacity: 0.4 }));
  keysGlow.rotation.x = -Math.PI / 2;
  keysGlow.position.set(monX, TABLE.top + 0.0191, TABLE.z + 0.2);
  scene.add(keysGlow);
  const mouse = new THREE.Mesh(new THREE.CapsuleGeometry(0.026, 0.045, 6, 14), new THREE.MeshStandardMaterial({ color: 0x1b1824, roughness: 0.4, metalness: 0.5 }));
  mouse.rotation.x = Math.PI / 2;
  mouse.scale.set(1, 1, 0.55);
  mouse.position.set(monX + 0.38, TABLE.top + 0.016, TABLE.z + 0.2);
  scene.add(mouse);
  const tower = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.42, 0.42), new THREE.MeshStandardMaterial({ color: 0x15121c, roughness: 0.4, metalness: 0.7 }));
  tower.position.set(TABLE.x - 1.12, TABLE.top + 0.21, TABLE.z - 0.1);
  tower.castShadow = true;
  scene.add(tower);
  const towerGlowMat = new THREE.MeshBasicMaterial({ color: 0xb487ff, transparent: true, opacity: 0.4 });
  accents.push(towerGlowMat);
  const towerGlow = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.3, 0.3), towerGlowMat);
  towerGlow.position.set(TABLE.x - 1.12 + 0.103, TABLE.top + 0.21, TABLE.z - 0.1);
  scene.add(towerGlow);
  // a mug and a small plant
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.036, 0.09, 24), new THREE.MeshStandardMaterial({ color: 0x2f7d86, roughness: 0.45 }));
  mug.position.set(monX + 0.7, TABLE.top + 0.045, TABLE.z - 0.1);
  mug.castShadow = true;
  scene.add(mug);
  const mini = new THREE.Group();
  const miniPot = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.07, 18), potMat);
  miniPot.position.y = 0.035;
  mini.add(miniPot);
  for (let k = 0; k < 5; k++) {
    const l = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), leafMat);
    l.scale.set(0.8, 1.8, 0.5);
    l.position.set((r() - 0.5) * 0.06, 0.12 + r() * 0.05, (r() - 0.5) * 0.06);
    l.rotation.set((r() - 0.5) * 0.7, r() * 3, (r() - 0.5) * 0.7);
    mini.add(l);
  }
  mini.position.set(TABLE.x + 1.1, TABLE.top, TABLE.z + 0.15);
  scene.add(mini);

  // the headset on its stand
  const stand = buildStand();
  stand.group.position.set(HEADSET_REST.x, TABLE.top, HEADSET_REST.z);
  scene.add(stand.group);
  const headset = buildHeadset(aniso);
  headset.group.position.copy(HEADSET_REST);
  headset.group.rotation.set(-0.14, 0.12, 0);
  headset.group.scale.setScalar(HEADSET_SCALE);
  scene.add(headset.group);
  accents.push(...headset.accent, ...stand.accent);

  // a pendant ring light over the table
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xe8dcff });
  accents.push(ringMat);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.018, 12, 96), ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.set(TABLE.x, 2.7, TABLE.z);
  scene.add(ring);
  for (const a of [0, 1, 2]) {
    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, ROOM.h - 2.7, 6), darkMat);
    const ang = (a / 3) * Math.PI * 2;
    wire.position.set(TABLE.x + Math.cos(ang) * 0.95, 2.7 + (ROOM.h - 2.7) / 2, TABLE.z + Math.sin(ang) * 0.95);
    scene.add(wire);
  }

  // ---------------------------------------------------------------- lights
  const amb = new THREE.AmbientLight(0xffffff, 0.26);
  tintLight(amb, 0, 0.5, 0.55);
  scene.add(amb);
  const hemi = new THREE.HemisphereLight(0xffffff, 0x000000, 0.4);
  tintLight(hemi, 10, 0.7, 0.62);
  scene.add(hemi);
  const key = new THREE.SpotLight(0xffffff, 40, 9, 0.62, 0.85, 1.4);
  tintLight(key, 20, 0.35, 0.92);
  key.position.set(TABLE.x + 0.4, 3.4, TABLE.z + 1.6);
  key.target.position.set(TABLE.x, TABLE.top, TABLE.z);
  key.castShadow = !mobile;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.bias = -0.0004;
  key.shadow.radius = 5;
  scene.add(key, key.target);
  const tableGlow = new THREE.PointLight(0xffffff, 1.2, 4, 1.8);
  tintLight(tableGlow, 0, 0.9, 0.68);
  tableGlow.position.set(HEADSET_REST.x, TABLE.top + 0.5, HEADSET_REST.z + 0.5);
  scene.add(tableGlow);
  const aisle = new THREE.PointLight(0xffffff, 10, 14, 1.4);
  tintLight(aisle, -10, 0.8, 0.62);
  aisle.position.set(0, 3.2, -1.5);
  scene.add(aisle);

  // floating dust in the light of the table
  const dustCount = mobile ? 70 : 160;
  const dustPos = new Float32Array(dustCount * 3);
  const dustSeed = new Float32Array(dustCount);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3] = TABLE.x + (r() - 0.5) * 3.2;
    dustPos[i * 3 + 1] = 0.6 + r() * 2.4;
    dustPos[i * 3 + 2] = TABLE.z + 1.2 + (r() - 0.5) * 3.2;
    dustSeed[i] = r() * 10;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({ size: 0.028, map: dustTexture(), transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xd9ccff });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  const applyTint = () => {
    const c = accentColor();
    accents.forEach((m) => m.color.copy(c).lerp(new THREE.Color(0xffffff), 0.35));
    for (const x of lights) (x.l as THREE.Light & { color: THREE.Color }).color.setHSL(((tint.h + x.dh + 360) % 360) / 360, x.sat * tint.s, x.light);
    dustMat.color.setHSL(tint.h / 360, 0.9 * tint.s, 0.85);
    (scene.background as THREE.Color).setHSL(tint.h / 360, 0.6 * tint.s, 0.03);
    (scene.fog as THREE.FogExp2).color.setHSL(tint.h / 360, 0.55 * tint.s, 0.05);
  };
  applyTint();

  // ---------------------------------------------------------------- post processing: a soft bloom (desktop)
  let composer: EffectComposer | null = null;
  let bloom: UnrealBloomPass | null = null;
  {
    const target = new THREE.WebGLRenderTarget(512, 512, { type: THREE.HalfFloatType, samples: mobile ? 0 : 4 });
    composer = new EffectComposer(renderer, target);
    composer.addPass(new RenderPass(scene, camera));
    if (!mobile) {
      bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.3, 0.45, 0.96);
      composer.addPass(bloom);
    }
    composer.addPass(new OutputPass());
  }

  // ---------------------------------------------------------------- the walk and the headset (everything that depends on the scroll)
  let target = 0; // from the page
  let prog = 0; // smoothed
  let lastZ = START_Z;
  let speed = 0;
  let time = 0;
  let darkness = 0;
  let aspectNow = 1.78;

  const camPos = new THREE.Vector3();
  const endCamPos = new THREE.Vector3(0, 1.5, STOP_Z);
  const END_PITCH = -0.34;
  const endForward = new THREE.Vector3(0, Math.sin(END_PITCH), -Math.cos(END_PITCH));
  const endHeadPos = endCamPos.clone().addScaledVector(endForward, 0.108);
  const restQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.14, 0.12, 0));
  // at the end the headset looks the same way as the eyes (its front goes forward, its lenses look back at the face)
  const turnAround = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
  const endQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(END_PITCH, 0, 0, "YXZ")).multiply(turnAround);
  const followQuat = new THREE.Quaternion();
  const p0 = HEADSET_REST.clone();
  const p1 = new THREE.Vector3(0.52, 1.34, -6.72);
  const p2 = new THREE.Vector3(0.14, 1.54, -6.0);
  const p3 = endHeadPos;
  const bez = (t: number, out: THREE.Vector3) => {
    const u = 1 - t;
    return out.set(
      u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
      u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
      u * u * u * p0.z + 3 * u * u * t * p1.z + 3 * u * t * t * p2.z + t * t * t * p3.z,
    );
  };

  const place = (dt: number) => {
    // smooth the scroll so that the wheel steps glide
    const k = 1 - Math.exp(-dt * 4.2);
    prog += (target - prog) * k;
    const p = prog;

    // A: stand still at the door, B: walk, C: stop and look at the table, D: the headset comes up, E: dark
    const walk = inOut(clamp((p - 0.05) / 0.6));
    const z = START_Z + (STOP_Z - START_Z) * walk;
    const look = smooth((p - 0.6) / 0.14);
    const dz = Math.abs(z - lastZ) / Math.max(dt, 0.001);
    lastZ = z;
    speed += (clamp(dz / 1.6) - speed) * (1 - Math.exp(-dt * 6));

    // a quiet walk: the steps lift the eyes a little, only while the visitor really moves
    const stride = (z / 0.78) * Math.PI * 2;
    const bobY = Math.sin(stride) * 0.011 * speed;
    const bobX = Math.sin(stride * 0.5) * 0.007 * speed;
    const idle = 1 - speed;
    const breathe = Math.sin(time * 1.3) * 0.0016 * idle;
    const sway = Math.sin(time * 0.35);
    camPos.set(bobX + sway * 0.02 * idle * (1 - look), EYE + bobY + breathe - look * (EYE - 1.5), z);
    const pitch = END_PITCH * look + Math.sin(time * 0.5) * 0.004 * idle + Math.sin(stride) * 0.003 * speed;
    // on a tall phone screen the table is wider than the picture: the eyes turn a little towards the headset
    const portrait = clamp((1 - aspectNow) / 0.35);
    const yaw = Math.sin(time * 0.27) * 0.012 * idle * (1 - look) + Math.sin(stride * 0.5) * 0.004 * speed - 0.34 * portrait * look;
    camera.position.copy(camPos);
    camera.rotation.set(pitch, yaw, Math.sin(stride * 0.5) * 0.0025 * speed);

    // Scroll story of the headset: from 0.74 it rises from the stand and goes to the face by itself (turning round on the way), the
    // picture gets darker while the band comes near the head (a little darker at first, 60% when the lenses face the visitor) and it is
    // completely black when the lenses fill the view, at the end of the page.
    const t = clamp((p - 0.74) / 0.25);
    const e = inOut(t);
    if (t <= 0) {
      headset.group.position.copy(HEADSET_REST);
      headset.group.quaternion.copy(restQuat);
      // it breathes a little on its stand
      headset.group.position.y += Math.sin(time * 1.1) * 0.0012;
    } else {
      bez(e, headset.group.position);
      // it first rises with its glass towards the visitor and turns round only on the way to the face
      headset.group.quaternion.copy(restQuat).slerp(endQuat, smooth((t - 0.38) / 0.52));
      if (t > 0.9) {
        const f = (t - 0.9) / 0.1;
        const forward = new THREE.Vector3(0, 0, -1).applyEuler(camera.rotation);
        const wanted = camera.position.clone().addScaledVector(forward, 0.108);
        headset.group.position.lerp(wanted, smooth(f));
        followQuat.copy(camera.quaternion).multiply(turnAround);
        headset.group.quaternion.slerp(followQuat, smooth(f));
      }
    }
    // the stand's light turns up when the headset is taken away
    stand.accent[0].color.copy(accentColor()).lerp(new THREE.Color(0xffffff), 0.3 + 0.3 * smooth(t * 3));
    // the screen goes black
    darkness = 0.6 * smooth((t - 0.68) / 0.18) + 0.4 * smooth((t - 0.88) / 0.11);
    ring.position.y = 2.7;
  };

  const resize = (w: number, h: number) => {
    renderer.setSize(w, h, false);
    composer?.setSize(w, h);
    bloom?.setSize(w, h);
    camera.aspect = w / h;
    aspectNow = w / h;
    camera.fov = w / h < 0.85 ? 74 : w / h < 1.2 ? 66 : 58;
    camera.updateProjectionMatrix();
  };

  const render = (dtMs: number) => {
    const dt = clamp(dtMs / 1000, 0.001, 0.05);
    time += dt;
    place(dt);
    const a = dust.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < dustCount; i++) {
      a.setY(i, dustPos[i * 3 + 1] + Math.sin(time * 0.3 + dustSeed[i]) * 0.08);
      a.setX(i, dustPos[i * 3] + Math.cos(time * 0.22 + dustSeed[i] * 1.7) * 0.06);
    }
    a.needsUpdate = true;
    if (composer) composer.render();
    else renderer.render(scene, camera);
  };

  return {
    setProgress: (p, immediate = false) => {
      target = clamp(p);
      if (immediate) prog = target;
    },
    setTint: (hue, sat) => {
      tint.h = (hue + 354) % 360;
      tint.s = sat;
      applyTint();
    },
    resize,
    render,
    debug: { camera, headset: headset.group, scene },
    get dark() {
      return darkness;
    },
    dispose: () => {
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => {
          (x as THREE.MeshBasicMaterial).map?.dispose();
          x.dispose();
        });
      });
      envTex.dispose();
      pmrem.dispose();
      composer?.dispose();
      renderer.dispose();
    },
  };
}
