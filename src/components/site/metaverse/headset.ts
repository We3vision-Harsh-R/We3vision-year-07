import * as THREE from "three";
import { TessellateModifier } from "three/examples/jsm/modifiers/TessellateModifier.js";
import { bandTexture, lensTexture } from "./textures";

// The headset on the table, drawn after the photos of a spatial-computer headset: one big curved glass front (an oval wider than high,
// with a notch for the nose at the bottom and a few sensors in the lower corners) in a thin silver frame, a soft grey light seal, two
// round lenses on the back, and a knitted grey band with ribs. The front looks towards +z, the lenses look towards -z (towards the
// face). Metres.

/** an oval that is wider than high (a rounded "squircle") with a notch for the nose at the bottom */
function ovalShape(a: number, b: number, notch: number, n = 3.4) {
  const s = new THREE.Shape();
  const N = 140;
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2;
    const c = Math.cos(t);
    const si = Math.sin(t);
    const x = a * Math.sign(c) * Math.pow(Math.abs(c), 2 / n);
    let y = b * Math.sign(si) * Math.pow(Math.abs(si), 2 / n);
    if (y < 0) y += notch * Math.exp(-(x * x) / (2 * a * 0.3 * a * 0.3)) * (1 + (y / b) * 0.2);
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  s.closePath();
  return s;
}

/** a rounded extrusion that is bent around the head: the sides move back. The flat faces are cut into small triangles first, so that they bend too. */
function slab(shape: THREE.Shape, depth: number, bevel: number, kx: number, ky: number) {
  let g: THREE.BufferGeometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 5, curveSegments: 40 });
  g = new TessellateModifier(0.0105, 10).modify(g);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    p.setZ(i, p.getZ(i) - kx * x * x - ky * y * y);
  }
  g.computeVertexNormals();
  return g;
}

export type HeadsetParts = {
  group: THREE.Group;
  /** materials that follow the theme colour */
  accent: THREE.MeshBasicMaterial[];
  lenses: THREE.MeshBasicMaterial;
  glass: THREE.MeshPhysicalMaterial;
};

