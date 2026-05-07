# Implementation Plan: Reimagining the Hierarchy

## Phase 1: Research & Setup
1.  [x] Verify the current data structure of `HeadingTask` to ensure it contains necessary level and grouping information.
2.  [~] Review `TaskTable.tsx` to identify where to inject grouping logic.

## Phase 2: Implementation
1.  **Refactor Component Structure**:
    -   Modify `TaskTable` to group `filteredTasks` by `file`.
    -   Introduce a `FileGroup` component or sub-render to display the file header.
2.  **Redesign TaskRow**:
    -   Replace the H1-H6 cell rendering with a single cell.
    -   Calculate indentation style based on `task.level`.
    -   Apply heading-specific styling (bold for H1, smaller for H4+, etc.).
3.  **Update CSS**:
    -   Adjust `tm-table` and `tm-row` classes to accommodate the new layout.

## Phase 3: Visual Verification
1.  **Deploy for Capture**: Run `scripts/deploy.sh` to ensure the latest changes are in the sandbox environment.
2.  **Run Screenshot Script**:
    -   Use `scripts/sandbox/manage-obsidian.sh start` if needed.
    -   Execute `scripts/sandbox/capture-obsidian.sh`.
3.  **Save Image**:
    -   Copy/Move the captured image to `/tests/interface_images/reimagine-hierarchy.png`.

## Phase 4: Final Deployment
1.  Run `scripts/deploy.sh` for final verification.
