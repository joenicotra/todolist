import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addArea, updateArea } from '../../store/slices/areas';
import { closeAreaModal } from '../../store/slices/ui';
import { Area } from '../../types/core';
import Modal from './Modal';

const AreaModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAreaModalOpen, selectedAreaId } = useAppSelector(state => state.ui.modals);
  const areas = useAppSelector(state => state.areas.byId);
  const [name, setName] = useState('');

  const selectedArea = selectedAreaId ? areas[selectedAreaId] : undefined;
  const isEditing = !!selectedArea;

  useEffect(() => {
    if (isAreaModalOpen) {
      if (selectedArea) {
        setName(selectedArea.name);
      } else {
        setName('');
      }
    }
  }, [isAreaModalOpen, selectedArea]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditing && selectedArea) {
      dispatch(updateArea({
        id: selectedArea.id,
        updates: { name: name.trim() }
      }));
    } else {
      const newArea: Area = {
        id: `area-${Date.now()}`,
        name: name.trim(),
        organization_id: 'org-1',
        created_by: 'user-1',
        sort_order: Object.keys(areas).length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      dispatch(addArea(newArea));
    }

    handleClose();
  };

  const handleClose = () => {
    dispatch(closeAreaModal());
    setName('');
  };

  return (
    <Modal
      isOpen={isAreaModalOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Area' : 'New Area'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="area-name" className="block text-sm font-medium text-things-dark-gray mb-2">
            Area Name
          </label>
          <input
            id="area-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter area name..."
            className="w-full px-3 py-2 border border-things-medium-gray rounded-md focus:outline-none focus:ring-2 focus:ring-things-blue focus:border-things-blue"
            autoFocus
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-things-medium-gray hover:text-things-dark-gray transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim()}
            className="px-4 py-2 bg-things-blue text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isEditing ? 'Save' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AreaModal;