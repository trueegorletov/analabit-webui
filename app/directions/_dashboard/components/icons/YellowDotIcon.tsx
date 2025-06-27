import React from 'react';

type SVGProps = React.SVGProps<SVGSVGElement>;

export function YellowDotIcon(props: SVGProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <circle cx="10" cy="10" r="7" />
    </svg>
  );
}
