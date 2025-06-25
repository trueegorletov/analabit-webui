import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

gsap.registerPlugin(MorphSVGPlugin);

const blobPaths = [
  // Generated with blobmaker.app, all with similar size and center
  "M421,308Q370,366,308,421Q246,476,184,421Q122,366,71,308Q20,250,71,192Q122,134,184,79Q246,24,308,79Q370,134,421,192Q472,250,421,308Z",
  "M400,300Q350,350,300,400Q250,450,200,400Q150,350,100,300Q50,250,100,200Q150,150,200,100Q250,50,300,100Q350,150,400,200Q450,250,400,300Z",
  "M420,320Q370,390,320,420Q270,450,220,420Q170,390,120,320Q70,250,120,180Q170,110,220,80Q270,50,320,80Q370,110,420,180Q470,250,420,320Z"
];

const gradients = [
  ["#ff5e62", "#ff9966", "#5f72be"],
  ["#7de2fc", "#b9b6e5", "#ffb199"],
  ["#f7971e", "#ffd200", "#21d4fd"]
];

export default function AnimatedBlob() {
  const pathRef = useRef<SVGPathElement>(null);
  const gradStop1 = useRef<SVGStopElement>(null);
  const gradStop2 = useRef<SVGStopElement>(null);
  const gradStop3 = useRef<SVGStopElement>(null);

  useEffect(() => {
    let shapeIndex = 0;
    let gradIndex = 0;
    const morph = () => {
      const nextShape = (shapeIndex + 1) % blobPaths.length;
      gsap.to(pathRef.current, {
        duration: 3.5,
        ease: "power1.inOut",
        morphSVG: { shape: blobPaths[nextShape] },
        onComplete: () => {
          shapeIndex = nextShape;
          morph();
        }
      });
    };
    morph();

    const animateGradient = () => {
      const nextGrad = (gradIndex + 1) % gradients.length;
      const [c1, c2, c3] = gradients[nextGrad];
      gsap.to(gradStop1.current, { stopColor: c1, duration: 3.5, ease: "power1.inOut" });
      gsap.to(gradStop2.current, { stopColor: c2, duration: 3.5, ease: "power1.inOut" });
      gsap.to(gradStop3.current, {
        stopColor: c3,
        duration: 3.5,
        ease: "power1.inOut",
        onComplete: () => {
          gradIndex = nextGrad;
          animateGradient();
        }
      });
    };
    animateGradient();
  }, []);

  return (
    <svg
      viewBox="0 0 500 500"
      width="100%"
      height="100%"
      style={{ maxWidth: 600, maxHeight: 220, display: "block", margin: "0 auto" }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="blobGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" ref={gradStop1} stopColor="#ff5e62" />
          <stop offset="50%" ref={gradStop2} stopColor="#ff9966" />
          <stop offset="100%" ref={gradStop3} stopColor="#5f72be" />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        d={blobPaths[0]}
        fill="url(#blobGrad)"
        style={{ filter: "drop-shadow(0 8px 32px rgba(255, 94, 98, 0.18))" }}
      />
    </svg>
  );
} 