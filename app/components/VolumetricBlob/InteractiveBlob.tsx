'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree, type RootState, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shaders';
import { getAdaptiveDetail } from './utils';
import type { InteractiveBlobProps } from './types';
import { gsap } from 'gsap';

// Pulse (scale) config moved here to animate mesh directly instead of DOM container
const PULSE_CONFIG_LOAD = {
  minScale: 0.8,
  duration: 0.8,
  easing: 'sine.inOut',
} as const;

const PULSE_CONFIG_ERROR = {
  minScale: 0.9, // more gentle pulse on error
  duration: 0.5,
  easing: 'sine.inOut',
} as const;

const MAX_RIPPLES = 5; // Must match the #define in the shader

// GSAP Transition settings for color and error state changes
const TRANSITION_CONFIG = {
  duration: 5, // Default transition duration
  loadingDuration: 2, // Faster transition when loading
  errorDuration: 0.3, // Very fast transition for error state
  easing: 'sine.inOut',
} as const;

export const InteractiveBlob: React.FC<InteractiveBlobProps> = ({
  speed = 0.2,
  frequency = 0.6,
  amplitude = 0.3,
  palettes,
  loading = false,
  error = false,
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const { viewport, clock } = useThree();

  const paletteIndex = useRef(0);
  const transitionProgress = useRef(1);

  // The geometry is memoized to prevent expensive recalculations on every render.
  // The detail level is determined adaptively based on the viewport size.
  const geometry = useMemo(
    () => new THREE.IcosahedronGeometry(2, getAdaptiveDetail(viewport).detail),
    [viewport],
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
      // Uniforms for click-based ripple effect, now using arrays for stacking
      u_click_pos: { value: Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector3()) },
      u_click_time: { value: Array.from({ length: MAX_RIPPLES }, () => -1.0) },
    }),
    [amplitude, frequency, speed, colorPalettes],
  );

  const nextRippleIndex = useRef(0);

  const tempColorA = useMemo(() => new THREE.Color(), []);
  const tempColorB = useMemo(() => new THREE.Color(), []);
  const tempColorC = useMemo(() => new THREE.Color(), []);

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();

    if (materialRef.current) {
      const index = nextRippleIndex.current;
      
      // Update the uniforms at the current index
      materialRef.current.uniforms.u_click_pos.value[index].copy(event.point);
      materialRef.current.uniforms.u_click_time.value[index] = clock.getElapsedTime();

      // Move to the next index, wrapping around to the start if needed
      nextRippleIndex.current = (index + 1) % MAX_RIPPLES;
    }
  };

  // Performance: Time-based throttling for ~30fps independent of display refresh rate
  const accumulatedTime = useRef(0);
  const frameInterval = 1 / 30; // Target ~30fps

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

  // Pulsation animation on the mesh scale to replace previous DOM-based approach
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Determine base (original) scale from current scale.x (they are uniform)
    const baseScale = mesh.scale.x;

    if (loading || error) {
      const config = loading ? PULSE_CONFIG_LOAD : PULSE_CONFIG_ERROR;
      gsap.to(mesh.scale, {
        x: baseScale * config.minScale,
        y: baseScale * config.minScale,
        z: baseScale * config.minScale,
        duration: config.duration,
        yoyo: true,
        repeat: -1,
        ease: config.easing,
      });
    } else {
      // Stop ongoing tweens on mesh scale and restore base scale
      gsap.killTweensOf(mesh.scale);
      gsap.to(mesh.scale, {
        x: baseScale,
        y: baseScale,
        z: baseScale,
        duration: 0.3,
        ease: 'power1.out',
      });
    }

    // Cleanup on unmount
    return () => {
      gsap.killTweensOf(mesh.scale);
    };
  }, [loading, error]);

  useFrame((state: RootState, delta: number) => {
    accumulatedTime.current += delta;
    if (accumulatedTime.current < frameInterval) return;
    accumulatedTime.current = 0;
    
    const { clock, mouse } = state;
    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value = clock.getElapsedTime();

      // Smoothly interpolate mouse position for hover effect.
      // A lower value creates more "drag" or inertia. Adjusted from 0.02 to 0.035 for less drag.
      materialRef.current.uniforms.u_mouse.value.lerp(mouse, 0.035);
    }
    
    // Smoothly update loading uniform for shimmer effect
    if (uniforms.u_loading) {
      uniforms.u_loading.value = THREE.MathUtils.lerp(
        uniforms.u_loading.value as number,
        loading ? 1 : 0,
        0.05,
      );
    }

    // Dynamic color transitions
    const transitionDuration = loading
      ? TRANSITION_CONFIG.loadingDuration
      : TRANSITION_CONFIG.duration;

    if (transitionProgress.current < 1) {
      transitionProgress.current += delta / transitionDuration;

      // When transition completes, select next palette and reset progress
      if (transitionProgress.current >= 1.0) {
        transitionProgress.current = 0.0; // Reset for next transition
        paletteIndex.current = (paletteIndex.current + 1) % colorPalettes.length;
      }

      const safeIndex = paletteIndex.current % colorPalettes.length;
      const currentPalette = colorPalettes[safeIndex];
      const nextPalette = colorPalettes[(safeIndex + 1) % colorPalettes.length];

      // Use cached color objects to avoid creating new THREE.Color instances per frame
      tempColorA.copy(currentPalette.a).lerp(nextPalette.a, transitionProgress.current);
      tempColorB.copy(currentPalette.b).lerp(nextPalette.b, transitionProgress.current);
      tempColorC.copy(currentPalette.c).lerp(nextPalette.c, transitionProgress.current);
      
      if (materialRef.current) {
        materialRef.current.uniforms.u_colorA.value.copy(tempColorA);
        materialRef.current.uniforms.u_colorB.value.copy(tempColorB);
        materialRef.current.uniforms.u_colorC.value.copy(tempColorC);
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      scale={Math.min(viewport.width, viewport.height) / 6.66}
      onPointerDown={handlePointerDown}
    >
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