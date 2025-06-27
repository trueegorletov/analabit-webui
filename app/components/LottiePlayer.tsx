'use client';

import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function LottiePlayer() {
  const style = {
    width: '220px',
    height: '220px',
    margin: '0 auto',
  };

  return (
    <DotLottieReact
      src="/search-eye-animation.lottie"
      loop
      autoplay
      style={style}
      speed={0.8}
    />
  );
}
