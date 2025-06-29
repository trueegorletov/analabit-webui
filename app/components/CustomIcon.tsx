import React from 'react';

interface AnalyticsIconProps {
  className?: string;
}

const CustomIcon: React.FC<AnalyticsIconProps> = ({ className }) => {
  // This path creates a square with highly rounded corners, mimicking the icon's frame.
  const framePath = 'M 20 5 H 80 A 15 15 0 0 1 95 20 V 80 A 15 15 0 0 1 80 95 H 20 A 15 15 0 0 1 5 80 V 20 A 15 15 0 0 1 20 5 Z';

  // This path creates the wavy line graph inside the frame.
  // It uses a quadratic Bézier curve followed by a smooth quadratic continuation.
  // The 'strokeLinecap="round"' attribute creates the circular dots at the ends of the line.
  const linePath = 'M 23 76 Q 45 38 55 54 T 78 38';

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d={framePath}
        stroke="currentColor"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path
        d={linePath}
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default CustomIcon; 