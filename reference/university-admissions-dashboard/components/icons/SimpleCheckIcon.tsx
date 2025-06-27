import React from 'react';

interface SVGProps extends React.SVGProps<SVGSVGElement> {}

export const SimpleCheckIcon: React.FC<SVGProps> = (props) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5" // Made thicker to match image's green check
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
