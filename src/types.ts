export interface HeadingLevel {
  text: string | null;
  tags: string[];
}

export interface HeadingTask {
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
}
