
import React from 'react';

interface SVGProps extends React.SVGProps<SVGSVGElement> {}

export const YellowDotIcon: React.FC<SVGProps> = (props) => (
  <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
    <circle cx="10" cy="10" r="7" />
  </svg>
);
