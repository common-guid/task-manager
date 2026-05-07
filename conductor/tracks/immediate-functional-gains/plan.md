# Implementation Plan: Immediate Functional Gains

## Phase 1: Research & Setup
1.  Verify the browser/environment support for `position: sticky` within Obsidian's view containers.
2.  Identify a lightweight tooltip implementation or use Obsidian's native `setTooltip` if applicable to React elements.

## Phase 2: Implementation
1.  **Implement Sticky Headers**:
    -   Update the CSS for the file-group header to use `position: sticky` and `top: 0`.
    -   Ensure proper z-indexing to keep headers above row content but below the table header.
2.  **Add Breadcrumb Tooltips**:
    -   Enhance the `TaskRow` component to construct the breadcrumb string from the task metadata.
    -   Attach hover listeners to display the breadcrumb.
3.  **Implement Quick Actions**:
    -   Create a `tm-actions-container` that appears on row hover.
    -   Add buttons with icons for "Open" and "Copy Link".
    -   Implement the logic to handle these actions via the Obsidian API.

## Phase 3: Visual Verification
1.  **Deploy for Capture**: Run `scripts/deploy.sh`.
2.  **Run Screenshot Script**:
    -   Execute `scripts/sandbox/capture-obsidian.sh`.
3.  **Save Image**:
    -   Move image to `/tests/interface_images/immediate-functional-gains.png`.

## Phase 4: Final Deployment
1.  Run `scripts/deploy.sh`.
