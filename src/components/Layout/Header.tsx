import React from 'react';

interface HeaderProps {
  title: string;
  onToggleSidebar: () => void;
  showMenuButton?: boolean;
  actions?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  onToggleSidebar,
  showMenuButton = false,
  actions,
}) => {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-things-medium-gray px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Menu button and title */}
        <div className="flex items-center">
          {showMenuButton && (
            <button
              onClick={onToggleSidebar}
              className="mr-4 p-2 text-things-dark-gray hover:text-things-charcoal hover:bg-things-light-gray rounded-md transition-colors duration-150"
              aria-label="Toggle sidebar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

          <h1 className="text-xl font-medium text-things-charcoal">
            {title}
          </h1>
        </div>

        {/* Right side - Actions */}
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
