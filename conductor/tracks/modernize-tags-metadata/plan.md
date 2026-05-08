# Implementation Plan: Modernizing Tags and Metadata

## Phase 1: Research & Setup [checkpoint: ddf4422]
1.  [x] Identify common tags and metadata patterns in the current test-vault. ddf4422
2.  [x] Research Obsidian's built-in CSS variables for tag colors (`--tag-color`, etc.). ddf4422

## Phase 2: Implementation [checkpoint: e54b6cb]
1.  [x] **Update TagPill Component**:
    -   Refactor `TagPill` in `TaskTable.tsx` to support dynamic background and text colors.
    -   Implement a simple color-hashing function for automatic tag coloring. e54b6cb
2.  [x] **Enhance Metadata Rendering**:
    -   Update `renderCell` (TaskRow logic) to detect specific metadata (e.g., strings matching ISO dates).
    -   Integrate inline SVG icons for detected metadata types. e54b6cb
3.  [x] **Refine CSS**:
    -   Add specific styles for `.tm-tag-pill` and new metadata badge classes.
    -   Ensure hover states and contrast ratios meet accessibility standards. e54b6cb

## Phase 3: Custom Tag Coloring [checkpoint: 94b54a1]
1.  [x] **Right-Click Menu Integration**:
    -   Add a context menu listener to the `TagPill` component.
    -   Implement the "Tag Color" menu item using Obsidian's `Menu` API. 94b54a1
2.  [x] **Color Wheel Selection**:
    -   Develop or integrate a color picker modal (color wheel).
    -   Handle color selection and update the plugin's persistent settings. 94b54a1
3.  [x] **Apply Persistent Styling**:
    -   Modify `TagPill` to fetch and apply user-defined colors from settings. 94b54a1

## Phase 4: Visual Verification [checkpoint: 4ebd848]
1.  [x] **Deploy for Capture**: Run `scripts/deploy.sh` to update the sandbox. bd854d7
2.  [s] **Run Screenshot Script**:
    -   Execute `scripts/sandbox/capture-obsidian.sh`. (Skipped: Missing sandbox dependencies)
3.  [s] **Save Image**:
    -   Move the captured image to `/tests/interface_images/modernize-tags-metadata.png`. (Skipped)

## Phase 5: Final Deployment
1.  [x] **Final Deployment**: Run `scripts/deploy.sh` for final verification. bd854d7

## Phase: Review Fixes
- [x] Task: Apply review suggestions 3fe94e0
