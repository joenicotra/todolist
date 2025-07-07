import React from 'react';
import Icon from '../ui/icon';

interface SidebarItemProps {
  id: string;
  name: string;
  icon: string;
  count?: number;
  isActive?: boolean;
  isChild?: boolean;
  hasChildren?: boolean;
  iconColor?: string;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  id,
  name,
  icon,
  count,
  isActive = false,
  isChild = false,
  hasChildren = false,
  iconColor = 'text-things-charcoal',
  onClick,
}) => {
  const baseClasses = `
    flex items-center
    px-3 py-1.5 text-sm font-normal
    cursor-pointer
    transition-colors duration-150
    hover:bg-white hover:bg-opacity-50
    text-things-charcoal
    w-full text-left border-none bg-transparent
    rounded-md mx-2
  `.trim();

  const activeClasses = isActive
    ? 'bg-white shadow-things'
    : '';

  const childClasses = isChild ? 'ml-4' : '';

  const itemClasses = `${baseClasses} ${activeClasses} ${childClasses}`;

  const handleClick = () => {
    onClick();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <button
      className={itemClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-pressed={isActive}
      data-testid={`sidebar-item-${id}`}
    >
      <Icon
        type={icon.length === 1 || icon.includes('📥') || icon.includes('⭐') || icon.includes('🌙') || icon.includes('📅') || icon.includes('📋') || icon.includes('📚') || icon.includes('🗑️') ? 'emoji' : 'circle'}
        value={icon}
        color={iconColor}
        className="mr-3"
      />
      <span className="truncate flex-1 min-w-0 text-left">
        {name}
      </span>

      {/* Count badge */}
      {count !== undefined && count > 0 && (
        <span className="ml-2 text-xs text-things-dark-gray">
          {count}
        </span>
      )}

      {/* Expand/collapse indicator for items with children */}
      {hasChildren && (
        <span className="ml-2 text-things-dark-gray">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      )}
    </button>
  );
};

export default SidebarItem;
