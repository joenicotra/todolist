import React, { useRef, useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { openAreaModal, openProjectModal } from '../../store/slices/ui';

interface NewListDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewListDropdown: React.FC<NewListDropdownProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleNewArea = () => {
    dispatch(openAreaModal(undefined));
    onClose();
  };

  const handleNewProject = () => {
    dispatch(openProjectModal(undefined));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-things-medium-gray rounded-lg shadow-lg py-1 z-50"
    >
      <button
        onClick={handleNewArea}
        className="w-full px-3 py-2 text-left text-sm text-things-dark-gray hover:bg-things-light-gray flex items-center gap-2"
      >
        <div className="w-3 h-3 bg-things-purple rounded-sm"></div>
        New Area
      </button>
      <button
        onClick={handleNewProject}
        className="w-full px-3 py-2 text-left text-sm text-things-dark-gray hover:bg-things-light-gray flex items-center gap-2"
      >
        <div className="w-3 h-3 bg-things-green rounded-sm"></div>
        New Project
      </button>
    </div>
  );
};

export default NewListDropdown;