export interface HeadingLevel {
  /** Unique identifier for this heading instance (e.g., "file.md:0") */
  id: string | null;
  text: string | null;
  tags: string[];
}

export interface HeadingTask {
  /** The unique ID of the current heading. */
  id: string;
  /** The file containing the heading. */
  file: string;
  /** Heading levels 1-6. */
  h1: HeadingLevel;
  h2: HeadingLevel;
  h3: HeadingLevel;
  h4: HeadingLevel;
  h5: HeadingLevel;
  h6: HeadingLevel;
  /** The level of the current heading (1-6). */
  level: number;
  /** The text of the current heading itself (cleaned). */
  text: string;
  /** The tags of the current heading. */
  tags: string[];
  /** Whether this heading has any sub-headings beneath it. */
  hasChildren: boolean;
  /** Extracted metadata from inline fields (e.g., Key:: Value). */
  metadata: Record<string, string>;
}

export interface TaskManagerSettings {
  tagColors: Record<string, string>;
  levelColors: string[];
  columns: string[];
  hideCompleted: boolean;
}

export const DEFAULT_SETTINGS: TaskManagerSettings = {
  tagColors: {},
  levelColors: [
    '#70e0af', // Level 1 - Tealish
    '#70a1e0', // Level 2 - Bluish
    '#e0d270', // Level 3 - Yellowish
    '#e070af', // Level 4 - Pinkish
    '#e0e0e0', // Level 5 - Whitish
    '#e0a170', // Level 6 - Orangish
  ],
  columns: ['Task', 'Status', 'Due'],
  hideCompleted: false
};
