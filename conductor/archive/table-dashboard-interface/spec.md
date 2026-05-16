# Specification: Table Dashboard Interface

## Background & Motivation
The current Obsidian Task Manager provides a hierarchical view of tasks. The objective is to transition this view into a multi-column dashboard. This "single pane of glass" will present data extracted from files in a grid layout, featuring a title bar for columns and dedicated data cells, significantly enhancing project and task visibility.

## Scope & Impact
*   **Data Extraction:** Update `src/mapper.ts` to parse Dataview-style inline key-value pairs (e.g., `Status:: In Progress`) located beneath headings.
*   **Configuration:** Introduce a mechanism (via `TaskManagerSettings`) to define which keys correspond to which columns on the dashboard.
*   **UI Overhaul:** Refactor `src/components/TaskTable.tsx` and its associated CSS to render a grid-based table instead of an indented list. 
*   **Impact:** This will alter the primary view of the plugin, introducing a structured, tabular layout while maintaining the Obsidian-native feel.

## Proposed Solution
We will utilize the established `Key:: Value` syntax for inline metadata. 
1.  **Parsing:** The markdown mapper will scan the text block between the current heading and the next heading to extract these pairs into a dictionary on the `HeadingTask` object.
2.  **Display:** The React component will render a `<thead>` with configured columns and iterate over the rows, placing the extracted values into the appropriate `<td>` cells. The existing heading text and hierarchy can be preserved in a primary "Name" or "Task" column.

## Alternatives Considered
*   **Tag-Based Routing:** Extracting metadata from tags (e.g., `#status/in-progress`). Rejected because tags are less suited for free-form or lengthy text compared to inline fields.
*   **HTML Comments:** Storing metadata in hidden `<!-- -->` comments. Rejected due to poor user experience when writing/editing notes.
