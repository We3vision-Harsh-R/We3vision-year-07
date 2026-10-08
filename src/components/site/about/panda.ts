import * as THREE from "three";

// Pando, the little panda of We3vision: a cute chibi panda built from soft spheres (big round head, black ears and eye patches, small
// shiny eyes, a pink nose and blush, a round belly, short black arms and legs). It wears a lilac lanyard with a badge, the brand's colour.
// It blinks, breathes, looks at things, waves, points, hops and walks with little steps. Metres; it is about 0.95 m high and faces +z.

export type PandaLook = { x: number; y: number; z: number };

export type Panda = {
  group: THREE.Group;
  /** the panda looks at this point of the world (head), and its body turns to `face` (an angle round y) */
  update: (dt: number, time: number, look: THREE.Vector3, o: { face: number; walk: number; wave: number; point: number; talk: number }) => void;
  hop: () => void;
  setAccent: (c: THREE.Color) => void;
  head: THREE.Object3D;
};

const sphere = (r: number, mat: THREE.Material, sx = 1, sy = 1, sz = 1, seg = 40) => {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.round(seg * 0.7)), mat);
  m.scale.set(sx, sy, sz);
  m.castShadow = true;
  return m;
};

function badgeTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  g.fillStyle = "#f4eeff";
  g.fillRect(0, 0, 128, 128);
  g.fillStyle = "#6a3fd0";
  g.fillRect(0, 0, 128, 26);
  g.strokeStyle = "#6a3fd0";
  g.lineWidth = 11;
  g.lineJoin = "round";
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(30, 52);
  g.lineTo(48, 108);
  g.lineTo(64, 74);
  g.lineTo(80, 108);
  g.lineTo(98, 52);
  g.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function buildPanda(): Panda {
  const root = new THREE.Group();
  const white = new THREE.MeshStandardMaterial({ color: 0xe9e4f0, roughness: 0.82, metalness: 0, emissive: 0x120e18, emissiveIntensity: 0.2 });
  const black = new THREE.MeshStandardMaterial({ color: 0x1a1620, roughness: 0.6, metalness: 0 });
  const pink = new THREE.MeshStandardMaterial({ color: 0xff9db8, roughness: 0.7, transparent: true, opacity: 0.6 });
  const nose = new THREE.MeshStandardMaterial({ color: 0x0f0c14, roughness: 0.25, metalness: 0.2 });
  const lan = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.55, emissive: 0x3b1c8c, emissiveIntensity: 0.5 });

  // the whole body can bounce and turn
  const rig = new THREE.Group();
  root.add(rig);
  const body = new THREE.Group();
  rig.add(body);

  // belly and back
  const torso = sphere(0.3, white, 1.02, 1.08, 0.92);
  torso.position.y = 0.4;
  body.add(torso);
  const belly = sphere(0.22, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85, emissive: 0x201a2c, emissiveIntensity: 0.2 }), 1, 1.05, 0.5);
  belly.position.set(0, 0.38, 0.19);
  belly.castShadow = false;
  body.add(belly);
  const tail = sphere(0.075, white);
  tail.position.set(0, 0.26, -0.27);
  body.add(tail);

  // legs: short black stumps with pink pads
  const legs: THREE.Group[] = [];
  for (const s of [-1, 1]) {
    const leg = new THREE.Group();
    leg.position.set(s * 0.15, 0.2, 0.02);
    const l = sphere(0.1, black, 0.95, 1.4, 1.1);
    l.position.y = -0.06;
    leg.add(l);
    const foot = sphere(0.085, black, 1.05, 0.7, 1.3);
    foot.position.set(0, -0.15, 0.06);
    leg.add(foot);
    const pad = sphere(0.035, pink, 1, 0.5, 1.1, 16);
    pad.position.set(0, -0.17, 0.14);
    leg.add(pad);
    body.add(leg);
    legs.push(leg);
  }

  // arms: pivot at the shoulder
  const arms: THREE.Group[] = [];
  for (const s of [-1, 1]) {
    const arm = new THREE.Group();
    arm.position.set(s * 0.29, 0.58, 0.02);
    const a = sphere(0.075, black, 0.9, 2.0, 0.95);
    a.position.y = -0.1;
    arm.add(a);
    const hand = sphere(0.062, black, 1, 1, 1, 20);
    hand.position.y = -0.22;
    arm.add(hand);
    arm.rotation.z = s * 0.35;
    body.add(arm);
    arms.push(arm);
  }

  // lanyard with the badge
  const lanyard = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.012, 10, 48, Math.PI * 0.95), lan);
  lanyard.rotation.set(Math.PI * 1.05, 0, Math.PI * 0.02);
  lanyard.position.set(0, 0.64, 0.12);
  lanyard.scale.set(1, 1.15, 0.9);
  body.add(lanyard);
  const badge = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.13, 0.014), [lan, lan, lan, lan, new THREE.MeshStandardMaterial({ map: badgeTexture(), roughness: 0.5 }), lan]);
  badge.position.set(0, 0.42, 0.27);
  badge.castShadow = true;
  body.add(badge);

  // head
  const neck = new THREE.Group();
  neck.position.set(0, 0.66, 0.02);
  body.add(neck);
  const head = new THREE.Group();
  head.position.y = 0.2;
  neck.add(head);
  const skull = sphere(0.31, white, 1.12, 0.94, 1.0, 56);
  head.add(skull);
  // ears
  const ears: THREE.Mesh[] = [];
  for (const s of [-1, 1]) {
    const e = sphere(0.1, black, 1, 1, 0.7, 28);
    e.position.set(s * 0.25, 0.24, -0.02);
    head.add(e);
    ears.push(e);
    const inner = sphere(0.045, new THREE.MeshStandardMaterial({ color: 0x3a2f48, roughness: 0.7 }), 1, 1, 0.5, 16);
    inner.position.set(s * 0.25, 0.24, 0.045);
    inner.castShadow = false;
    head.add(inner);
  }
  // eye patches (tilted ovals), eyes and blush
  const eyeLids: THREE.Mesh[] = [];
  const pupils: THREE.Group[] = [];
  for (const s of [-1, 1]) {
    const patch = sphere(0.085, black, 0.8, 1.2, 0.55, 32);
    patch.position.set(s * 0.125, 0.0, 0.265);
    patch.rotation.z = s * -0.38;
    head.add(patch);
    const eye = new THREE.Group();
    eye.position.set(s * 0.122, 0.005, 0.318);
    const ball = sphere(0.034, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 }), 1, 1.12, 0.7, 24);
    eye.add(ball);
    eyeLids.push(ball);
    const pupil = new THREE.Group();
    const p = sphere(0.021, new THREE.MeshStandardMaterial({ color: 0x080508, roughness: 0.15 }), 1, 1.05, 0.7, 20);
    p.position.z = 0.012;
    pupil.add(p);
    const glint = sphere(0.0075, new THREE.MeshBasicMaterial({ color: 0xffffff }), 1, 1, 1, 10);
    glint.position.set(0.008, 0.01, 0.026);
    pupil.add(glint);
    eye.add(pupil);
    pupils.push(pupil);
    head.add(eye);
    const blush = sphere(0.045, pink, 1.4, 0.8, 0.3, 20);
    blush.position.set(s * 0.215, -0.085, 0.265);
    blush.rotation.y = s * 0.55;
    blush.castShadow = false;
    head.add(blush);
  }
  // snout, nose, smile
  const snout = sphere(0.1, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 }), 1.15, 0.8, 0.8, 32);
  snout.position.set(0, -0.085, 0.27);
  head.add(snout);
  const noseM = sphere(0.032, nose, 1.3, 0.8, 0.9, 20);
  noseM.position.set(0, -0.045, 0.345);
  head.add(noseM);
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.036, 0.0045, 8, 24, Math.PI), new THREE.MeshBasicMaterial({ color: 0x2a1f33 }));
  smile.rotation.z = Math.PI;
  smile.position.set(0, -0.092, 0.352);
  head.add(smile);
  const mouth = sphere(0.03, new THREE.MeshStandardMaterial({ color: 0x5a1c34, roughness: 0.6 }), 1.1, 0.5, 0.4, 16);
  mouth.position.set(0, -0.12, 0.337);
  mouth.visible = false;
  head.add(mouth);

  // ---- animation state
  let hopT = 1;
  let blinkT = 2.5;
  let blink = 0;
  let walkPhase = 0;
  let yaw = 0;
  const tmp = new THREE.Vector3();
  const lookQ = new THREE.Quaternion();
  const headWorld = new THREE.Vector3();
  const headDir = new THREE.Vector3();
  let headYaw = 0;
  let headPitch = 0;
  let waveNow = 0;
  let pointNow = 0;
  let walkNow = 0;

  const update: Panda["update"] = (dt, time, look, o) => {
    // the body turns to face the wanted angle (with a little overshoot, like a toy)
    let d = o.face - yaw;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    yaw += d * (1 - Math.exp(-dt * 7));
    rig.rotation.y = yaw;

    // walking: little steps, a bounce and a lean
    walkNow += (o.walk - walkNow) * (1 - Math.exp(-dt * 8));
    walkPhase += dt * (8 + walkNow * 6) * walkNow;
    const step = Math.sin(walkPhase);
    legs[0].rotation.x = step * 0.7 * walkNow;
    legs[1].rotation.x = -step * 0.7 * walkNow;
    const bounce = Math.abs(Math.sin(walkPhase)) * 0.07 * walkNow;

    // hop (a click)
    let hopY = 0;
    if (hopT < 1) {
      hopT = Math.min(1, hopT + dt / 0.7);
      hopY = Math.sin(hopT * Math.PI) * 0.28;
      body.scale.set(1 + (hopT < 0.15 || hopT > 0.85 ? 0.06 : -0.03), 1 + (hopT < 0.15 || hopT > 0.85 ? -0.07 : 0.04), 1);
    } else {
      const br = Math.sin(time * 1.9) * 0.012;
      body.scale.set(1 - br * 0.5, 1 + br, 1 - br * 0.5);
    }
    body.position.y = bounce + hopY;
    body.rotation.z = Math.sin(walkPhase * 0.5) * 0.08 * walkNow;
    body.rotation.x = 0.08 * walkNow;

    // arms: the right one waves or points, the left one swings or rests
    waveNow += (o.wave - waveNow) * (1 - Math.exp(-dt * 6));
    pointNow += (o.point - pointNow) * (1 - Math.exp(-dt * 6));
    const wv = Math.sin(time * 7) * 0.35;
    arms[1].rotation.z = 0.35 + waveNow * (2.3 + wv) - pointNow * 0.1;
    arms[1].rotation.x = -pointNow * 1.35 + (hopT < 1 ? -0.9 * Math.sin(hopT * Math.PI) : 0);
    arms[0].rotation.z = -0.35 - (hopT < 1 ? 0.9 * Math.sin(hopT * Math.PI) : 0);
    arms[0].rotation.x = -step * 0.6 * walkNow;
    if (walkNow > 0.2) arms[1].rotation.x += step * 0.6 * walkNow;

    // the head looks at the wanted point
    head.getWorldPosition(headWorld);
    headDir.copy(look).sub(headWorld);
    const inv = new THREE.Quaternion().copy(rig.getWorldQuaternion(lookQ)).invert();
    tmp.copy(headDir).applyQuaternion(inv);
    const ty = Math.atan2(tmp.x, tmp.z);
    const tp = -Math.atan2(tmp.y, Math.hypot(tmp.x, tmp.z));
    headYaw += (THREE.MathUtils.clamp(ty, -1.0, 1.0) - headYaw) * (1 - Math.exp(-dt * 9));
    headPitch += (THREE.MathUtils.clamp(tp, -0.45, 0.4) - headPitch) * (1 - Math.exp(-dt * 9));
    neck.rotation.set(headPitch * 0.8, headYaw * 0.85, Math.sin(time * 1.1) * 0.025 + headYaw * -0.08);
    // the pupils follow a little more
    for (const p of pupils) p.position.set(THREE.MathUtils.clamp(headYaw * 0.01, -0.01, 0.01), THREE.MathUtils.clamp(-headPitch * 0.01, -0.008, 0.008), 0);

    // blink, ears and talking
    blinkT -= dt;
    if (blinkT < 0) {
      blink = 1;
      blinkT = 2 + Math.random() * 3.2;
    }
    blink = Math.max(0, blink - dt * 7);
    const lid = 1 - Math.sin(Math.min(1, blink) * Math.PI) * 0.92;
    for (const e of eyeLids) e.scale.y = 1.12 * lid;
    ears[0].rotation.z = Math.sin(time * 1.4) * 0.06;
    ears[1].rotation.z = -Math.sin(time * 1.4 + 1) * 0.06;
    mouth.visible = o.talk > 0.5;
    if (mouth.visible) mouth.scale.y = 0.35 + Math.abs(Math.sin(time * 14)) * 0.5;
    smile.visible = !mouth.visible;
  };

  return {
    group: root,
    update,
    hop: () => {
      hopT = 0;
    },
    setAccent: (c) => {
      lan.color.copy(c);
      lan.emissive.copy(c).multiplyScalar(0.35);
    },
    head,
  };
}
