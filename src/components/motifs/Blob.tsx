import type { ReactElement } from "react";

interface BlobProps {
  className?: string;
  color?: string;
}

export function Blob({ className, color = "#E91E8C" }: BlobProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M44.5,-67.6C56.8,-60.3,65.4,-46.3,71.3,-31.4C77.2,-16.5,80.5,-0.7,77.8,14.4C75.1,29.5,66.5,43.9,54.8,54.6C43.1,65.3,28.3,72.3,12.5,74.2C-3.3,76.1,-20.1,72.9,-33.4,64.5C-46.7,56.1,-56.5,42.5,-63.1,27.6C-69.7,12.7,-73.1,-3.6,-69.4,-18.3C-65.7,-33,-54.9,-46.1,-42,-55.6C-29.1,-65.1,-14.5,-71,1.5,-73.4C17.6,-75.8,32.2,-74.9,44.5,-67.6Z"
        fill={color}
      />
    </svg>
  );
}