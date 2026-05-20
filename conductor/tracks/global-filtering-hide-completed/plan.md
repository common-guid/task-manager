# Implementation Plan: Global Filtering & "Hide Completed" Toggle

## Phase 1: Research & Setup
- [x] Review current `TaskTable.tsx` and `mapper.ts` to identify the best place for filtering logic.
- [x] Check how state is currently managed in the plugin.

## Phase 2: Filtering Logic
- [x] Implement a `filterTasks` function that takes the task list and filtering criteria. aefb57c
- [x] Add support for filtering by checkbox status (`- [x]`). aefb57c
- [x] Add support for filtering by `Status` metadata field. aefb57c

## Phase 3: UI Implementation
- [ ] Add a toolbar or header section to the `TaskTable` component.
- [ ] Implement a "Hide Completed" toggle button using Obsidian's styling.
- [ ] Connect the toggle state to the filtering logic.

## Phase 4: Persistence
- [ ] Save the filter state in the plugin settings so it persists across restarts.

## Phase 5: Testing & Validation
- [ ] Verify filtering works with various task formats.
- [ ] Test performance with a large number of completed tasks.
- [ ] Ensure no tasks are accidentally deleted from Markdown files.
