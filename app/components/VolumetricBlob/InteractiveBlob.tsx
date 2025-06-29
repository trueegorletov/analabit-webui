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

  // Performance optimization: Adaptive detail based on viewport size
  const detail = useMemo(() => {
    const isMobile = viewport.width < 6; // Rough mobile detection in r3f units
    
    if (isMobile) return 24;      // Mobile: ~10k vertices
    return 32;                    // Desktop: ~41k vertices (down from 655k!)
  }, [viewport.width]);

  // Memoize geometry to prevent recreation
  const geometry = useMemo(
    () => new THREE.IcosahedronGeometry(2, detail),
    [detail],
  );

  // Pre-convert color palettes to THREE.Color objects and cache them
  const colorPalettes = useMemo(
    () =>
      palettes.map((p) => ({
        a: new THREE.Color(p.a),
        b: new THREE.Color(p.b),
        c: new THREE.Color(p.c),
      })),
    [palettes],
  );

  // Memoize uniforms to prevent recreation
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

  // Cached color objects to avoid .copy().lerp() allocation every frame
  const tempColorA = useMemo(() => new THREE.Color(), []);
  const tempColorB = useMemo(() => new THREE.Color(), []);
  const tempColorC = useMemo(() => new THREE.Color(), []);

  // Performance: Frame rate control
  const frameCount = useRef(0);
  const lastMouseUpdate = useRef(0);

  useFrame((state: RootState, delta: number) => {
    if (!materialRef.current) return;

    frameCount.current += 1;
    
    // Performance: Skip every other frame for non-critical updates (30fps effective rate)
    const shouldUpdate = frameCount.current % 2 === 0;

    // Always update time for smooth animation
    materialRef.current.uniforms.u_time.value = state.clock.getElapsedTime();
    
    // Mouse interaction with throttling (only update periodically)
    const now = state.clock.getElapsedTime();
    if (shouldUpdate || now - lastMouseUpdate.current > 0.016) { // ~60fps max mouse updates
      materialRef.current.uniforms.u_mouse.value.lerp(state.mouse, 0.05);
      lastMouseUpdate.current = now;
    }

    // Color transition logic - only update when necessary
    if (shouldUpdate) {
      transitionProgress.current += delta / transitionDuration;

      if (transitionProgress.current > 1.0) {
        transitionProgress.current = 0.0;
        paletteIndex.current = (paletteIndex.current + 1) % colorPalettes.length;
      }

      const currentPalette = colorPalettes[paletteIndex.current];
      const nextPalette = colorPalettes[(paletteIndex.current + 1) % colorPalettes.length];

      // Use cached color objects instead of .copy() to avoid allocation
      tempColorA.copy(currentPalette.a).lerp(nextPalette.a, transitionProgress.current);
      tempColorB.copy(currentPalette.b).lerp(nextPalette.b, transitionProgress.current);
      tempColorC.copy(currentPalette.c).lerp(nextPalette.c, transitionProgress.current);

      // Update uniform values directly
      materialRef.current.uniforms.u_colorA.value.copy(tempColorA);
      materialRef.current.uniforms.u_colorB.value.copy(tempColorB);
      materialRef.current.uniforms.u_colorC.value.copy(tempColorC);
    }
  });

  return (
    <mesh ref={meshRef} scale={Math.min(viewport.width, viewport.height) / 5}>
      <primitive object={geometry} attach="geometry" />
      <shaderMaterial 
        ref={materialRef} 
        vertexShader={vertexShader} 
        fragmentShader={fragmentShader} 
        uniforms={uniforms} 
      />
    </mesh>
  );
}; 