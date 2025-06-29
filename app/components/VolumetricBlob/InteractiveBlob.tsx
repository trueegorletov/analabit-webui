'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame, useThree, type RootState } from '@react-three/fiber';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shaders';
import type { InteractiveBlobProps } from './types';

export const InteractiveBlob = ({
  speed,
  frequency,
  amplitude,
  palettes,
  transitionDuration = 5,
}: InteractiveBlobProps) => {
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
      <shaderMaterial ref={materialRef} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
    </mesh>
  );
}; 