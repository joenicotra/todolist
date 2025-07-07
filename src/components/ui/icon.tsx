import React from 'react';
import { cn } from '../../lib/utils';

interface IconProps {
  type: 'emoji' | 'circle';
  value: string;
  color?: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ type, value, color, className }) => {
  if (type === 'emoji') {
    return (
      <span 
        className={cn('text-base flex-shrink-0', color, className)} 
        role="img" 
        aria-hidden="true"
      >
        {value}
      </span>
    );
  }

  return (
    <div 
      className={cn(
        'w-3 h-3 flex-shrink-0 rounded-full',
        color || 'bg-things-blue',
        className
      )} 
    />
  );
};

export default Icon;