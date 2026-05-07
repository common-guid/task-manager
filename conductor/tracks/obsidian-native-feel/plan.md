# Implementation Plan: Visual Depth and Obsidian-Native Feel

## Phase 1: Research & Setup
1.  Inspect Obsidian's native CSS for "Outline" and "File Explorer" to find indentation guide implementation details.
2.  Check for available Obsidian-native icon classes.

## Phase 2: Implementation
1.  **Add Hover States**:
    -   Update CSS to apply `--background-modifier-hover` on `.tm-row:hover`.
2.  **Implement Indentation Guides**:
    -   Use CSS pseudo-elements (`::before` or `::after`) on indented cells to create vertical guide lines.
    -   Ensure lines align with the indentation depth of each heading level.
3.  **Update Icon Logic**:
    -   Enhance `TaskRow` to detect task syntax in heading text.
    -   Conditionally render checkbox icons instead of generic file/heading icons.
4.  **Theming Refinement**:
    -   Audit all colors and borders to ensure they use standard Obsidian variables.

## Phase 3: Visual Verification
1.  **Deploy for Capture**: Run `scripts/deploy.sh`.
2.  **Run Screenshot Script**:
    -   Execute `scripts/sandbox/capture-obsidian.sh`.
3.  **Save Image**:
    -   Move image to `/tests/interface_images/obsidian-native-feel.png`.

## Phase 4: Final Deployment
1.  Run `scripts/deploy.sh`.
