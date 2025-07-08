import React from 'react';
import { cn } from '../../lib/utils';

interface ProjectProgressIconProps {
  completionPercentage: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  isCompleted?: boolean;
  onComplete?: (() => void) | undefined;
}

const ProjectProgressIcon: React.FC<ProjectProgressIconProps> = ({
  completionPercentage,
  size = 'md',
  className,
  isCompleted = false,
  onComplete
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const strokeWidth = {
    sm: '2',
    md: '2',
    lg: '2.5'
  };

  const radius = {
    sm: 4,
    md: 6,
    lg: 8
  };

  const circumference = 2 * Math.PI * radius[size];
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  const isFullyCompleted = completionPercentage === 100 || isCompleted;

  const handleClick = () => {
    if (isFullyCompleted && onComplete) {
      onComplete();
    }
  };

  return (
    <div 
      className={cn(
        'relative flex-shrink-0',
        sizeClasses[size],
        isFullyCompleted && onComplete && 'cursor-pointer',
        className
      )}
      onClick={handleClick}
      title={`${Math.round(completionPercentage)}% complete`}
    >
      <svg
        className={cn('transform -rotate-90', sizeClasses[size])}
        viewBox={`0 0 ${radius[size] * 2 + 4} ${radius[size] * 2 + 4}`}
      >
        {/* Background circle */}
        <circle
          cx={radius[size] + 2}
          cy={radius[size] + 2}
          r={radius[size]}
          fill="none"
          stroke={isFullyCompleted ? '#10b981' : '#e5e7eb'}
          strokeWidth={strokeWidth[size]}
          className="opacity-30"
        />
        
        {/* Progress circle */}
        {completionPercentage > 0 && (
          <circle
            cx={radius[size] + 2}
            cy={radius[size] + 2}
            r={radius[size]}
            fill="none"
            stroke={isFullyCompleted ? '#10b981' : '#3b82f6'}
            strokeWidth={strokeWidth[size]}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />
        )}
        
        {/* Checkmark for completed projects */}
        {isFullyCompleted && (
          <g transform={`translate(${radius[size] - 2}, ${radius[size] - 2})`}>
            <path
              d="M1 2L2.5 3.5L5 1"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
        )}
      </svg>
      
      {/* Fill overlay for completed state */}
      {isFullyCompleted && (
        <div
          className={cn(
            'absolute inset-0 rounded-full bg-green-500 opacity-20',
            onComplete && 'hover:opacity-30 transition-opacity'
          )}
        />
      )}
    </div>
  );
};

export default ProjectProgressIcon;