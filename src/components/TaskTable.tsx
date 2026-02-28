import React from 'react';
import { HeadingTask } from '../types';

interface TaskTableProps {
  tasks: HeadingTask[];
  onOpenLink?: (file: string, heading: string) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, onOpenLink }) => {
  const handleLinkClick = (file: string, heading: string) => {
    if (onOpenLink) {
      onOpenLink(file, heading);
    }
  };

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
          <tr key={index}>
            <td className="link" onClick={() => handleLinkClick(task.file, '')}>{task.file}</td>
            <td className={task.level === 1 ? 'current-level link' : ''} onClick={() => task.level === 1 && handleLinkClick(task.file, task.h1 || '')}>{task.h1}</td>
            <td className={task.level === 2 ? 'current-level link' : ''} onClick={() => task.level === 2 && handleLinkClick(task.file, task.h2 || '')}>{task.h2}</td>
            <td className={task.level === 3 ? 'current-level link' : ''} onClick={() => task.level === 3 && handleLinkClick(task.file, task.h3 || '')}>{task.h3}</td>
            <td className={task.level === 4 ? 'current-level link' : ''} onClick={() => task.level === 4 && handleLinkClick(task.file, task.h4 || '')}>{task.h4}</td>
            <td className={task.level === 5 ? 'current-level link' : ''} onClick={() => task.level === 5 && handleLinkClick(task.file, task.h5 || '')}>{task.h5}</td>
            <td className={task.level === 6 ? 'current-level link' : ''} onClick={() => task.level === 6 && handleLinkClick(task.file, task.h6 || '')}>{task.h6}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
