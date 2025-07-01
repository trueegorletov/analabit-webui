'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree, type RootState } from '@react-three/fiber';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shaders';
import { errorPalettes } from './colorPalettes';
import { getAdaptiveDetail } from './utils';
import type { InteractiveBlobProps } from './types';
import { gsap } from 'gsap';

export const InteractiveBlob = ({
  speed,
  frequency,
  amplitude,
  palettes,
  transitionDuration = 5,
  loading = false,
  error = false,
}: InteractiveBlobProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const { viewport } = useThree();

  const paletteIndex = useRef(0);
  const transitionProgress = useRef(0);
  const errorPaletteIndex = useRef(0);
  const errorTransitionProgress = useRef(0);

  // Performance optimization: Adaptive detail based on viewport size using shared utility
  const detail = useMemo(() => {
    const { detail } = getAdaptiveDetail(viewport);
    return detail;
  }, [viewport]);

  // Memoize geometry to prevent recreation
  const geometry = useMemo(
    () => new THREE.IcosahedronGeometry(2, detail),
    [detail],
  );

  // Cleanup geometry on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

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

  // Memoize error color palettes
  const errorColorPalettes = useMemo(
    () =>
      errorPalettes.map((p) => ({
        a: new THREE.Color(p.a),
        b: new THREE.Color(p.b),
        c: new THREE.Color(p.c),
      })),
    [],
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
      u_loading: { value: 0 },
      u_error_mix_factor: { value: 0 },
      u_error_colorA: { value: new THREE.Color() },
      u_error_colorB: { value: new THREE.Color() },
      u_error_colorC: { value: new THREE.Color() },
    }),
    [amplitude, frequency, speed, colorPalettes],
  );

  // Cached color objects to avoid .copy().lerp() allocation every frame
  const tempColorA = useMemo(() => new THREE.Color(), []);
  const tempColorB = useMemo(() => new THREE.Color(), []);
  const tempColorC = useMemo(() => new THREE.Color(), []);
  const tempErrorColorA = useMemo(() => new THREE.Color(), []);
  const tempErrorColorB = useMemo(() => new THREE.Color(), []);
  const tempErrorColorC = useMemo(() => new THREE.Color(), []);

  // Performance: Time-based throttling for ~30fps independent of display refresh rate
  const accumulatedTime = useRef(0);
  const lastMouseUpdate = useRef(0);
  const TARGET_FPS = 30; // Target 30fps for non-critical updates
  const UPDATE_INTERVAL = 1 / TARGET_FPS; // ~33ms

  useEffect(() => {
    // Animate shader uniform directly instead of using indirect reference
    if (materialRef.current) {
      gsap.to(materialRef.current.uniforms.u_error_mix_factor, {
      value: error ? 1 : 0,
      duration: 1.9, // Quick but smooth
      ease: 'power2.inOut',
    });
    }
  }, [error]);

  useFrame((state: RootState, delta: number) => {
    if (!materialRef.current) return;

    accumulatedTime.current += delta;
    
    // Performance: Time-based throttling for ~30fps independent of display refresh rate
    const shouldUpdate = accumulatedTime.current >= UPDATE_INTERVAL;
    if (shouldUpdate) {
      accumulatedTime.current = 0;
    }

    // Always update time for smooth animation
    materialRef.current.uniforms.u_time.value = state.clock.getElapsedTime();
    
    // Mouse interaction with throttling (only update periodically)
    const now = state.clock.getElapsedTime();
    if (shouldUpdate || now - lastMouseUpdate.current > 0.016) { // ~60fps max mouse updates
      materialRef.current.uniforms.u_mouse.value.lerp(state.mouse, 0.05);
      lastMouseUpdate.current = now;
    }

    // Smoothly update loading uniform for shimmer effect
    uniforms.u_loading.value = THREE.MathUtils.lerp(
      uniforms.u_loading.value as number,
      loading ? 1 : 0,
      0.05,
    );

    // Synchronous safety check
    if (paletteIndex.current >= colorPalettes.length) {
      paletteIndex.current = 0;
    }
    if (errorPaletteIndex.current >= errorColorPalettes.length) {
      errorPaletteIndex.current = 0;
    }

    // Error mix factor is now animated directly by GSAP, no manual update needed

    // Normal color transition logic - only update when necessary
    if (shouldUpdate) {
      transitionProgress.current += delta / transitionDuration;

      if (transitionProgress.current > 1.0) {
        transitionProgress.current = 0.0;
        paletteIndex.current = (paletteIndex.current + 1) % colorPalettes.length;
      }

      const safeIndex = paletteIndex.current % colorPalettes.length;
      const currentPalette = colorPalettes[safeIndex];
      const nextPalette = colorPalettes[(safeIndex + 1) % colorPalettes.length];

      // Use cached color objects instead of .copy() to avoid allocation
      tempColorA.copy(currentPalette.a).lerp(nextPalette.a, transitionProgress.current);
      tempColorB.copy(currentPalette.b).lerp(nextPalette.b, transitionProgress.current);
      tempColorC.copy(currentPalette.c).lerp(nextPalette.c, transitionProgress.current);

      // Update uniform values directly
      materialRef.current.uniforms.u_colorA.value.copy(tempColorA);
      materialRef.current.uniforms.u_colorB.value.copy(tempColorB);
      materialRef.current.uniforms.u_colorC.value.copy(tempColorC);
    }

    // Error color transition (runs in parallel)
    errorTransitionProgress.current += delta / (error ? 1 : 5);
    if (errorTransitionProgress.current > 1.0) {
      errorTransitionProgress.current = 0.0;
      errorPaletteIndex.current = (errorPaletteIndex.current + 1) % errorColorPalettes.length;
    }
    const currentErrorPalette = errorColorPalettes[errorPaletteIndex.current];
    const nextErrorPalette = errorColorPalettes[(errorPaletteIndex.current + 1) % errorColorPalettes.length];
    
    tempErrorColorA.copy(currentErrorPalette.a).lerp(nextErrorPalette.a, errorTransitionProgress.current);
    tempErrorColorB.copy(currentErrorPalette.b).lerp(nextErrorPalette.b, errorTransitionProgress.current);
    tempErrorColorC.copy(currentErrorPalette.c).lerp(nextErrorPalette.c, errorTransitionProgress.current);

    uniforms.u_error_colorA.value.copy(tempErrorColorA);
    uniforms.u_error_colorB.value.copy(tempErrorColorB);
    uniforms.u_error_colorC.value.copy(tempErrorColorC);
  });

  return (
    <mesh ref={meshRef} scale={Math.min(viewport.width, viewport.height) / 6.66}>
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