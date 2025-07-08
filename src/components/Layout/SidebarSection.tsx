import React from 'react';

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
  showAddButton?: boolean;
  onAdd?: () => void;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  children,
  showAddButton = false,
  onAdd,
}) => {
  const handleAddClick = () => {
    if (onAdd) {
      onAdd();
    }
  };

  return (
    <div className="mb-6">
      {/* Section Header */}
      <div className="flex items-center justify-between px-5 pb-1 mb-2">
        <h3 className="text-xs font-medium text-things-dark-gray uppercase tracking-wider">
          {title}
        </h3>

        {showAddButton && (
          <button
            onClick={handleAddClick}
            className="p-1 text-things-dark-gray hover:text-things-charcoal hover:bg-things-medium-gray rounded transition-colors duration-150"
            title={`Add new ${title.toLowerCase().slice(0, -1)}`}
            aria-label={`Add new ${title.toLowerCase().slice(0, -1)}`}
          >
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Section Content */}
      <div>
        {children}
      </div>
    </div>
  );
};

export default SidebarSection;
