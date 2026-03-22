# Implementation Plan: Hierarchical Heading Toggles (Subtasks)

This plan outlines the implementation of a hierarchical toggle feature in the Task Manager plugin. This allows users to collapse and expand heading levels, effectively treating lower-numbered headings as subtasks of higher-numbered headings.

## Objective
Enable a "folding" experience in the Notion-style table where H1 headings can collapse all H2-H6 headings beneath them, H2 can collapse H3-H6, and so on.

## Key Files & Context
- `src/types.ts`: Define unique IDs for headings.
- `src/mapper.ts`: Assign IDs and detect if a heading has sub-headings.
- `src/components/TaskTable.tsx`: Manage collapse state, filter rows, and render the toggle button (Chevron).
- `styles.css`: Add styling for the toggle icon and its transitions.

## Implementation Steps

### 1. Data Model Enhancement (`src/types.ts`)
Update `HeadingLevel` and `HeadingTask` to include unique IDs.

```typescript
export interface HeadingLevel {
  id: string | null; // Unique identifier (e.g., file:index)
  text: string | null;
  tags: string[];
}

export interface HeadingTask {
  id: string; // The ID of the current heading itself
  file: string;
  h1: HeadingLevel;
  // ... h2-h6
  level: number;
  text: string;
  tags: string[];
  hasChildren: boolean; // Flag to indicate if there are sub-headings
}
```

### 2. Mapping Logic Update (`src/mapper.ts`)
- In `mapHeadingsToTasks`, assign a unique ID to each heading (e.g., `fileName:index`).
- Propagate these IDs through the `currentPath` so that a task "knows" the IDs of its parent headings.
- Set `hasChildren: true` if the *next* heading in the file has a higher level (e.g., current is H1, next is H2).

### 3. UI Implementation (`src/components/TaskTable.tsx`)
- **State**: Use `React.useState<Set<string>>(new Set())` to track `collapsedIds`.
- **Filtering**: Before rendering, filter the `tasks` array. A task is hidden if ANY of its parent heading IDs (e.g., `task.h1.id` for an H2 task) are present in the `collapsedIds` set.
- **Toggle Icon**: Create a `Chevron` SVG component that rotates 90 degrees when collapsed.
- **Interaction**: In `TaskRow`, render the `Chevron` next to the text ONLY in the "primary" cell (where `task.level === current_column_level`) and ONLY if `task.hasChildren` is true.
- **Click Handler**: Clicking the `Chevron` toggles the task's `id` in the `collapsedIds` set.

### 4. Styling (`styles.css`)
- Add `.toggle-button` styles (button reset, padding, cursor).
- Add `.chevron-icon` styles (size, transition for rotation).
- Add `.collapsed` class for the icon's rotation.
- Ensure the toggle button is aligned to the left of the heading text.

## Verification & Testing

### Automated Tests
- Create `tests/hierarchy.test.ts` to verify:
    - Unique ID generation in the mapper.
    - Correct `hasChildren` flag detection.
    - Parent IDs are correctly captured in the `HeadingTask` object.

### Manual Verification
1. Open a file with nested headings (H1 > H2 > H3).
2. Click the toggle on H1. All H2 and H3 headings below it should disappear.
3. Click it again. They should reappear.
4. Click the toggle on H2. The H3 headings below it should disappear, but H1 and H2 should remain visible.
5. Verify that headings from *other* files are not affected (IDs must be file-specific).
