import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { rng } from "../metaverse/textures";
import { buildPanda } from "./panda";

// The 3D world of the About page: a small floating island in space where We3vision lives. Pando the panda stands on it and shows the
// visitor around while they scroll: the story of the company is told station by station (the office, the year 2019, Surat, the services,
// the mission). The camera flies from far away, circles the island and ends in front of the panda, who says hello.
// Everything here is plain three.js; the page gives the scroll progress (0..1) and gets back which chapter is active.

export type WorldOptions = { mobile: boolean; hue: number; sat: number };
export type World = {
  setProgress: (p: number, immediate?: boolean) => void;
  setPointer: (x: number, y: number) => void;
  /** a click at screen position (0..1); true when it hit the panda (it hops) */
  click: (x: number, y: number) => boolean;
  setTint: (hue: number, sat: number) => void;
  resize: (w: number, h: number) => void;
  render: (dtMs: number) => void;
  /** the chapter that is in front: 0 = hero, 1..5 = stations, 6 = the panda */
  readonly chapter: number;
  /** position along the chapters (0..6) */
  readonly f: number;
  dispose: () => void;
};

export const CHAPTERS = 7;
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = (t: number) => {
  const c = clamp(t);
  return c * c * (3 - 2 * c);
};

/** a glowing label on a canvas */
function labelTexture(text: string, sub: string | null, hsl: [number, number, number], w = 768, h = 256) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `600 ${sub ? 112 : 130}px Poppins, "Segoe UI", Arial, sans-serif`;
  g.shadowColor = `hsl(${hsl[0]} ${hsl[1]}% 60%)`;
  g.shadowBlur = 30;
  g.fillStyle = `hsl(${hsl[0]} ${hsl[1]}% ${hsl[2]}%)`;
  g.fillText(text, w / 2, sub ? h * 0.42 : h / 2);
  g.shadowBlur = 0;
  g.fillText(text, w / 2, sub ? h * 0.42 : h / 2);
  if (sub) {
    g.font = `500 54px Poppins, "Segoe UI", Arial, sans-serif`;
    g.fillStyle = `hsl(${hsl[0]} ${hsl[1] * 0.6}% 86%)`;
    g.fillText(sub, w / 2, h * 0.82);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export function createWorld(canvas: HTMLCanvasElement, opt: WorldOptions): World {
  const mobile = opt.mobile;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = !mobile;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const tint = { h: (opt.hue + 354) % 360, s: opt.sat };
  const accent = () => new THREE.Color().setHSL(tint.h / 360, clamp(tint.s), 0.72);
  const accents: THREE.MeshBasicMaterial[] = [];
  const tinted: { m: THREE.MeshStandardMaterial; dh: number; s: number; l: number }[] = [];
  const stdTint = (dh: number, s: number, l: number, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) => {
    const m = new THREE.MeshStandardMaterial({ roughness: 0.7, ...extra });
    tinted.push({ m, dh, s, l });
    return m;
  };
  const glowMat = () => {
    const m = new THREE.MeshBasicMaterial({ color: 0xffffff });
    accents.push(m);
    return m;
  };

  const scene = new THREE.Scene();
  scene.background = new THREE.Color().setHSL(tint.h / 360, 0.6 * tint.s, 0.025);
  scene.fog = new THREE.FogExp2(0x0a0614, 0.02);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.28;
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);

  // ------------------------------------------------------------- the sky
  const starCount = mobile ? 500 : 1400;
  const starPos = new Float32Array(starCount * 3);
  const r = rng(31);
  for (let i = 0; i < starCount; i++) {
    const a = r() * Math.PI * 2;
    const b = Math.acos(2 * r() - 1);
    const d = 30 + r() * 30;
    starPos[i * 3] = d * Math.sin(b) * Math.cos(a);
    starPos[i * 3 + 1] = d * Math.cos(b) * 0.7;
    starPos[i * 3 + 2] = d * Math.sin(b) * Math.sin(a);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({ size: 0.16, color: 0xffffff, transparent: true, opacity: 0.8, sizeAttenuation: true, fog: false, depthWrite: false });
  scene.add(new THREE.Points(starGeo, starMat));

  // ------------------------------------------------------------- the island
  const island = new THREE.Group();
  scene.add(island);
  const grassMat = stdTint(240, 0.36, 0.15, { roughness: 0.95 });
  const grass = new THREE.Mesh(new THREE.CylinderGeometry(3.55, 3.5, 0.22, 80), grassMat);
  grass.position.y = -0.11;
  grass.receiveShadow = true;
  island.add(grass);
  const rimMat = stdTint(0, 0.4, 0.3, { roughness: 0.8 });
  const rim = new THREE.Mesh(new THREE.TorusGeometry(3.53, 0.07, 12, 96), rimMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = -0.02;
  island.add(rim);
  // a stone path round the island
  const pathMat = stdTint(10, 0.24, 0.24, { roughness: 0.9 });
  const path = new THREE.Mesh(new THREE.RingGeometry(2.05, 2.62, 96), pathMat);
  path.rotation.x = -Math.PI / 2;
  path.position.y = 0.006;
  path.receiveShadow = true;
  island.add(path);
  // the rock under the island
  const rockGeo = new THREE.ConeGeometry(3.45, 3.6, 48, 8, true);
  rockGeo.rotateX(Math.PI);
  const rp = rockGeo.attributes.position;
  for (let i = 0; i < rp.count; i++) {
    const x = rp.getX(i);
    const y = rp.getY(i);
    const z = rp.getZ(i);
    const k = 1 + 0.11 * Math.sin(x * 2.1 + z * 1.3) + 0.08 * Math.sin(y * 3.2 + x) ;
    rp.setXYZ(i, x * k, y, z * k);
  }
  rockGeo.computeVertexNormals();
  const rockMat = stdTint(-10, 0.28, 0.16, { roughness: 0.95, flatShading: true });
  const rock = new THREE.Mesh(rockGeo, rockMat);
  rock.position.y = -0.22 - 1.8;
  island.add(rock);
  // small floating rocks round it
  const rocks: THREE.Mesh[] = [];
  for (let i = 0; i < 9; i++) {
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.18 + r() * 0.3, 0), rockMat);
    const a = r() * Math.PI * 2;
    const d = 4.4 + r() * 2.6;
    m.position.set(Math.cos(a) * d, -1 + r() * 2.8, Math.sin(a) * d);
    m.rotation.set(r() * 3, r() * 3, r() * 3);
    scene.add(m);
    rocks.push(m);
  }

  // ------------------------------------------------------------- small things on the island
  const greenMat = stdTint(240, 0.5, 0.38, { roughness: 0.8 });
  const bamboo = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const h = 1.4 + r() * 1.1;
    const st = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, h, 10), greenMat);
    const a = r() * Math.PI * 2;
    const d = r() * 0.5;
    st.position.set(Math.cos(a) * d, h / 2, Math.sin(a) * d);
    st.castShadow = true;
    bamboo.add(st);
    for (let k = 1; k < 4; k++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 6, 14), greenMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(st.position.x, (h / 4) * k, st.position.z);
      bamboo.add(ring);
    }
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), greenMat);
    leaf.scale.set(1.3, 0.35, 0.5);
    leaf.position.set(st.position.x + 0.12, h - 0.1, st.position.z);
    leaf.rotation.z = 0.5;
    bamboo.add(leaf);
  }
  // small groves between the stations, so that they never stand in front of one
  for (let k = 0; k < 5; k++) {
    const g = bamboo.clone();
    const a = Math.PI / 2 + 0.95 + ((k + 0.5) * Math.PI * 2) / 5;
    g.position.set(Math.cos(a) * 3.0, 0, Math.sin(a) * 3.0);
    g.scale.setScalar(0.5);
    g.rotation.y = k * 1.7;
    island.add(g);
  }
  // lanterns
  const lanternMat = glowMat();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.2;
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.55, 8), stdTint(0, 0.2, 0.12));
    post.position.set(Math.cos(a) * 3.15, 0.27, Math.sin(a) * 3.15);
    island.add(post);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 12), lanternMat);
    bulb.position.set(post.position.x, 0.6, post.position.z);
    island.add(bulb);
  }

  // ------------------------------------------------------------- the five stations (the story)
  const STATION_R = 2.35;
  const stationAng = (i: number) => Math.PI / 2 + 0.95 + (i * Math.PI * 2) / 5;
  const stations: THREE.Group[] = [];
  const dark = stdTint(0, 0.3, 0.14, { roughness: 0.6, metalness: 0.2 });
  const stone = stdTint(0, 0.22, 0.3, { roughness: 0.75 });
  const lit = glowMat();

  const box = (w: number, h: number, d: number, m: THREE.Material, x = 0, y = 0, z = 0) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    b.position.set(x, y, z);
    b.castShadow = true;
    b.receiveShadow = true;
    return b;
  };
  const plane = (w: number, h: number, tex: THREE.Texture, x: number, y: number, z: number) => {
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, fog: false, toneMapped: false });
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    p.position.set(x, y, z);
    return p;
  };

  // 1 the office: "a leading IT service company"
  const hq = new THREE.Group();
  {
    const wall = stdTint(0, 0.3, 0.3, { roughness: 0.6 });
    hq.add(box(1.5, 1.35, 1.0, wall, 0, 0.675, 0));
    hq.add(box(1.65, 0.1, 1.15, dark, 0, 1.4, 0));
    hq.add(box(0.7, 1.9, 0.7, wall, 0.95, 0.95, -0.15));
    hq.add(box(0.78, 0.1, 0.78, dark, 0.95, 1.92, -0.15));
    const winMat = glowMat();
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 4; x++) {
        const w = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.22), winMat);
        w.position.set(-0.52 + x * 0.35, 0.36 + y * 0.36, 0.506);
        hq.add(w);
      }
    }
    hq.add(box(0.28, 0.46, 0.04, lit, 0, 0.23, 0.51));
    const sign = plane(1.9, 0.63, labelTexture("We3vision", null, [tint.h, 100, 84]), 0.1, 1.9, 0.2);
    hq.add(sign);
    const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.5, 6), dark);
    ant.position.set(0.95, 2.2, -0.15);
    hq.add(ant);
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), lit);
    beacon.position.set(0.95, 2.48, -0.15);
    hq.add(beacon);
  }
  // 2 the year 2019
  const year = new THREE.Group();
  {
    const wood = stdTint(112, 0.4, 0.26, { roughness: 0.85 });
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 1.5, 10), wood);
    post.position.y = 0.75;
    post.castShadow = true;
    year.add(post);
    const plate = box(1.25, 0.62, 0.07, dark, 0, 1.35, 0.03);
    year.add(plate);
    year.add(plane(1.1, 0.5, labelTexture("2019", "Founded", [tint.h, 100, 84], 512, 256), 0, 1.35, 0.075));
    // a young tree that has just started to grow
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.045, 0.45, 8), wood);
    trunk.position.set(0.85, 0.22, 0.15);
    year.add(trunk);
    for (const [x, y, z, s] of [
      [0.85, 0.62, 0.15, 0.2],
      [0.76, 0.5, 0.2, 0.14],
      [0.95, 0.52, 0.1, 0.14],
    ]) {
      const l = new THREE.Mesh(new THREE.SphereGeometry(s, 14, 12), greenMat);
      l.position.set(x, y, z);
      l.castShadow = true;
      year.add(l);
    }
    year.add(box(0.5, 0.12, 0.35, stone, -0.8, 0.06, 0.25));
  }
  // 3 Surat
  const city = new THREE.Group();
  const pin = new THREE.Group();
  {
    const plateM = stdTint(0, 0.25, 0.18, { roughness: 0.5, metalness: 0.3 });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.0, 0.08, 48), plateM);
    base.position.y = 0.04;
    base.receiveShadow = true;
    city.add(base);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.93, 0.014, 8, 64), lit);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.085;
    city.add(ring);
    const rr = rng(77);
    for (let i = 0; i < 12; i++) {
      const a = rr() * Math.PI * 2;
      const d = rr() * 0.7;
      const h = 0.15 + rr() * 0.62;
      const w = 0.12 + rr() * 0.12;
      const b = box(w, h, w, rr() < 0.3 ? stone : dark, Math.cos(a) * d, 0.08 + h / 2, Math.sin(a) * d);
      city.add(b);
      if (rr() < 0.5) {
        const wl = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.5, h * 0.4), lit);
        wl.position.set(b.position.x, b.position.y + h * 0.1, b.position.z + w / 2 + 0.002);
        city.add(wl);
      }
    }
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.4, 24), glowMat());
    cone.rotation.x = Math.PI;
    cone.position.y = 0;
    pin.add(cone);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.19, 24, 18), accents[accents.length - 1]);
    head.position.y = 0.3;
    pin.add(head);
    const hole = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 10), new THREE.MeshBasicMaterial({ color: 0x120a22 }));
    hole.position.set(0, 0.3, 0.14);
    pin.add(hole);
    pin.position.y = 1.35;
    city.add(pin);
    city.add(plane(1.9, 0.63, labelTexture("Surat", "India · Gujarat", [tint.h, 100, 84]), 0, 2.05, 0));
  }
  // 4 the services: floating tools on a pedestal
  const tools = new THREE.Group();
  const toolItems: THREE.Object3D[] = [];
  let hubRef: THREE.Group | null = null;
  {
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, 0.22, 40), stdTint(0, 0.25, 0.18, { metalness: 0.3, roughness: 0.5 }));
    ped.position.y = 0.11;
    ped.castShadow = true;
    tools.add(ped);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.016, 8, 64), lit);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.23;
    tools.add(ring);
    const hub = new THREE.Group();
    hub.position.y = 1.2;
    tools.add(hub);
    hubRef = hub;
    const make = (k: number) => {
      const g = new THREE.Group();
      const body = stdTint(0, 0.3, 0.2, { roughness: 0.4, metalness: 0.4 });
      if (k === 0) {
        // a monitor
        g.add(box(0.62, 0.4, 0.04, body));
        const sc = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.34), lit);
        sc.position.z = 0.022;
        g.add(sc);
        g.add(box(0.06, 0.12, 0.04, body, 0, -0.26, 0));
      } else if (k === 1) {
        // a phone
        g.add(box(0.22, 0.42, 0.035, body));
        const sc = new THREE.Mesh(new THREE.PlaneGeometry(0.19, 0.37), lit);
        sc.position.z = 0.019;
        g.add(sc);
      } else if (k === 2) {
        // a headset
        const v = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.34, 8, 16), stdTint(0, 0.2, 0.1, { roughness: 0.2, metalness: 0.6 }));
        v.rotation.z = Math.PI / 2;
        v.scale.set(1, 1, 0.8);
        g.add(v);
        const band = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.03, 8, 32, Math.PI), stdTint(0, 0.1, 0.7, { roughness: 1 }));
        band.rotation.set(0, Math.PI, 0);
        band.position.z = -0.08;
        g.add(band);
      } else if (k === 3) {
        // a 3D cube (CGI & animation)
        const c = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.36, 0.36), new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }));
        accents.push(c.material as THREE.MeshBasicMaterial);
        g.add(c);
        const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.12), lit);
        g.add(core);
      } else {
        // cards: branding and CRM
        for (let i = 0; i < 3; i++) {
          const card = box(0.5, 0.32, 0.015, i === 1 ? stone : body, 0, 0, i * 0.06 - 0.06);
          card.rotation.z = (i - 1) * 0.18;
          g.add(card);
        }
      }
      return g;
    };
    for (let i = 0; i < 5; i++) {
      const it = make(i);
      const arm = new THREE.Group();
      arm.rotation.y = (i / 5) * Math.PI * 2;
      it.position.set(0.95, Math.sin(i * 1.7) * 0.18, 0);
      arm.add(it);
      hub.add(arm);
      toolItems.push(arm);
    }
    tools.add(plane(1.9, 0.63, labelTexture("Services", "web · apps · AR/VR · 3D · CRM", [tint.h, 100, 84], 768, 256), 0, 2.2, 0));
  }
  // 5 the mission: a rocket that takes ideas to reality
  const rocket = new THREE.Group();
  const rocketBody = new THREE.Group();
  {
    const padM = stdTint(0, 0.2, 0.2, { roughness: 0.6, metalness: 0.3 });
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.8, 0.12, 40), padM);
    pad.position.y = 0.06;
    pad.receiveShadow = true;
    rocket.add(pad);
    const hull = new THREE.MeshStandardMaterial({ color: 0xf2eefb, roughness: 0.35, metalness: 0.25 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 1.05, 32), hull);
    body.position.y = 0.6;
    body.castShadow = true;
    rocketBody.add(body);
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.44, 32), stdTint(0, 0.9, 0.62, { roughness: 0.3, metalness: 0.2, emissive: 0x000000 }));
    nose.position.y = 1.35;
    nose.castShadow = true;
    rocketBody.add(nose);
    const win = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 16), glowMat());
    win.position.set(0, 0.78, 0.2);
    win.scale.z = 0.5;
    rocketBody.add(win);
    for (let i = 0; i < 3; i++) {
      const fin = box(0.04, 0.38, 0.28, stdTint(0, 0.9, 0.62), 0, 0.2, 0.3);
      const hold = new THREE.Group();
      hold.rotation.y = (i / 3) * Math.PI * 2;
      hold.add(fin);
      rocketBody.add(hold);
    }
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.55, 20), glowMat());
    flame.rotation.x = Math.PI;
    flame.position.y = -0.06;
    flame.name = "flame";
    rocketBody.add(flame);
    rocketBody.position.y = 0.12;
    rocket.add(rocketBody);
    rocket.add(plane(2.2, 0.73, labelTexture("Ideas → Reality", null, [tint.h, 100, 84]), 0, 2.45, 0));
  }
  const groups = [hq, year, city, tools, rocket];
  groups.forEach((g, i) => {
    const a = stationAng(i);
    g.position.set(Math.cos(a) * STATION_R, 0, Math.sin(a) * STATION_R);
    g.rotation.y = Math.PI / 2 - a; // the front looks outwards, to the visitor
    island.add(g);
    stations.push(g);
  });

  // ------------------------------------------------------------- Pando
  const panda = buildPanda();
  panda.group.scale.setScalar(1.15);
  island.add(panda.group);

  // ------------------------------------------------------------- lights
  const amb = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(amb);
  const hemi = new THREE.HemisphereLight(0xcdbbff, 0x1a0f2e, 0.5);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff0ff, 1.25);
  key.position.set(4, 8, 6);
  key.castShadow = !mobile;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -5;
  key.shadow.camera.right = 5;
  key.shadow.camera.top = 5;
  key.shadow.camera.bottom = -5;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 25;
  key.shadow.bias = -0.0005;
  key.shadow.radius = 4;
  scene.add(key);
  const rimLight = new THREE.PointLight(0xffffff, 40, 18, 1.5);
  rimLight.position.set(-5, 3.5, -5);
  scene.add(rimLight);
  const fill = new THREE.PointLight(0xffffff, 10, 14, 1.6);
  fill.position.set(0, 2.5, 3.5);
  scene.add(fill);

  const applyTint = () => {
    const c = accent();
    accents.forEach((m) => m.color.copy(c).lerp(new THREE.Color(0xffffff), 0.3));
    for (const t of tinted) t.m.color.setHSL(((tint.h + t.dh + 360) % 360) / 360, clamp(t.s * tint.s), t.l);
    rimLight.color.setHSL(tint.h / 360, 0.9 * tint.s, 0.65);
    fill.color.setHSL(((tint.h + 20) % 360) / 360, 0.7 * tint.s, 0.7);
    amb.color.setHSL(tint.h / 360, 0.5 * tint.s, 0.6);
    (scene.background as THREE.Color).setHSL(tint.h / 360, 0.6 * tint.s, 0.025);
    (scene.fog as THREE.FogExp2).color.setHSL(tint.h / 360, 0.55 * tint.s, 0.04);
    panda.setAccent(new THREE.Color().setHSL(tint.h / 360, 0.75 * tint.s, 0.55));
  };
  applyTint();

  // ------------------------------------------------------------- post processing
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(512, 512, { type: THREE.HalfFloatType, samples: mobile ? 0 : 4 }));
  composer.addPass(new RenderPass(scene, camera));
  let bloom: UnrealBloomPass | null = null;
  if (!mobile) {
    bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.32, 0.5, 0.9);
    composer.addPass(bloom);
  }
  composer.addPass(new OutputPass());

  // ------------------------------------------------------------- the chapters: where the camera and the panda are
  type Chap = { ang: number; R: number; H: number; look: THREE.Vector3; shift: number; panda: THREE.Vector3 };
  const right = new THREE.Vector3();
  const chap: Chap[] = [];
  // hero: far away, the panda waves in front
  chap.push({ ang: Math.PI / 2 + 0.2, R: 14.5, H: 4.4, look: new THREE.Vector3(0, 0.9, 0), shift: 3.7, panda: new THREE.Vector3(0.7, 0, 2.5) });
  for (let i = 0; i < 5; i++) {
    const a = stationAng(i);
    const out = new THREE.Vector3(Math.cos(a), 0, Math.sin(a));
    right.set(Math.sin(a), 0, -Math.cos(a)); // the right of a camera that looks to the middle
    const pandaPos = out.clone().multiplyScalar(STATION_R + 0.9).addScaledVector(right, 0.95);
    chap.push({ ang: a, R: 8.8, H: 3.0, look: out.clone().multiplyScalar(1.3).add(new THREE.Vector3(0, 0.9, 0)), shift: 2.5, panda: pandaPos });
  }
  // the panda: close, in front
  // (in the gap between the last and the first station, with a grove of bamboo behind it)
  const meetAng = stationAng(4) + Math.PI / 5;
  const meetPos = new THREE.Vector3(Math.cos(meetAng) * 2.95, 0, Math.sin(meetAng) * 2.95);
  chap.push({ ang: meetAng, R: -1.5, H: 1.7, look: meetPos.clone().add(new THREE.Vector3(0, 0.45, 0)), shift: 1.5, panda: meetPos });

  let target = 0;
  let prog = 0;
  let aspect = 1.78;
  let time = 0;
  let fNow = 0;
  const camPos = new THREE.Vector3();
  const lookAt = new THREE.Vector3();
  const pandaPos = chap[0].panda.clone();
  const lastPanda = pandaPos.clone();
  const pointer = new THREE.Vector2(0, 0);
  const lookTarget = new THREE.Vector3();
  const ray = new THREE.Raycaster();
  const focus = new THREE.Vector3();
  const shiftV = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  const fwd = new THREE.Vector3();
  const rgt = new THREE.Vector3();

  const angDiff = (a: number, b: number) => {
    let d = b - a;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    return d;
  };

  const place = (dt: number) => {
    prog += (target - prog) * (1 - Math.exp(-dt * 4.4));
    const q = clamp(prog) * (CHAPTERS - 1);
    const i = Math.min(CHAPTERS - 2, Math.floor(q));
    const u = q - i;
    const s = smooth((u - 0.28) / 0.44);
    fNow = i + s;
    const A = chap[i];
    const B = chap[i + 1];
    const ang = A.ang + angDiff(A.ang, B.ang) * s;
    const R = A.R + (B.R - A.R) * s;
    const H = A.H + (B.H - A.H) * s;
    const shift = A.shift + (B.shift - A.shift) * s;
    lookAt.lerpVectors(A.look, B.look, s);
    camPos.set(Math.cos(ang) * R, H, Math.sin(ang) * R);
    // the island is shown on the right of the screen (the words are on the left); on a tall screen it is shown in the upper part
    fwd.copy(lookAt).sub(camPos).normalize();
    rgt.crossVectors(fwd, up).normalize();
    const portrait = aspect < 0.9;
    if (portrait) {
      shiftV.set(0, -shift * 0.78, 0);
    } else {
      shiftV.copy(rgt).multiplyScalar(-shift * clamp(aspect / 1.78, 0.6, 1.2));
    }
    // the picture is a bit "alive": a very slow float
    camPos.y += Math.sin(time * 0.35) * 0.05;
    camera.position.copy(camPos);
    camera.lookAt(lookAt.clone().add(shiftV));
    camera.fov = portrait ? 56 : 42;
    camera.updateProjectionMatrix();

    // Pando: walks from station to station
    pandaPos.lerpVectors(A.panda, B.panda, s);
    const mv = pandaPos.distanceTo(lastPanda) / Math.max(dt, 0.001);
    lastPanda.copy(pandaPos);
    const walking = clamp(mv / 1.4);
    panda.group.position.copy(pandaPos);
    // where it looks and which way it faces
    const near = Math.round(fNow);
    const atHero = near === 0;
    const atMeet = near === CHAPTERS - 1;
    const st = !atHero && !atMeet ? stations[near - 1] : null;
    if (st) focus.set(st.position.x, 1.0, st.position.z);
    else focus.copy(camPos);
    // the pointer: at the end it looks at the visitor's mouse
    ray.setFromCamera(pointer, camera);
    lookTarget.copy(ray.ray.origin).addScaledVector(ray.ray.direction, 3.5);
    const wp = smooth((fNow - (CHAPTERS - 1.6)) / 0.5);
    lookTarget.lerp(focus, 1 - wp * 0.9);
    let face: number;
    if (walking > 0.25) {
      const dx = (B.panda.x - A.panda.x) * (s < 1 ? 1 : 0);
      const dz = (B.panda.z - A.panda.z) * (s < 1 ? 1 : 0);
      face = Math.atan2(dx, dz);
    } else if (st) {
      // it mostly faces the visitor and turns a little towards the station it shows
      const tx = (st.position.x - pandaPos.x) * 0.3 / 1 + (camPos.x - pandaPos.x) * 0.7 / 8;
      const tz = (st.position.z - pandaPos.z) * 0.3 / 1 + (camPos.z - pandaPos.z) * 0.7 / 8;
      face = Math.atan2(tx, tz);
    } else {
      face = Math.atan2(camPos.x - pandaPos.x, camPos.z - pandaPos.z);
    }
    panda.update(dt, time, lookTarget, {
      face,
      walk: walking,
      wave: (atHero || (atMeet && wp > 0.1)) && walking < 0.3 ? 1 : 0,
      point: st && walking < 0.25 ? 1 : 0,
      talk: 0,
    });

    // things that live on the island
    if (hubRef) hubRef.rotation.y = time * 0.4;
    toolItems.forEach((arm, k) => {
      arm.children[0].rotation.y = time * 0.9 + k;
    });
    pin.position.y = 1.35 + Math.sin(time * 1.8) * 0.07;
    pin.rotation.y = time * 0.9;
    rocketBody.position.y = 0.12 + Math.sin(time * 1.4) * 0.025 + (fNow > 4.6 && fNow < 5.4 ? 0.06 : 0);
    const fl = rocketBody.getObjectByName("flame");
    if (fl) fl.scale.set(1, 0.85 + Math.sin(time * 22) * 0.18, 1);
    rocks.forEach((m, k) => {
      m.position.y += Math.sin(time * 0.5 + k) * 0.0012;
      m.rotation.y += dt * 0.1;
    });
    island.position.y = Math.sin(time * 0.6) * 0.06;
    // at the end the stations have told their story: they shrink away and leave Pando alone under the stars
    const away = smooth((fNow - 5.1) / 0.8);
    groups.forEach((g) => {
      g.scale.setScalar(Math.max(0.0001, 1 - away));
      g.visible = away < 0.995;
    });
    if (bloom) bloom.strength = 0.3 + 0.08 * Math.sin(time * 1.2);
  };

  const resize = (w: number, h: number) => {
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloom?.setSize(w, h);
    aspect = w / h;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  };

  const render = (dtMs: number) => {
    const dt = clamp(dtMs / 1000, 0.001, 0.05);
    time += dt;
    place(dt);
    composer.render();
  };

  return {
    setProgress: (p, immediate = false) => {
      target = clamp(p);
      if (immediate) prog = target;
    },
    setPointer: (x, y) => pointer.set(x * 2 - 1, -(y * 2 - 1)),
    click: (x, y) => {
      ray.setFromCamera(new THREE.Vector2(x * 2 - 1, -(y * 2 - 1)), camera);
      const hit = ray.intersectObject(panda.group, true);
      if (hit.length) {
        panda.hop();
        return true;
      }
      return false;
    },
    setTint: (hue, sat) => {
      tint.h = (hue + 354) % 360;
      tint.s = sat;
      applyTint();
    },
    resize,
    render,
    get chapter() {
      return Math.round(fNow);
    },
    get f() {
      return fNow;
    },
    dispose: () => {
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => {
          (x as THREE.MeshBasicMaterial).map?.dispose();
          x.dispose();
        });
      });
      envTex.dispose();
      pmrem.dispose();
      composer.dispose();
      renderer.dispose();
    },
  };
}
