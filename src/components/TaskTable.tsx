import React from 'react';
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
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const TagPill: React.FC<{ tag: string }> = ({ tag }) => (
  <span className="tag-pill">{tag}</span>
);

const TaskRow = React.memo(({ task, onOpenLink }: { task: HeadingTask, onOpenLink?: (file: string, heading: string) => void }) => {
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
        className={isActive ? 'current-level link' : ''}
        onClick={() => isActive && handleLinkClick(task.file, value.text || '')}
      >
        <div className="cell-content">
          {isActive ? (
            <span className="level-pill">{value.text}</span>
          ) : (
            <span className="heading-text">{value.text}</span>
          )}
          {value.tags.length > 0 && (
            <div className="tag-container">
              {value.tags.map((tag, idx) => (
                isActive ? (
                  <TagPill key={idx} tag={tag} />
                ) : (
                  <span key={idx} className="heading-tag">{tag}</span>
                )
              ))}
            </div>
          )}
        </div>
      </td>
    );
  };

  return (
    <tr>
      <td className="link" onClick={() => handleLinkClick(task.file, '')}>
        <span className="file-icon-wrapper">
          <FileIcon />
          {task.file}
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
  return (
    <table className="task-manager-table">
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
        {tasks.map((task, index) => (
          <TaskRow key={`${task.file}-${task.level}-${task.text}-${index}`} task={task} onOpenLink={onOpenLink} />
        ))}
      </tbody>
    </table>
  );
};
