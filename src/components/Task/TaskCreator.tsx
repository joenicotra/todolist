import React, { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';

export interface TaskCreatorProps {
  onCreateTask: (title: string, notes?: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const TaskCreator: React.FC<TaskCreatorProps> = ({
  onCreateTask,
  placeholder = 'Add a task...',
  autoFocus = false
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const notesInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isCreating && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isCreating]);

  useEffect(() => {
    if (showNotes && notesInputRef.current) {
      notesInputRef.current.focus();
    }
  }, [showNotes]);

  const handleSubmit = () => {
    if (title.trim()) {
      onCreateTask(title.trim(), notes.trim() || undefined);
      setTitle('');
      setNotes('');
      setShowNotes(false);
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setNotes('');
    setShowNotes(false);
    setIsCreating(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, isNotesField = false) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isNotesField) {
        handleSubmit();
      } else if (title.trim()) {
        if (e.metaKey || e.ctrlKey) {
          handleSubmit();
        } else {
          setShowNotes(true);
        }
      }
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isCreating) {
    return (
      <div className="px-4 py-2">
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors w-full text-left"
        >
          <Plus size={16} />
          {placeholder}
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-2 border-l-2 border-blue-200 bg-blue-50/50">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Plus size={16} className="text-blue-500" />
        </div>
        <div className="flex-1 min-w-0">
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, false)}
            placeholder="Task title"
            className="text-sm bg-transparent border-none outline-none w-full text-gray-900 placeholder-gray-500"
          />
          {showNotes && (
            <textarea
              ref={notesInputRef}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, true)}
              placeholder="Add notes..."
              className="text-xs bg-transparent border-none outline-none w-full text-gray-500 placeholder-gray-400 mt-1 resize-none"
              rows={2}
            />
          )}
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add Task
            </button>
            <button
              onClick={handleCancel}
              className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            {!showNotes && (
              <button
                onClick={() => setShowNotes(true)}
                className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700"
              >
                Add Notes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};