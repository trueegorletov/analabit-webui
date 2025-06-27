import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(MorphSVGPlugin);

const blobPaths = [
  // Generated with blobmaker.app, all with similar size and center
  'M421,308Q370,366,308,421Q246,476,184,421Q122,366,71,308Q20,250,71,192Q122,134,184,79Q246,24,308,79Q370,134,421,192Q472,250,421,308Z',
  'M400,300Q350,350,300,400Q250,450,200,400Q150,350,100,300Q50,250,100,200Q150,150,200,100Q250,50,300,100Q350,150,400,200Q450,250,400,300Z',
  'M420,320Q370,390,320,420Q270,450,220,420Q170,390,120,320Q70,250,120,180Q170,110,220,80Q270,50,320,80Q370,110,420,180Q470,250,420,320Z',
  // Additional shapes for more dynamic morphing
  'M410,310Q360,370,310,410Q260,450,190,430Q120,410,90,340Q60,270,90,200Q120,130,190,100Q260,70,310,110Q360,150,410,190Q460,230,410,310Z',
  'M430,300Q380,360,320,400Q260,440,200,400Q140,360,100,300Q60,240,100,180Q140,120,200,90Q260,60,320,90Q380,120,430,160Q480,200,430,300Z',
];

const gradients = [
  ['#ff5e62', '#ff7b5e', '#ff9966', '#9c7dff', '#5f72be'],
  ['#7de2fc', '#87f5fb', '#b9b6e5', '#ffcab1', '#ffb199'],
  ['#f7971e', '#ffad0d', '#ffd200', '#16c9e7', '#21d4fd'],
];

export default function AnimatedBlob() {
  const pathRef = useRef<SVGPathElement>(null);
  const gradStop1 = useRef<SVGStopElement>(null);
  const gradStop2 = useRef<SVGStopElement>(null);
  const gradStop3 = useRef<SVGStopElement>(null);
  const gradStop4 = useRef<SVGStopElement>(null);
  const gradStop5 = useRef<SVGStopElement>(null);
  const linearGradRef = useRef<SVGLinearGradientElement>(null);

  useEffect(() => {
    let shapeIndex = 0;
    let gradIndex = 0;
    let currentRot = 0;
    let gradAngle = 0;
    // Helper to get a random duration between 3 and 4.5 seconds
    const randDur = () => 3 + Math.random() * 1.5;

    const morph = () => {
      const nextShape = (shapeIndex + 1) % blobPaths.length;
      const duration = randDur();
      // Calculate a small rotation change between -10 and 10 degrees
      const nextRot = currentRot + (Math.random() * 20 - 10);
      gsap.to(pathRef.current, {
        duration,
        ease: 'power1.inOut',
        morphSVG: { shape: blobPaths[nextShape] },
        rotation: nextRot,
        transformOrigin: '50% 50%',
        onComplete: () => {
          shapeIndex = nextShape;
          currentRot = nextRot;
          morph();
        },
      });
    };
    morph();

    const animateGradient = () => {
      const nextGrad = (gradIndex + 1) % gradients.length;
      const [c1, c2, c3, c4, c5] = gradients[nextGrad];
      const duration = randDur();
      gsap.to(gradStop1.current, {
        stopColor: c1,
        duration,
        ease: 'power1.inOut',
      });
      gsap.to(gradStop2.current, {
        stopColor: c2,
        duration,
        ease: 'power1.inOut',
      });
      gsap.to(gradStop3.current, {
        stopColor: c3,
        duration,
        ease: 'power1.inOut',
        onComplete: () => {
          gradIndex = nextGrad;
          animateGradient();
        },
      });
      gsap.to(gradStop4.current, {
        stopColor: c4,
        duration,
        ease: 'power1.inOut',
      });
      gsap.to(gradStop5.current, {
        stopColor: c5,
        duration,
        ease: 'power1.inOut',
      });

      // Rotate the gradient for additional visual interest
      const nextAngle = gradAngle + 45 + Math.random() * 90; // rotate between +45° and +135° each cycle
      gsap.to(linearGradRef.current, {
        duration,
        ease: 'power1.inOut',
        attr: { gradientTransform: `rotate(${nextAngle})` },
      });
      gradAngle = nextAngle;
    };
    animateGradient();

    // Subtle breathing motion / shadow animation
    const breatheTl = gsap.timeline({ repeat: -1, yoyo: true });
    breatheTl.to(pathRef.current, { duration: 5, y: -6, ease: 'sine.inOut' });

    // Occasional pulse animation (special event)
    let pulseActive = true;
    const triggerPulse = () => {
      gsap.fromTo(
        pathRef.current,
        { scale: 1, transformOrigin: '50% 50%' },
        {
          scale: 1.06,
          duration: 0.6,
          ease: 'power3.inOut',
          yoyo: true,
          repeat: 1,
        },
      );
    };

    const schedulePulse = () => {
      if (!pulseActive) return;
      const delay = 10 + Math.random() * 10; // 10–20 s
      gsap.delayedCall(delay, () => {
        triggerPulse();
        schedulePulse();
      });
    };
    schedulePulse();

    return () => {
      pulseActive = false;
      breatheTl.kill();
    };
  }, []);

  return (
    <svg
      viewBox="0 0 500 500"
      width="100%"
      height="100%"
      style={{
        maxWidth: 600,
        maxHeight: 220,
        display: 'block',
        margin: '0 auto',
      }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient
          id="blobGrad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
          ref={linearGradRef}
          gradientTransform="rotate(0)"
        >
          <stop offset="0%" ref={gradStop1} stopColor="#ff5e62" />
          <stop offset="25%" ref={gradStop2} stopColor="#ff7b5e" />
          <stop offset="50%" ref={gradStop3} stopColor="#ff9966" />
          <stop offset="75%" ref={gradStop4} stopColor="#9c7dff" />
          <stop offset="100%" ref={gradStop5} stopColor="#5f72be" />
        </linearGradient>

        {/* Inner glow filter */}
        <filter id="innerGlow" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feComposite in="blur" in2="SourceGraphic" operator="atop" />
        </filter>
      </defs>
      <path
        ref={pathRef}
        d={blobPaths[0]}
        fill="url(#blobGrad)"
        style={{
          filter:
            'url(#innerGlow) drop-shadow(0 8px 32px rgba(255, 94, 98, 0.18))',
        }}
      />
    </svg>
  );
}
