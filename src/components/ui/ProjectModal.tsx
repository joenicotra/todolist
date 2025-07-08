import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addProject, updateProject } from '../../store/slices/projects';
import { closeProjectModal } from '../../store/slices/ui';
import { Project } from '../../types/core';
import Modal from './Modal';

const ProjectModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isProjectModalOpen, selectedProjectId } = useAppSelector(state => state.ui.modals);
  const projects = useAppSelector(state => state.projects.byId);
  const areas = useAppSelector(state => state.areas.byId);
  const areaIds = useAppSelector(state => state.areas.allIds);
  
  const [name, setName] = useState('');
  const [areaId, setAreaId] = useState<string>('');

  const selectedProject = selectedProjectId ? projects[selectedProjectId] : undefined;
  const isEditing = !!selectedProject;

  useEffect(() => {
    if (isProjectModalOpen) {
      if (selectedProject) {
        setName(selectedProject.name);
        setAreaId(selectedProject.area_id || '');
      } else {
        setName('');
        setAreaId('');
      }
    }
  }, [isProjectModalOpen, selectedProject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditing && selectedProject) {
      dispatch(updateProject({
        id: selectedProject.id,
        updates: { 
          name: name.trim(),
          ...(areaId ? { area_id: areaId } : {})
        }
      }));
    } else {
      const newProject: Project = {
        id: `project-${Date.now()}`,
        name: name.trim(),
        ...(areaId ? { area_id: areaId } : {}),
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active',
        sort_order: Object.keys(projects).length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      dispatch(addProject(newProject));
    }

    handleClose();
  };

  const handleClose = () => {
    dispatch(closeProjectModal());
    setName('');
    setAreaId('');
  };

  return (
    <Modal
      isOpen={isProjectModalOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Project' : 'New Project'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="project-name" className="block text-sm font-medium text-things-dark-gray mb-2">
            Project Name
          </label>
          <input
            id="project-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter project name..."
            className="w-full px-3 py-2 border border-things-medium-gray rounded-md focus:outline-none focus:ring-2 focus:ring-things-blue focus:border-things-blue"
            autoFocus
          />
        </div>
        
        <div>
          <label htmlFor="project-area" className="block text-sm font-medium text-things-dark-gray mb-2">
            Area (Optional)
          </label>
          <select
            id="project-area"
            value={areaId}
            onChange={(e) => setAreaId(e.target.value)}
            className="w-full px-3 py-2 border border-things-medium-gray rounded-md focus:outline-none focus:ring-2 focus:ring-things-blue focus:border-things-blue"
          >
            <option value="">No Area</option>
            {areaIds.map(id => {
              const area = areas[id];
              return area ? (
                <option key={id} value={id}>
                  {area.name}
                </option>
              ) : null;
            })}
          </select>
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

export default ProjectModal;