export function buildHeadset(aniso: number): HeadsetParts {
  const group = new THREE.Group();
  const KX = 3.6;
  const KY = 0.9;
  const A = 0.103;
  const B = 0.0485;

  // dark glass with a blue-grey tint, soft reflections (no hot spots)
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x06070d, roughness: 0.22, metalness: 0.5, clearcoat: 0.35, clearcoatRoughness: 0.2, envMapIntensity: 0.9, specularIntensity: 0.4 });
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x9aa0b6, roughness: 0.36, metalness: 1, envMapIntensity: 0.9 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1b1a24, roughness: 0.6, metalness: 0.35 });
  const cushion = new THREE.MeshStandardMaterial({ color: 0x6f6d7a, roughness: 1, metalness: 0 });
  const bandMap = bandTexture(aniso);
  bandMap.repeat.set(26, 1);
  const knit = new THREE.MeshStandardMaterial({ map: bandMap, roughness: 1, metalness: 0, color: 0xbab8c6 });
  const lensGlass = new THREE.MeshBasicMaterial({ map: lensTexture(aniso), transparent: true, opacity: 0.9 });

  // the glass front, a little in front of the frame
  const front = new THREE.Mesh(slab(ovalShape(A - 0.0035, B - 0.0035, 0.0125), 0.006, 0.0035, KX, KY), glass);
  front.position.z = 0.043;
  group.add(front);
  // a thin silver frame round it
  const frame = new THREE.Mesh(slab(ovalShape(A + 0.0015, B + 0.0015, 0.0135), 0.03, 0.003, KX, KY), frameMat);
  frame.position.z = 0.012;
  group.add(frame);
  // the housing
  const body = new THREE.Mesh(slab(ovalShape(A - 0.002, B - 0.002, 0.012), 0.05, 0.003, KX, KY), dark);
  body.position.z = -0.04;
  group.add(body);
  // the light seal: a soft rounded ring with the eye area cut out (and the nose notch)
  const ring = ovalShape(A - 0.008, B - 0.005, 0.012);
  ring.holes.push(new THREE.Path(ovalShape(A - 0.029, B - 0.017, 0.016, 2.8).getPoints(60)));
  const seal = new THREE.Mesh(slab(ring, 0.026, 0.008, KX, KY), cushion);
  seal.position.z = -0.075;
  group.add(seal);

  // two round lenses on the back, seen from behind
  const lensGeo = new THREE.CircleGeometry(0.0215, 48);
  const rimGeo = new THREE.TorusGeometry(0.0222, 0.0022, 14, 56);
  for (const x of [-0.037, 0.037]) {
    const z = -0.052 - KX * x * x;
    const l = new THREE.Mesh(lensGeo, lensGlass);
    l.position.set(x, 0.002, z);
    l.rotation.y = Math.PI;
    group.add(l);
    const rim = new THREE.Mesh(rimGeo, dark);
    rim.position.set(x, 0.002, z + 0.0004);
    group.add(rim);
  }

  // the sensors in the lower corners of the front glass (two small dark lenses each)
  const lensDark = new THREE.MeshStandardMaterial({ color: 0x020205, roughness: 0.15, metalness: 0.8 });
  const sensorRing = new THREE.MeshStandardMaterial({ color: 0x1a2236, roughness: 0.3, metalness: 0.9 });
  for (const sx of [-1, 1]) {
    for (const [dx, dy, r] of [
      [0.066, -0.026, 0.0062],
      [0.079, -0.03, 0.0052],
    ] as [number, number, number][]) {
      const x = sx * dx;
      const y = dy;
      const z = 0.0535 - KX * x * x - KY * y * y;
      const ringM = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.35, r * 1.35, 0.0012, 24), sensorRing);
      ringM.rotation.x = Math.PI / 2;
      ringM.position.set(x, y, z);
      group.add(ringM);
      const dot = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.0016, 24), lensDark);
      dot.rotation.x = Math.PI / 2;
      dot.position.set(x, y, z + 0.0008);
      group.add(dot);
    }
  }

  // the knitted band round the back of the head (a wide ribbed strap) and the strap over the top
  const band = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-0.108, 0, -0.07),
      new THREE.Vector3(-0.122, 0, -0.14),
      new THREE.Vector3(-0.104, 0, -0.215),
      new THREE.Vector3(-0.052, 0, -0.27),
      new THREE.Vector3(0, 0, -0.288),
      new THREE.Vector3(0.052, 0, -0.27),
      new THREE.Vector3(0.104, 0, -0.215),
      new THREE.Vector3(0.122, 0, -0.14),
      new THREE.Vector3(0.108, 0, -0.07),
    ],
    false,
    "catmullrom",
    0.5,
  );
  const bandMesh = new THREE.Mesh(new THREE.TubeGeometry(band, 96, 0.0095, 12, false), knit);
  bandMesh.scale.y = 5.2; // a ribbon: wider than thick
  group.add(bandMesh);
  const strap = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.042, -0.05), new THREE.Vector3(0, 0.095, -0.125), new THREE.Vector3(0, 0.085, -0.225), new THREE.Vector3(0, 0.03, -0.278)]);
  const strapMesh = new THREE.Mesh(new THREE.TubeGeometry(strap, 48, 0.0085, 10, false), knit);
  strapMesh.scale.x = 2.6;
  group.add(strapMesh);
  // the rigid arms where the band meets the housing (silver, with a small pod)
  for (const s of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.03, 0.07), frameMat);
    arm.position.set(s * 0.112, 0, -0.07);
    group.add(arm);
    const pod = new THREE.Mesh(new THREE.CapsuleGeometry(0.012, 0.03, 6, 14), new THREE.MeshStandardMaterial({ color: 0xd8d6e0, roughness: 0.7 }));
    pod.rotation.x = Math.PI / 2;
    pod.position.set(s * 0.12, 0, -0.1);
    group.add(pod);
  }
  // the digital crown and the button on top
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.0075, 0.0075, 0.012, 24), frameMat);
  crown.position.set(0.078, 0.052, 0.006);
  group.add(crown);
  const button = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.006, 0.012), frameMat);
  button.position.set(-0.074, 0.052, 0.006);
  group.add(button);

  group.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  const accentMat = new THREE.MeshBasicMaterial({ color: 0xb487ff, visible: false });
  return { group, accent: [accentMat], lenses: lensGlass, glass };
}

/** the little glowing stand on the table */
export function buildStand(): { group: THREE.Group; accent: THREE.MeshBasicMaterial[] } {
  const group = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.092, 0.016, 64), new THREE.MeshStandardMaterial({ color: 0x1a1722, roughness: 0.3, metalness: 0.7 }));
  base.position.y = 0.008;
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xb487ff });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.078, 0.0016, 12, 96), ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.0165;
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.014, 0.05, 24), new THREE.MeshStandardMaterial({ color: 0x2a2733, roughness: 0.4, metalness: 0.8 }));
  post.position.set(0, 0.04, -0.03);
  const cradle = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.012, 0.06), new THREE.MeshStandardMaterial({ color: 0x15121c, roughness: 0.9 }));
  cradle.position.set(0, 0.05, 0.005);
  group.add(base, ring, post, cradle);
  group.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  return { group, accent: [ringMat] };
}
