import React from 'react';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  backgroundColor?: string;
  progressColor?: string;
  showPercentage?: boolean;
  textColor?: string;
  textSize?: string;
  className?: string;
}

const CircularProgress2: React.FC<CircularProgressProps> = ({
  percentage,
  size = 100,
  strokeWidth = 8,
  backgroundColor = '#EEEEEE',
  progressColor = '#41B27C',
  showPercentage = true,
  textColor = '#333333',
  textSize = '18px',
  className = '',
}) => {
  // Ensure percentage is within valid range
  const validPercentage = Math.max(0, Math.min(100, percentage));
  
  // Calculate circle properties
  const radius = (size / 2) - (strokeWidth / 2);
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - validPercentage / 100);
  
  // Center position
  const center = size / 2;
  
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${center} ${center})`}
        />
        
        {/* Percentage text */}
        {showPercentage && (
          <text
            x={center}
            y={center}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={textColor}
            style={{ fontSize: textSize, fontWeight: 500 }}
          >
            {validPercentage}%
          </text>
        )}
      </svg>
    </div>
  );
};

export default CircularProgress2;