import { HeadingCache, TagCache } from 'obsidian';
import { HeadingTask, HeadingLevel } from './types';

/**
 * Extracts tags from a heading text (e.g., "# Heading #tag1 #tag2")
 * Returns cleaned text and array of tags (without the #).
 */
export function extractTagsFromText(text: string): { text: string, tags: string[] } {
  const tags: string[] = [];
  const tagRegex = /(^|\s)#([^\s#]+)/g;
  let match;

  while ((match = tagRegex.exec(text)) !== null) {
    tags.push(match[2]);
  }
  
  const cleanText = text.replace(/(^|\s)#([^\s#]+)/g, '').trim();

  return { text: cleanText, tags };
}

/**
 * For a given heading, finds all tags located between it and the very next heading (of any level).
 */
function getTagsForHeading(
  headingIdx: number, 
  headings: HeadingCache[], 
  tags: TagCache[]
): string[] {
  const currentHeading = headings[headingIdx];
  // Find the line of the very next heading, regardless of level
  const nextHeading = headings[headingIdx + 1];
  
  const startLine = currentHeading.position.start.line;
  const endLine = nextHeading ? nextHeading.position.start.line : Infinity;

  // Find tags that are within this specific heading's immediate section
  const sectionTags = tags
    .filter(t => t.position.start.line >= startLine && t.position.start.line < endLine)
    .map(t => t.tag.startsWith('#') ? t.tag.substring(1) : t.tag);

  // Also extract tags from the heading text itself
  const { tags: headingTextTags } = extractTagsFromText(currentHeading.heading);
  
  // Combine and deduplicate
  return Array.from(new Set([...headingTextTags, ...sectionTags]));
}

/**
 * Scans the file content beneath a heading (up to the next heading) for Dataview-style
 * inline metadata fields, e.g., "Status:: In Progress".
 */
export function extractMetadataForHeading(
  headingIdx: number,
  headings: HeadingCache[],
  fileContent: string
): Record<string, string> {
  const metadata: Record<string, string> = {};

  if (!fileContent) return metadata;

  const currentHeading = headings[headingIdx];
  const nextHeading = headings[headingIdx + 1];

  const lines = fileContent.split('\n');
  const startLine = currentHeading.position.start.line;
  const endLine = nextHeading ? nextHeading.position.start.line : lines.length;

  // Extract the text for this section
  const sectionText = lines.slice(startLine + 1, endLine).join('\n');

  // Dataview inline field regex: Key:: Value
  // Supports optional whitespace around the ::
  const regex = /^([a-zA-Z0-9_-]+)::\s*(.*)$/gm;
  let match;

  while ((match = regex.exec(sectionText)) !== null) {
    const key = match[1].trim();
    const value = match[2].trim();
    metadata[key] = value;
  }

  return metadata;
}

export function mapHeadingsToTasks(
  fileName: string, 
  headings: HeadingCache[], 
  tags: TagCache[] = [],
  fileContent: string = ''
): HeadingTask[] {
  const tasks: HeadingTask[] = [];
  const currentPath: HeadingLevel[] = [
    { id: null, text: null, tags: [] }, // level 0 unused
    { id: null, text: null, tags: [] }, 
    { id: null, text: null, tags: [] }, 
    { id: null, text: null, tags: [] }, 
    { id: null, text: null, tags: [] }, 
    { id: null, text: null, tags: [] }, 
    { id: null, text: null, tags: [] }
  ];

  for (let i = 0; i < headings.length; i++) {
    const headingCache = headings[i];
    const { level } = headingCache;
    
    const { text: cleanText } = extractTagsFromText(headingCache.heading);
    const combinedTags = getTagsForHeading(i, headings, tags);
    const metadata = extractMetadataForHeading(i, headings, fileContent);
    
    // Assign a unique ID to this heading
    const headingId = `${fileName}:${i}`;

    // Update the path: set the current level and clear all deeper levels
    currentPath[level] = { id: headingId, text: cleanText, tags: combinedTags };
    for (let j = level + 1; j <= 6; j++) {
      currentPath[j] = { id: null, text: null, tags: [] };
    }

    // A heading has children if the next heading in the file has a higher level
    let hasChildren = false;
    if (i < headings.length - 1) {
      if (headings[i + 1].level > level) {
        hasChildren = true;
      }
    }

    const task: HeadingTask = {
      id: headingId,
      file: fileName,
      h1: { ...currentPath[1] },
      h2: { ...currentPath[2] },
      h3: { ...currentPath[3] },
      h4: { ...currentPath[4] },
      h5: { ...currentPath[5] },
      h6: { ...currentPath[6] },
      level: level,
      text: cleanText,
      tags: combinedTags,
      hasChildren,
      metadata
    };

    tasks.push(task);
  }

  return tasks;
}
