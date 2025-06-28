'use client';

import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, type RootState } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// --- TYPES ----------------------------------------------------
interface BlobShapeParams {
  speed: number;
  frequency: number;
  amplitude: number;
}

// --- SHADERS --------------------------------------------------
const vertexShader = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  uniform float u_time;
  uniform float u_amplitude;
  uniform float u_frequency;
  uniform float u_speed;
  uniform vec2 u_mouse;

  varying vec3 v_normal;
  varying vec3 v_position;
  varying float v_noise;

  void main() {
    float time = u_time * u_speed;
    float displacement = snoise(position * u_frequency + time);

    vec3 mouse_effect = vec3(u_mouse * 2.0, 0.0);
    float mouse_influence = snoise(position * 0.5 + mouse_effect);

    v_noise = snoise(position * u_frequency + time);
    vec3 newPosition = position + normal * (v_noise * u_amplitude + mouse_influence * 0.1);

    v_normal = normalize(normal);
    v_position = newPosition;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  uniform float u_time;
  uniform vec3 u_colorA;
  uniform vec3 u_colorB;
  uniform vec3 u_colorC;

  varying vec3 v_normal;
  varying vec3 v_position;
  varying float v_noise;

  void main() {
    vec3 view_dir = normalize(cameraPosition - v_position);
    float fresnel = 1.0 - dot(view_dir, v_normal);
    fresnel = pow(fresnel, 2.0);

    vec3 color = mix(u_colorA, u_colorB, v_noise * 0.5 + 0.5);

    float swirl = sin(dot(v_position.xy, vec2(5.0, 5.0)) + u_time * 0.5) * 0.5 + 0.5;
    color = mix(color, u_colorA, swirl * 0.5);

    float time_factor = sin(u_time * 0.5 + v_position.y * 2.0) * 0.5 + 0.5;
    color = mix(color, u_colorB, time_factor * 0.3);

    color = mix(color, u_colorC, fresnel);

    gl_FragColor = vec4(color, 1.0);
  }
`;

// --- HELPER COMPONENT ----------------------------------------
const InteractiveBlob = (
  {
    speed,
    frequency,
    amplitude,
    palettes,
    transitionDuration = 5,
  }: BlobShapeParams & { palettes: { a: string; b: string; c: string }[]; transitionDuration?: number },
) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const { viewport } = useThree();

  const paletteIndex = useRef(0);
  const transitionProgress = useRef(0);

  const colorPalettes = useMemo(
    () =>
      palettes.map((p) => ({
        a: new THREE.Color(p.a),
        b: new THREE.Color(p.b),
        c: new THREE.Color(p.c),
      })),
    [palettes],
  );

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_amplitude: { value: amplitude },
      u_frequency: { value: frequency },
      u_speed: { value: speed },
      u_colorA: { value: colorPalettes[0].a.clone() },
      u_colorB: { value: colorPalettes[0].b.clone() },
      u_colorC: { value: colorPalettes[0].c.clone() },
      u_mouse: { value: new THREE.Vector2(0, 0) },
    }),
    [amplitude, frequency, speed, colorPalettes],
  );

  useFrame((state: RootState, delta: number) => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.u_time.value = state.clock.getElapsedTime();
    materialRef.current.uniforms.u_mouse.value.lerp(state.mouse, 0.05);

    transitionProgress.current += delta / transitionDuration;

    if (transitionProgress.current > 1.0) {
      transitionProgress.current = 0.0;
      paletteIndex.current = (paletteIndex.current + 1) % colorPalettes.length;
    }

    const currentPalette = colorPalettes[paletteIndex.current];
    const nextPalette = colorPalettes[(paletteIndex.current + 1) % colorPalettes.length];

    materialRef.current.uniforms.u_colorA.value
      .copy(currentPalette.a)
      .lerp(nextPalette.a, transitionProgress.current);
    materialRef.current.uniforms.u_colorB.value
      .copy(currentPalette.b)
      .lerp(nextPalette.b, transitionProgress.current);
    materialRef.current.uniforms.u_colorC.value
      .copy(currentPalette.c)
      .lerp(nextPalette.c, transitionProgress.current);
  });

  return (
    <mesh ref={meshRef} scale={Math.min(viewport.width, viewport.height) / 5}>
      <icosahedronGeometry args={[2, 128]} />
      {/* @ts-expect-error – shaderMaterial intrinsic typings are provided by @react-three/fiber but not recognised by the linter here */}
      <shaderMaterial ref={materialRef} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
    </mesh>
  );
};

// --- COLOR PALETTES -----------------------------------------
const colorPalettes = [
  { a: '#ff6b6b', b: '#f0e68c', c: '#48dbfb' },
  { a: '#ff8a00', b: '#e52e71', c: '#4f4f4f' },
  { a: '#6a11cb', b: '#2575fc', c: '#ffffff' },
  { a: '#00c9ff', b: '#92fe9d', c: '#f0f0f0' },
  { a: '#ff7e5f', b: '#feb47b', c: '#d3d3d3' },
  { a: '#8e2de2', b: '#4a00e0', c: '#90f3ff' },
  { a: '#ff71ce', b: '#01cdfe', c: '#05ffa1' },
  { a: '#ff5e62', b: '#ff9966', c: '#f0f0f0' },
  { a: '#138808', b: '#228B22', c: '#556B2F' },
  { a: '#373B44', b: '#4286f4', c: '#ffffff' },
  { a: '#ff0000', b: '#00ff00', c: '#0000ff' },
  { a: '#2c3e50', b: '#bdc3c7', c: '#ffffff' },
];

// --- UTILS ---------------------------------------------------
let keyCounter = 0;
const generateRandomParams = (): BlobShapeParams => ({
  speed: Math.random() * 0.3 + 0.1,
  frequency: Math.random() * 0.8 + 0.5,
  amplitude: Math.random() * 0.4 + 0.2,
});

// --- PUBLIC COMPONENT ---------------------------------------
export default function VolumetricBlob() {
  const [blobParams] = useState(() => ({ key: keyCounter++, ...generateRandomParams() }));

  const { key, ...shapeParams } = blobParams;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} key={key}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <InteractiveBlob key={key} {...shapeParams} palettes={colorPalettes} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
} 