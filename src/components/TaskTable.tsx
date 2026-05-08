import React, { useState, useMemo } from 'react';
import { HeadingTask, HeadingLevel } from '../types';

interface TaskTableProps {
  tasks: HeadingTask[];
  onOpenLink?: (file: string, heading: string) => void;
  onTagContextMenu?: (tag: string, event: React.MouseEvent) => void;
  tagColors?: Record<string, string>;
}

// Inline Lucide-style icons
const FileIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tm-file-icon">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const CalendarIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tm-metadata-icon">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const FlagIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tm-metadata-icon">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
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

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsla(${h}, 70%, 40%, 0.15)`;
};

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const TagPill: React.FC<{ tag: string, onContextMenu?: (tag: string, event: React.MouseEvent) => void, customColor?: string }> = ({ tag, onContextMenu, customColor }) => {
  const isDate = /^\d{4}-\d{2}-\d{2}$/.test(tag);
  const isPriority = /priority|p[1-3]/.test(tag.toLowerCase());

  const backgroundColor = useMemo(() => {
    if (customColor) return hexToRgba(customColor, 0.15);
    return stringToColor(tag);
  }, [tag, customColor]);
  
  const textColor = useMemo(() => {
    if (customColor) return customColor;
    const h = backgroundColor.split(',')[0].split('(')[1];
    return `hsl(${h}, 70%, 30%)`;
  }, [backgroundColor, customColor]);

  let className = "tm-tag-pill";
  let icon = null;

  if (isDate) {
    className += " tm-metadata-date";
    icon = <CalendarIcon />;
  } else if (isPriority) {
    className += " tm-metadata-priority";
    icon = <FlagIcon />;
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    if (onContextMenu) {
      e.preventDefault();
      onContextMenu(tag, e);
    }
  };

  return (
    <span 
      className={className}
      onContextMenu={handleContextMenu}
      style={{ 
        backgroundColor, 
        color: textColor,
        border: `1px solid ${customColor ? hexToRgba(customColor, 0.2) : backgroundColor.replace('0.15)', '0.3)')}`
      }}
    >
      {icon}
      {tag}
    </span>
  );
};

const TaskRow = React.memo(({ task, onOpenLink, isCollapsed, onToggle, onTagContextMenu, tagColors }: { 
  task: HeadingTask, 
  onOpenLink?: (file: string, heading: string) => void,
  isCollapsed: boolean,
  onToggle: (id: string) => void,
  onTagContextMenu?: (tag: string, event: React.MouseEvent) => void,
  tagColors?: Record<string, string>
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
                <TagPill 
                  key={idx} 
                  tag={tag} 
                  onContextMenu={onTagContextMenu} 
                  customColor={tagColors?.[tag]} 
                />
              ))}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
});

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, onOpenLink, onTagContextMenu, tagColors }) => {
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
        const key = `h${i}` as keyof HeadingTask;
        const parent = task[key] as HeadingLevel;
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
                  onTagContextMenu={onTagContextMenu}
                  tagColors={tagColors}
                />
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
