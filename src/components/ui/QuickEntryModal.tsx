import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { closeQuickEntry } from '../../store/slices/ui';
import { addTask } from '../../store/slices/tasks';
import { Task } from '../../types/core';
import Modal from './Modal';

const QuickEntryModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isQuickEntryOpen } = useAppSelector(state => state.ui.modals);
  const { currentView } = useAppSelector(state => state.ui.navigation);
  const areas = useAppSelector(state => state.areas);
  const projects = useAppSelector(state => state.projects);
  
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedAreaId, setSelectedAreaId] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  // Reset form when modal opens
  useEffect(() => {
    if (isQuickEntryOpen) {
      setTitle('');
      setNotes('');
      setDueDate('');
      setSelectedAreaId('');
      setSelectedProjectId('');

      // Pre-populate based on current view
      if (currentView.startsWith('area-')) {
        const areaId = currentView.replace('area-', '');
        setSelectedAreaId(areaId);
      } else if (currentView.startsWith('project-')) {
        const projectId = currentView.replace('project-', '');
        setSelectedProjectId(projectId);
        // If project has an area, select the area too
        const project = projects.byId[projectId];
        if (project?.area_id) {
          setSelectedAreaId(project.area_id);
        }
      }
    }
  }, [isQuickEntryOpen, currentView, projects.byId]);

  const handleClose = () => {
    dispatch(closeQuickEntry());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const trimmedNotes = notes.trim();
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      ...(trimmedNotes ? { notes: trimmedNotes } : {}),
      status: 'active',
      priority: 2,
      ...(dueDate ? { due_date: dueDate } : {}),
      ...(selectedAreaId ? { area_id: selectedAreaId } : {}),
      ...(selectedProjectId ? { project_id: selectedProjectId } : {}),
      organization_id: 'org-1',
      created_by: 'user-1',
      sort_order: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    dispatch(addTask(newTask));
    handleClose();
  };

  // Get projects for selected area
  const availableProjects = projects.allIds
    .map(id => projects.byId[id])
    .filter((project): project is NonNullable<typeof project> => 
      project !== undefined && (!selectedAreaId || project.area_id === selectedAreaId)
    );

  if (!isQuickEntryOpen) return null;

  return (
    <Modal isOpen={isQuickEntryOpen} onClose={handleClose} title="Quick Add Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Task Title */}
        <div>
          <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1">
            Task Title
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-things-blue focus:border-things-blue"
            autoFocus
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="task-notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            id="task-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional details..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-things-blue focus:border-things-blue resize-none"
          />
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="task-due-date" className="block text-sm font-medium text-gray-700 mb-1">
            Due Date (Optional)
          </label>
          <input
            id="task-due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-things-blue focus:border-things-blue"
          />
        </div>

        {/* Area Selection */}
        <div>
          <label htmlFor="task-area" className="block text-sm font-medium text-gray-700 mb-1">
            Area (Optional)
          </label>
          <select
            id="task-area"
            value={selectedAreaId}
            onChange={(e) => {
              setSelectedAreaId(e.target.value);
              // Clear project selection if changing area
              if (selectedProjectId) {
                const project = projects.byId[selectedProjectId];
                if (project?.area_id !== e.target.value) {
                  setSelectedProjectId('');
                }
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-things-blue focus:border-things-blue"
          >
            <option value="">No Area</option>
            {areas.allIds.map(areaId => {
              const area = areas.byId[areaId];
              return area ? (
                <option key={areaId} value={areaId}>
                  {area.name}
                </option>
              ) : null;
            })}
          </select>
        </div>

        {/* Project Selection */}
        <div>
          <label htmlFor="task-project" className="block text-sm font-medium text-gray-700 mb-1">
            Project (Optional)
          </label>
          <select
            id="task-project"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-things-blue focus:border-things-blue"
          >
            <option value="">No Project</option>
            {availableProjects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-things-blue focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-things-blue border border-transparent rounded-md hover:bg-things-blue-pressed focus:outline-none focus:ring-2 focus:ring-things-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Task
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default QuickEntryModal;