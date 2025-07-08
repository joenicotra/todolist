import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export interface TaskProps {
  id: string;
  title: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onUpdate?: ((id: string, updates: { title?: string; notes?: string }) => void) | undefined;
  notes?: string | undefined;
}

export const Task: React.FC<TaskProps> = ({ id, title, completed, onToggle, onUpdate, notes }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editNotes, setEditNotes] = useState(notes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const notesInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (isEditingNotes && notesInputRef.current) {
      notesInputRef.current.focus();
    }
  }, [isEditingNotes]);

  const handleTitleSave = () => {
    if (onUpdate && editTitle.trim() !== title) {
      onUpdate(id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleNotesSave = () => {
    if (onUpdate && editNotes !== notes) {
      onUpdate(id, { notes: editNotes });
    }
    setIsEditingNotes(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setEditTitle(title);
      setIsEditing(false);
    }
  };

  const handleNotesKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      e.preventDefault();
      handleNotesSave();
    } else if (e.key === 'Escape') {
      setEditNotes(notes || '');
      setIsEditingNotes(false);
    }
  };

  const handleToggleWithAnimation = () => {
    if (!completed && !isCompleting) {
      // Task is being completed
      setIsCompleting(true);
      
      // After 3 seconds, start the ease-out animation and complete the task
      setTimeout(() => {
        setShouldHide(true);
        
        // After the fade-out animation (300ms), actually complete the task
        setTimeout(() => {
          onToggle(id);
          setIsCompleting(false);
          setShouldHide(false);
        }, 300);
      }, 3000);
    } else if (completed) {
      // Task is being uncompleted - do immediately
      onToggle(id);
    }
  };

  return (
    <div className={`flex items-start gap-3 px-4 py-2 hover:bg-gray-50 group transition-all duration-300 ${
      shouldHide ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
    }`}>
      <button
        onClick={handleToggleWithAnimation}
        className="flex-shrink-0 mt-0.5 text-gray-400 hover:text-blue-500 transition-colors"
      >
        {(completed || isCompleting) ? (
          <CheckCircle2 size={16} className="text-blue-500" />
        ) : (
          <Circle size={16} />
        )}
      </button>
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={titleInputRef}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={handleTitleKeyDown}
            className="text-sm bg-transparent border-none outline-none w-full text-gray-900 resize-none"
          />
        ) : (
          <div 
            className={`text-sm cursor-pointer transition-all duration-200 ${
              (completed || isCompleting) ? 'line-through text-gray-400' : 'text-gray-900'
            }`}
            onClick={() => onUpdate && !isCompleting && setIsEditing(true)}
          >
            {title}
          </div>
        )}
        {(notes || isEditingNotes) && (
          <div className="mt-1">
            {isEditingNotes ? (
              <textarea
                ref={notesInputRef}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                onBlur={handleNotesSave}
                onKeyDown={handleNotesKeyDown}
                className="text-xs bg-transparent border-none outline-none w-full text-gray-500 resize-none"
                rows={2}
                placeholder="Add notes..."
              />
            ) : (
              <div 
                className="text-xs text-gray-500 cursor-pointer"
                onClick={() => onUpdate && setIsEditingNotes(true)}
              >
                {notes || 'Add notes...'}
              </div>
            )}
          </div>
        )}
        {!notes && !isEditingNotes && onUpdate && (
          <div 
            className="text-xs text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setIsEditingNotes(true)}
          >
            Add notes...
          </div>
        )}
      </div>
    </div>
  );
};