import { HeadingTask } from './types';

export function mapHeadingsToTasks(fileName: string, headings: any[]): HeadingTask[] {
  const tasks: HeadingTask[] = [];
  const currentPath: (string | null)[] = [null, null, null, null, null, null, null]; // index 1-6

  for (const headingCache of headings) {
    const { heading, level } = headingCache;

    // Update the path: set the current level and clear all deeper levels
    currentPath[level] = heading;
    for (let i = level + 1; i <= 6; i++) {
      currentPath[i] = null;
    }

    const task: HeadingTask = {
      file: fileName,
      h1: currentPath[1],
      h2: currentPath[2],
      h3: currentPath[3],
      h4: currentPath[4],
      h5: currentPath[5],
      h6: currentPath[6],
      level: level,
      text: heading
    };

    tasks.push(task);
  }

  return tasks;
}
