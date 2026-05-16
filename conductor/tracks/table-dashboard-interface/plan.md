# Implementation Plan: Table Dashboard Interface

## Phase 1: Data Model Extraction [checkpoint: 8ae2635]
1.  **[x] Update Types:** Modify `src/types.ts` to add a `metadata: Record<string, string>` property to the `HeadingTask` interface. (9a32410)
2.  **[x] Regex Parser:** In `src/mapper.ts`, implement a function to scan text beneath a heading for Dataview-style inline pairs using a regex (e.g., `/^([a-zA-Z0-9_-]+)::\s*(.*)$/gm`). (d3b4404)
3.  **[x] Populate Metadata:** Update `mapHeadingsToTasks` to use this parser and populate the `metadata` dictionary for each parsed task. Ensure the search text stops at the next heading. (1a517d4)

## Phase 2: Configuration & State
1.  **[x] Column Settings:** Update `TaskManagerSettings` in `src/types.ts` to include a `columns` configuration (an array of column names/keys). (117aa0e)
2.  **[x] Settings UI:** Update `TaskManagerSettingTab` in `src/main.ts` so users can add, remove, and reorder columns. Include a default setup (e.g., ["Task", "Status", "Due"]). (5504292)

## Phase 3: Dashboard UI Overhaul
1.  **Refactor Table Structure:** Modify `src/components/TaskTable.tsx` to output a standard `<thead>` for the column titles. Apply styling to match the objective (e.g., yellow title bar, green text).
2.  **Row Rendering:** Refactor `TaskRow` to map over the configured columns.
    *   The primary column ("Task") will contain the current hierarchical visual logic (indentation, collapse chevron, task text).
    *   Subsequent columns will display values from the `task.metadata` dictionary matching the column key.
3.  **CSS Grid/Table Styling:** Update `src/styles/` to implement defined borders and column widths (the "red rectangles").

## Phase 4: Integration & Verification
1.  **Unit Tests:** Add tests to `tests/heading-mapper.test.ts` to verify inline field parsing.
2.  **Visual Verification:** Run `scripts/deploy.sh` and capture screenshots via the sandbox scripts to ensure the new table layout renders correctly with the defined columns.
