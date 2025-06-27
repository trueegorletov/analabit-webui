'use client';

import React, { useMemo, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { interpolate } from 'flubber';

// Animation constants - extracted from magic numbers
const ANIMATION_CONFIG = {
  morphDuration: { min: 3, max: 4.5 },
  gradientDuration: { min: 3, max: 4.5 },
  breathingDuration: 5,
  pulseDuration: 0.6,
  pulseScale: 1.06,
  pulseInterval: { min: 10, max: 20 },
  breathingOffset: -6,
  rotationRange: { min: -10, max: 10 },
  gradientRotationStep: { min: 45, max: 135 },
} as const;

// SVG paths and gradients - moved to top level constants
const blobPaths = [
  'M421,308Q370,366,308,421Q246,476,184,421Q122,366,71,308Q20,250,71,192Q122,134,184,79Q246,24,308,79Q370,134,421,192Q472,250,421,308Z',
  'M400,300Q350,350,300,400Q250,450,200,400Q150,350,100,300Q50,250,100,200Q150,150,200,100Q250,50,300,100Q350,150,400,200Q450,250,400,300Z',
  'M420,320Q370,390,320,420Q270,450,220,420Q170,390,120,320Q70,250,120,180Q170,110,220,80Q270,50,320,80Q370,110,420,180Q470,250,420,320Z',
  'M410,310Q360,370,310,410Q260,450,190,430Q120,410,90,340Q60,270,90,200Q120,130,190,100Q260,70,310,110Q360,150,410,190Q460,230,410,310Z',
  'M430,300Q380,360,320,400Q260,440,200,400Q140,360,100,300Q60,240,100,180Q140,120,200,90Q260,60,320,90Q380,120,430,160Q480,200,430,300Z',
] as const;

const gradients = [
  ['#ff5e62', '#ff7b5e', '#ff9966', '#9c7dff', '#5f72be'],
  ['#7de2fc', '#87f5fb', '#b9b6e5', '#ffcab1', '#ffb199'],
  ['#f7971e', '#ffad0d', '#ffd200', '#16c9e7', '#21d4fd'],
] as const;

// Utility functions
const getRandomDuration = (config: { min: number; max: number }) =>
  config.min + Math.random() * (config.max - config.min);

const getRandomRotation = () =>
  ANIMATION_CONFIG.rotationRange.min +
  Math.random() *
    (ANIMATION_CONFIG.rotationRange.max - ANIMATION_CONFIG.rotationRange.min);

const getRandomGradientAngle = (currentAngle: number) =>
  currentAngle +
  ANIMATION_CONFIG.gradientRotationStep.min +
  Math.random() *
    (ANIMATION_CONFIG.gradientRotationStep.max -
      ANIMATION_CONFIG.gradientRotationStep.min);

export default function AnimatedBlob() {
  // Motion values for path and colors
  const pathProgress = useMotionValue(0);
  const gradientProgress = useMotionValue(0);
  const currentRotation = useMotionValue(0);
  const gradientAngle = useMotionValue(0);

  // Create path interpolators
  const pathInterpolators = useMemo(() => {
    return blobPaths.map((_, index) => {
      const nextIndex = (index + 1) % blobPaths.length;
      return interpolate(blobPaths[index], blobPaths[nextIndex], {
        maxSegmentLength: 10,
      });
    });
  }, []);

  // Transform path progress to actual path
  const animatedPath = useTransform(pathProgress, (progress) => {
    const pathIndex = Math.floor(progress) % blobPaths.length;
    const interpolator = pathInterpolators[pathIndex];
    const localProgress = progress - Math.floor(progress);

    return interpolator ? interpolator(localProgress) : blobPaths[0];
  });

  // Transform gradient progress to colors
  const gradientColors = useTransform(gradientProgress, (progress) => {
    const gradIndex = Math.floor(progress) % gradients.length;
    const nextGradIndex = (gradIndex + 1) % gradients.length;
    const localProgress = progress - Math.floor(progress);

    const currentGrad = gradients[gradIndex];
    const nextGrad = gradients[nextGradIndex];

    // Simple color interpolation for demonstration
    // In a real implementation, you might want more sophisticated color blending
    return localProgress < 0.5 ? currentGrad : nextGrad;
  });

  // Start animations
  React.useEffect(() => {
    let isMounted = true;

    // Path morphing animation
    const animatePath = async () => {
      while (isMounted) {
        const duration = getRandomDuration(ANIMATION_CONFIG.morphDuration);
        const rotation = getRandomRotation();

        await animate(pathProgress, pathProgress.get() + 1, {
          duration,
          ease: 'easeInOut',
        });

        await animate(currentRotation, currentRotation.get() + rotation, {
          duration,
          ease: 'easeInOut',
        });
      }
    };

    // Gradient animation
    const animateGradient = async () => {
      while (isMounted) {
        const duration = getRandomDuration(ANIMATION_CONFIG.gradientDuration);
        const newAngle = getRandomGradientAngle(gradientAngle.get());

        await Promise.all([
          animate(gradientProgress, gradientProgress.get() + 1, {
            duration,
            ease: 'easeInOut',
          }),
          animate(gradientAngle, newAngle, {
            duration,
            ease: 'easeInOut',
          }),
        ]);
      }
    };

    // Start animations
    animatePath();
    animateGradient();

    return () => {
      isMounted = false;
    };
  }, [
    pathProgress,
    gradientProgress,
    currentRotation,
    gradientAngle,
    pathInterpolators,
  ]);

  // Pulse animation trigger
  const triggerPulse = useCallback(() => {
    // Create a temporary motion value for the pulse effect
    const pulseValue = { scale: 1 };
    animate(
      pulseValue,
      { scale: ANIMATION_CONFIG.pulseScale },
      {
        duration: ANIMATION_CONFIG.pulseDuration,
        ease: 'easeInOut',
        onComplete: () => {
          animate(
            pulseValue,
            { scale: 1 },
            {
              duration: ANIMATION_CONFIG.pulseDuration,
              ease: 'easeInOut',
            },
          );
        },
      },
    );
  }, []);

  // Schedule random pulses
  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isMounted = true;

    const schedulePulse = () => {
      if (!isMounted) return;

      const delay =
        ANIMATION_CONFIG.pulseInterval.min +
        Math.random() *
          (ANIMATION_CONFIG.pulseInterval.max -
            ANIMATION_CONFIG.pulseInterval.min);

      timeoutId = setTimeout(() => {
        triggerPulse();
        schedulePulse();
      }, delay * 1000);
    };

    schedulePulse();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [triggerPulse]);

  return (
    <svg
      viewBox="0 0 500 500"
      className="block mx-auto max-w-[600px] max-h-[220px] w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <motion.linearGradient
          id="blobGrad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
          gradientTransform={useTransform(
            gradientAngle,
            (angle) => `rotate(${angle})`,
          )}
        >
          <motion.stop
            offset="0%"
            stopColor={useTransform(gradientColors, (colors) => colors[0])}
          />
          <motion.stop
            offset="25%"
            stopColor={useTransform(gradientColors, (colors) => colors[1])}
          />
          <motion.stop
            offset="50%"
            stopColor={useTransform(gradientColors, (colors) => colors[2])}
          />
          <motion.stop
            offset="75%"
            stopColor={useTransform(gradientColors, (colors) => colors[3])}
          />
          <motion.stop
            offset="100%"
            stopColor={useTransform(gradientColors, (colors) => colors[4])}
          />
        </motion.linearGradient>

        <filter id="innerGlow" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feComposite in="blur" in2="SourceGraphic" operator="atop" />
        </filter>
      </defs>

      <motion.path
        d={animatedPath}
        fill="url(#blobGrad)"
        className="drop-shadow-[0_8px_32px_rgba(255,94,98,0.18)]"
        style={{
          filter: 'url(#innerGlow)',
          rotate: currentRotation,
          transformOrigin: '50% 50%',
        }}
        animate={{
          y: [0, ANIMATION_CONFIG.breathingOffset, 0],
        }}
        transition={{
          duration: ANIMATION_CONFIG.breathingDuration,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
    </svg>
  );
}
