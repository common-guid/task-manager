# Implementation Plan: Modernizing Tags and Metadata

## Phase 1: Research & Setup
1.  Identify common tags and metadata patterns in the current test-vault.
2.  Research Obsidian's built-in CSS variables for tag colors (`--tag-color`, etc.).

## Phase 2: Implementation
1.  **Update TagPill Component**:
    -   Refactor `TagPill` in `TaskTable.tsx` to support dynamic background and text colors.
    -   Implement a simple color-hashing function for automatic tag coloring.
2.  **Enhance Metadata Rendering**:
    -   Update `renderCell` to detect specific metadata (e.g., strings matching ISO dates).
    -   Integrate inline SVG icons for detected metadata types.
3.  **Refine CSS**:
    -   Add specific styles for `.tm-tag-pill` and new metadata badge classes.
    -   Ensure hover states and contrast ratios meet accessibility standards.

## Phase 3: Visual Verification
1.  **Deploy for Capture**: Run `scripts/deploy.sh` to update the sandbox.
2.  **Run Screenshot Script**:
    -   Execute `scripts/sandbox/capture-obsidian.sh`.
3.  **Save Image**:
    -   Move the captured image to `/tests/interface_images/modernize-tags-metadata.png`.

## Phase 4: Final Deployment
1.  Run `scripts/deploy.sh` for final verification.
