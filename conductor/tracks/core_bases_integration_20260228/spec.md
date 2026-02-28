# Specification: Implement core Task Manager integration with Obsidian Bases

## Overview
This track focuses on establishing the foundational integration between the Task Manager and the Obsidian "Bases" core plugin. The goal is to provide a 'single pane of glass' for tasks using database-like views.

## Scope
- Define a standard set of task properties (status, priority, due date, dependencies).
- Implement logic to extract these properties from Markdown file frontmatter/properties.
- Define and generate a `.base` file structure optimized for task management.
- Create a basic UI hub in Obsidian that displays the task data using a Bases view.

## Requirements

### Task Properties
Each task must support the following properties:
- `status`: (e.g., Todo, In Progress, Done, Cancelled)
- `priority`: (e.g., Low, Medium, High, Urgent)
- `due_date`: (ISO 8601 date string)
- `dependencies`: (List of links to other task files)
- `parent_task`: (Link to a parent task file, if any)

### Bases Integration
- The system must generate or manage a `.base` file that defines how tasks are filtered, sorted, and displayed.
- The Bases view should support both Table and Card layouts (as per Obsidian Bases capabilities).

### User Interface
- A dedicated view or ribbon action to open the "Task Manager Hub".
- The Hub must render the Bases view correctly within an Obsidian workspace leaf.

## Technical Details
- **Language:** TypeScript
- **Framework:** React
- **Dependencies:** Obsidian API, Obsidian Bases (core plugin)
- **Data Format:** Markdown frontmatter for task data; `.base` (JSON-like) for view configuration.

## Acceptance Criteria
- Tasks from across the vault are successfully aggregated into a single Bases view.
- Task properties (status, priority, etc.) are correctly reflected in the Bases table.
- Changes made in the Bases view (if supported by the API) or in the underlying Markdown files are synced.
- The UI follows the minimalist, native-Obsidian aesthetic defined in the Product Guidelines.
