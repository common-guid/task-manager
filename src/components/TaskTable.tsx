import React, { useState, useMemo } from 'react';
import { HeadingTask, HeadingLevel } from '../types';
import { filterTasks } from '../mapper';

interface TaskTableProps {
  tasks: HeadingTask[];
  onOpenLink?: (file: string, heading: string) => void;
  onTagContextMenu?: (tag: string, event: React.MouseEvent) => void;
  onSettingsChange?: (settings: any) => void;
  tagColors?: Record<string, string>;
  settings?: {
    levelColors: string[];
    columns: string[];
    hideCompleted?: boolean;
  };
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

const CopyIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: '7px', height: '7px' }}
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);


// Inline Lucide-style square SVG icon
const SquareIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="tm-square-icon"
    style={{ width: '16px', height: '16px', minWidth: '16px', flexShrink: 0, marginRight: '4px' }}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
  </svg>
);

// Inline Lucide-style check-square SVG icon
const CheckSquareIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="tm-check-square-icon"
    style={{ width: '16px', height: '16px', minWidth: '16px', flexShrink: 0, marginRight: '4px', color: 'var(--text-accent)' }}
  >
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

const EyeOffIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
    <line x1="2" y1="2" x2="22" y2="22"/>
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

const TaskRow = React.memo(({ task, onOpenLink, isCollapsed, onToggle, onTagContextMenu, tagColors, settings }: { 
  task: HeadingTask, 
  onOpenLink?: (file: string, heading: string) => void,
  isCollapsed: boolean,
  onToggle: (id: string) => void,
  onTagContextMenu?: (tag: string, event: React.MouseEvent) => void,
  tagColors?: Record<string, string>,
  settings?: { 
    levelColors: string[],
    columns: string[]
  }
}) => {
  const handleLinkClick = (file: string, heading: string) => {
    if (onOpenLink) {
      onOpenLink(file, heading);
    }
  };


  const indentation = (task.level - 1) * 20;
  
  const breadcrumbParts = [task.file];
  for (let i = 1; i <= task.level; i++) {
    const levelData = (task as any)[`h${i}`] as HeadingLevel;
    if (levelData && levelData.text) {
      breadcrumbParts.push(levelData.text);
    }
  }
  const breadcrumb = breadcrumbParts.join(' > ');

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

  // Detect and strip task syntax
  let isTask = false;
  let isChecked = false;
  let displayText = task.text || '';

  if (displayText.startsWith('- [ ] ')) {
    isTask = true;
    displayText = displayText.substring(6);
  } else if (displayText.startsWith('- [x] ') || displayText.startsWith('- [X] ')) {
    isTask = true;
    isChecked = true;
    displayText = displayText.substring(6);
  }

  return (
    <tr className="tm-row" title={breadcrumb}>
      {settings?.columns.map((col, idx) => {
        const isPrimary = idx === 0 || col.toLowerCase() === 'task';
        
        if (isPrimary) {
          return (
            <td
              key={idx}
              className="tm-current-level tm-link"
              onClick={() => handleLinkClick(task.file, task.text || '')}
            >
              <div className="tm-cell-content" style={{ paddingLeft: `${indentation}px` }}>
                {/* Render indentation guides based on level */}
                {Array.from({ length: task.level - 1 }).map((_, i) => (
                  <div
                    key={i}
                    className="tm-indent-guide"
                    style={{ 
                      left: `${i * 20 + 8}px`,
                      backgroundColor: settings?.levelColors[i] || 'var(--background-modifier-border)',
                      width: '4px'
                    }}
                  />
                ))}
                <div className="tm-title-row">
                  {task.hasChildren && (
                    <Chevron isCollapsed={isCollapsed} onClick={(e) => {
                      e.stopPropagation();
                      onToggle(task.id);
                    }} />
                  )}
                  {isTask && (isChecked ? <CheckSquareIcon /> : <SquareIcon />)}
                  <span className="tm-level-pill" style={getHeadingStyle(task.level)}>
                    {displayText}
                  </span>
                  <div className="tm-actions-container">
                    <button
                      className="tm-action-btn"
                      title="Copy Link"
                      style={{ 
                        width: '10px', 
                        height: '10px', 
                        minWidth: '10px', 
                        minHeight: '10px', 
                        padding: 0, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        borderRadius: '2px'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const linkText = `[[${task.file}#${task.text}]]`;
                        navigator.clipboard.writeText(linkText);
                      }}
                    >
                      <CopyIcon />
                    </button>
                  </div>
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
          );
        } else {
          return (
            <td key={idx} className="tm-metadata-cell">
              {task.metadata[col] || ''}
            </td>
          );
        }
      })}
    </tr>
  );
});

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, onOpenLink, onTagContextMenu, onSettingsChange, tagColors, settings: providedSettings }) => {
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [localHideCompleted, setLocalHideCompleted] = useState(providedSettings?.hideCompleted || false);

  // Sync local state with props when props change (e.g. from settings tab)
  React.useEffect(() => {
    if (providedSettings?.hideCompleted !== undefined) {
      setLocalHideCompleted(providedSettings.hideCompleted);
    }
  }, [providedSettings?.hideCompleted]);

  const settings = providedSettings || { levelColors: [], columns: ['Task'], hideCompleted: localHideCompleted };

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
    const visibilityFiltered = filterTasks(tasks, localHideCompleted);
    
    return visibilityFiltered.filter(task => {
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
  }, [tasks, collapsedIds, localHideCompleted]);

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

  const toggleHideCompleted = () => {
    const newValue = !localHideCompleted;
    setLocalHideCompleted(newValue);
    if (onSettingsChange) {
      onSettingsChange({
        ...settings,
        hideCompleted: newValue
      });
    }
  };

  return (
    <div className="tm-container">
      <div className="tm-toolbar">
        <div 
          className={`tm-toolbar-item ${localHideCompleted ? 'is-active' : ''}`}
          onClick={toggleHideCompleted}
          title="Hide Completed Tasks"
        >
          <EyeOffIcon />
          <span>Hide Completed</span>
        </div>
      </div>
      <table className="tm-table">
        <thead>
          <tr className="tm-header-row">
            {settings?.columns.map((col, idx) => (
              <th key={idx} className="tm-header-cell">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groupedTasks.map((group, gIdx) => (
            <React.Fragment key={group.file}>
              <tr className="tm-file-header-row">
                <td className="tm-file-header-cell" colSpan={settings?.columns.length || 1}>
                  <div className="tm-file-icon-wrapper">
                    <FileIcon />
                    <span className="tm-file-name" style={{ fontSize: 'var(--h1-size, 2em)', fontWeight: 'bold' }}>{group.file}</span>
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
                  settings={settings}
                />
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
