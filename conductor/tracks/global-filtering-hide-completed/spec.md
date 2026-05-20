# Specification: Global Filtering & "Hide Completed" Toggle

## Goal
Implement a robust filtering system that allows users to hide completed tasks from the table view without removing them from the underlying Markdown files.

## Background
Currently, the Task Manager displays all tasks found in the vault. As users complete tasks, the table can become cluttered with finished items. Users need a way to focus on active work.

## Requirements
- Add a "Hide Completed" toggle to the UI.
- When enabled, tasks marked as completed (`- [x]`) should be filtered out of the view.
- Tasks with metadata `Status:: Done` (or similar "done" states) should also be filtered out.
- The filtering should happen in the UI layer (mapper or component) to ensure the underlying data remains intact.
- The state of the toggle should be persistent (optional, but recommended).

## Technical Details
- **Filtering Logic**: Update `mapper.ts` or `TaskTable.tsx` to filter the task list based on the completion status.
- **UI Component**: Add a toggle or checkbox in the header or a dedicated toolbar area.
- **Obsidian API**: Use Obsidian's built-in UI components where possible to maintain a native feel.

## Success Criteria
- User can toggle the visibility of completed tasks.
- Completed tasks are successfully hidden/shown.
- Performance remains high even with large task lists.
