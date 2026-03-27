import React, { useState, useMemo } from 'react';
import { HeadingTask, HeadingLevel } from '../types';

interface TaskTableProps {
  tasks: HeadingTask[];
  onOpenLink?: (file: string, heading: string) => void;
}

// Inline Lucide-style file-text SVG icon
const FileIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="tm-file-icon"
    style={{ width: '16px', height: '16px', minWidth: '16px', flexShrink: 0 }}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const Chevron: React.FC<{ isCollapsed: boolean, onClick: (e: React.MouseEvent) => void }> = ({ isCollapsed, onClick }) => (
  <button 
    className="tm-toggle" 
    onClick={onClick}
    style={{ width: '16px', height: '16px', minWidth: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`tm-chevron-icon ${isCollapsed ? 'collapsed' : ''}`}
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  </button>
);

const TagPill: React.FC<{ tag: string }> = ({ tag }) => (
  <span className="tm-tag-pill">{tag}</span>
);

const TaskRow = React.memo(({ task, onOpenLink, isCollapsed, onToggle }: { 
  task: HeadingTask, 
  onOpenLink?: (file: string, heading: string) => void,
  isCollapsed: boolean,
  onToggle: (id: string) => void
}) => {
  const handleLinkClick = (file: string, heading: string) => {
    if (onOpenLink) {
      onOpenLink(file, heading);
    }
  };

  const renderCell = (level: number, value: HeadingLevel) => {
    const isActive = task.level === level;
    if (!value.text && value.tags.length === 0) return <td></td>;

    return (
      <td
        className={isActive ? 'tm-current-level tm-link' : ''}
        onClick={() => isActive && handleLinkClick(task.file, value.text || '')}
      >
        <div className="tm-cell-content">
          <div className="tm-title-row">
            {isActive ? (
              <span className="tm-level-pill">{value.text}</span>
            ) : (
              <span className="tm-heading-text">{value.text}</span>
            )}
          </div>
          {value.tags.length > 0 && (
            <div className="tm-tag-container">
              {value.tags.map((tag, idx) => (
                isActive ? (
                  <TagPill key={idx} tag={tag} />
                ) : (
                  <span key={idx} className="tm-heading-tag">{tag}</span>
                )
              ))}
            </div>
          )}
        </div>
      </td>
    );
  };

  return (
    <tr className="tm-row">
      <td className="tm-link tm-file-cell" onClick={(e) => {
        // Prevent opening link if clicking the toggle button
        if ((e.target as HTMLElement).closest('.tm-toggle')) return;
        handleLinkClick(task.file, '');
      }}>
        <span className="tm-file-icon-wrapper">
          {task.hasChildren ? (
            <Chevron isCollapsed={isCollapsed} onClick={(e) => {
              e.stopPropagation();
              onToggle(task.id);
            }} />
          ) : (
            <FileIcon />
          )}
          <span className="tm-file-name">{task.file}</span>
        </span>
      </td>
      {renderCell(1, task.h1)}
      {renderCell(2, task.h2)}
      {renderCell(3, task.h3)}
      {renderCell(4, task.h4)}
      {renderCell(5, task.h5)}
      {renderCell(6, task.h6)}
    </tr>
  );
});

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, onOpenLink }) => {
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());

  const handleToggle = (id: string) => {
    setCollapsedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Check if any of its parents are collapsed
      for (let i = 1; i < task.level; i++) {
        const parent = (task as any)[`h${i}`] as HeadingLevel;
        if (parent && parent.id && collapsedIds.has(parent.id)) {
          return false;
        }
      }
      return true;
    });
  }, [tasks, collapsedIds]);

  return (
    <div className="tm-container">
      <table className="tm-table">
        <thead>
          <tr>
            <th>file</th>
            <th>h1</th>
            <th>h2</th>
            <th>h3</th>
            <th>h4</th>
            <th>h5</th>
            <th>h6</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task, index) => (
            <TaskRow 
              key={`${task.file}-${task.level}-${task.text}-${index}`} 
              task={task} 
              onOpenLink={onOpenLink}
              isCollapsed={collapsedIds.has(task.id)}
              onToggle={handleToggle}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
