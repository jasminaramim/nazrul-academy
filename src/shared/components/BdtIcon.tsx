import React from 'react';

interface BdtIconProps {
  className?: string;
  size?: number;
}

export const BdtIcon: React.FC<BdtIconProps> = ({ className = 'w-4 h-4', size }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="BDT (৳)"
    >
      <text
        x="50%"
        y="55%"
        dominantBaseline="central"
        textAnchor="middle"
        fontSize="17"
        fontWeight="bold"
        fill="currentColor"
        stroke="none"
      >
        ৳
      </text>
    </svg>
  );
};
