'use client';

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { InteractiveBlob } from './InteractiveBlob';
import { colorPalettes } from './colorPalettes';
import { generateRandomParams, getNextKey } from './utils';

export default function VolumetricBlob() {
  const [blobParams] = useState(() => ({ key: getNextKey(), ...generateRandomParams() }));

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