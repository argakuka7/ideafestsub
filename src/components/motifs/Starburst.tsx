import type { ReactElement } from "react";

interface StarburstProps {
  className?: string;
  color?: string;
}

export function Starburst({ className, color = "#E91E8C" }: StarburstProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100,0 L112,72 L160,18 L130,82 L200,75 L138,98 L195,130 L130,118 L160,182 L112,128 L100,200 L88,128 L40,182 L70,118 L5,130 L62,98 L0,75 L70,82 L40,18 L88,72 Z"
        fill={color}
      />
    </svg>
  );
}