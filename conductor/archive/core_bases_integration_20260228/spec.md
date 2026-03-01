# Specification: Implement core Task Manager integration with Obsidian Bases

## Overview
This track focuses on establishing a specialized integration between the Task Manager and the Obsidian "Bases" core plugin. Unlike standard Bases views that map one file to one row, this implementation will project individual Markdown headings as distinct rows within a 'Task Table' layout, preserving their hierarchical context.

## Scope
- Define a "Task Table" Bases layout that flattens headings within files into individual rows.
- Implement heading extraction logic that captures the H1-H6 hierarchy for every heading in the target directory.
- Implement a hierarchical context mapper that populates columns for the file name and each level of the hierarchy (H1-H6).
- Ensure the solution avoids creating individual files for each heading (Option B/C approach).

## Requirements

### Task Data Model (Virtual Rows)
Each row in the Task Table represents a single Markdown heading and must include:
- **Source File:** The name of the file containing the heading.
- **Hierarchy Context:** The text of the parent headings at each level (H1, H2, H3, H4, H5, H6).
- **Task Status:** Extracted from the heading or its immediate content (if applicable).

### Bases Integration
- The plugin will register a custom Bases view type (e.g., `task-table`).
- This view will consume standard `BasesEntry` objects (files) and dynamically expand them into multiple heading-based rows during rendering.
- The view will render a table with the following mandatory columns:
  | file | h1 | h2 | h3 | h4 | h5 | h6 |

### User Interface
- A dedicated "Task Manager Hub" that defaults to the `task-table` layout.
- The UI must correctly display the hierarchy, showing which H-level the current task (heading) belongs to.

## Technical Details
- **Language:** TypeScript
- **Framework:** React
- **Dependencies:** Obsidian API (MetadataCache for headings), Obsidian Bases (BasesView class).
- **Extraction Strategy:** Use `app.metadataCache.getFileCache(file).headings` to retrieve and process heading hierarchies efficiently.

## Acceptance Criteria
- Opening a Base file with the `task-table` layout displays one row for every heading in the filtered files.
- The `file` column correctly identifies the source document.
- The `h1` through `h6` columns correctly represent the heading's position in the document hierarchy (e.g., if a heading is an H3, its H1 and H2 parents are displayed in the respective columns).
- No additional Markdown files are created during the row generation process.
