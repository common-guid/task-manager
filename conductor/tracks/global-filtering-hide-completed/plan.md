# Implementation Plan: Global Filtering & "Hide Completed" Toggle

## Phase 1: Research & Setup
- [x] Review current `TaskTable.tsx` and `mapper.ts` to identify the best place for filtering logic.
- [x] Check how state is currently managed in the plugin.

## Phase 2: Filtering Logic
- [x] Implement a `filterTasks` function that takes the task list and filtering criteria. aefb57c
- [x] Add support for filtering by checkbox status (`- [x]`). aefb57c
- [x] Add support for filtering by `Status` metadata field. aefb57c

## Phase 3: UI Implementation
- [x] Add a toolbar or header section to the `TaskTable` component. 953f301
- [x] Implement a "Hide Completed" toggle button using Obsidian's styling. 953f301
- [x] Connect the toggle state to the filtering logic. 953f301

## Phase 4: Persistence
- [x] Save the filter state in the plugin settings so it persists across restarts. 953f301

## Phase 5: Testing & Validation
- [x] Verify filtering works with various task formats. 70d2e45
- [x] Test performance with a large number of completed tasks. 70d2e45
- [x] Ensure no tasks are accidentally deleted from Markdown files. 70d2e45
