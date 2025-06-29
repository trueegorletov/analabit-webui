import React from 'react';

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

const CustomIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Data trend and points icon"
    >
      {/* 
        The icon is composed of two parts:
        1. Dots: Five circles creating an 'L' shape on the top-left.
        2. Graph Line: A polyline with circles at its vertices, representing a rising trend with a dip.
        Using 'currentColor' for stroke and fill allows easy coloring via CSS text color.
      */}

      {/* Dot Matrix: 3 vertical dots in the first column, 2 horizontal in the top row */}
      <g aria-label="Dot matrix">
        <circle cx="15" cy="15" r="7" fill="currentColor" />
        <circle cx="15" cy="40" r="7" fill="currentColor" />
        <circle cx="15" cy="65" r="7" fill="currentColor" />
        
        <circle cx="40" cy="15" r="7" fill="currentColor" />
        <circle cx="65" cy="15" r="7" fill="currentColor" />
      </g>

      {/* Graph line with vertices. The line's coordinates have been adjusted to prevent clipping at the viewbox edges. */}
      <g aria-label="Graph line">
        {/* The line connecting the points. Drawn first so circles appear on top. */}
        <polyline
          points="20,90 50,60 65,75 90,25"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* The circles at each vertex of the polyline, making the joints bold and circular. Their radius is now larger than the line's stroke-width to make them prominent. */}
        <circle cx="20" cy="90" r="6" fill="currentColor" />
        <circle cx="50" cy="60" r="6" fill="currentColor" />
        <circle cx="65" cy="75" r="6" fill="currentColor" />
        <circle cx="90" cy="25" r="6" fill="currentColor" />
      </g>
    </svg>
  );
};

export default CustomIcon; 