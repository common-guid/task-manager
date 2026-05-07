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

  const indentation = (task.level - 1) * 20;
  
  // Dynamic styling based on heading level
  const getHeadingStyle = (level: number) => {
    switch (level) {
      case 1: return { fontSize: '1.2em', fontWeight: 'bold' };
      case 2: return { fontSize: '1.1em', fontWeight: 'bold' };
      case 3: return { fontSize: '1em', fontWeight: 'bold' };
      case 4: return { fontSize: '0.95em', fontWeight: '600' };
      case 5: return { fontSize: '0.9em', fontWeight: '600' };
      case 6: return { fontSize: '0.85em', fontWeight: '600', fontStyle: 'italic' };
      default: return {};
    }
  };

  return (
    <tr className="tm-row">
      <td
        className="tm-current-level tm-link"
        onClick={() => handleLinkClick(task.file, task.text || '')}
      >
        <div className="tm-cell-content" style={{ paddingLeft: `${indentation}px` }}>
          <div className="tm-title-row">
            {task.hasChildren && (
              <Chevron isCollapsed={isCollapsed} onClick={(e) => {
                e.stopPropagation();
                onToggle(task.id);
              }} />
            )}
            <span className="tm-level-pill" style={getHeadingStyle(task.level)}>
              {task.text}
            </span>
          </div>
          {task.tags.length > 0 && (
            <div className="tm-tag-container">
              {task.tags.map((tag, idx) => (
                <TagPill key={idx} tag={tag} />
              ))}
            </div>
          )}
        </div>
      </td>
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

  const groupedTasks = useMemo(() => {
    const groups: { file: string, tasks: HeadingTask[] }[] = [];
    let currentGroup: { file: string, tasks: HeadingTask[] } | null = null;

    filteredTasks.forEach(task => {
      if (!currentGroup || currentGroup.file !== task.file) {
        currentGroup = { file: task.file, tasks: [] };
        groups.push(currentGroup);
      }
      currentGroup.tasks.push(task);
    });

    return groups;
  }, [filteredTasks]);

  return (
    <div className="tm-container">
      <table className="tm-table">
        <tbody>
          {groupedTasks.map((group, gIdx) => (
            <React.Fragment key={group.file}>
              <tr className="tm-file-header-row">
                <td className="tm-file-header-cell">
                  <div className="tm-file-icon-wrapper">
                    <FileIcon />
                    <span className="tm-file-name">{group.file}</span>
                  </div>
                </td>
              </tr>
              {group.tasks.map((task, tIdx) => (
                <TaskRow 
                  key={`${task.file}-${task.level}-${task.text}-${tIdx}`} 
                  task={task} 
                  onOpenLink={onOpenLink}
                  isCollapsed={collapsedIds.has(task.id)}
                  onToggle={handleToggle}
                />
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
