# Implementation Plan: Notion-Style Task Manager UI

## Objective
Enhance the Obsidian Task Manager (`TaskTable.tsx`) interface to closely resemble Notion's clean, structured database table format.

## Phase 1: Preparation & Styling Scaffold
1. **Locate/Create Stylesheet:** Identify the main CSS file for the Obsidian plugin (typically `styles.css` at the root). If it doesn't exist, create it and ensure it's referenced in the build process.
2. **Scoping:** Ensure all new CSS classes (e.g., `.task-manager-table`, `.level-pill`, `.file-icon-wrapper`) are properly scoped to the plugin's views to prevent conflicts with other Obsidian themes or plugins.

## Phase 2: Row Icons and Enhanced Padding (Idea 1)
1. **Update `TaskTable.tsx` Component:**
   - Import an SVG icon or use Obsidian's built-in Lucide icons (e.g., `file-text` or `document`).
   - Modify the `file` column cell in `TaskRow` to prepend the icon to the file name. Wrap them in a flex container for alignment.
2. **Update CSS:**
   - Target `.task-manager-table tr` and `.task-manager-table td`.
   - Increase vertical and horizontal padding (e.g., `padding: 8px 12px;`).
   - Increase `line-height` and set `vertical-align: middle;` to give the data generous spacing.
   - Style the icon wrapper to have a muted color and consistent sizing (e.g., `width: 16px; height: 16px; margin-right: 8px;`).

## Phase 3: "Pill" Styling for Metadata and Levels (Idea 2)
1. **Update `TaskTable.tsx` Component:**
   - In `TaskRow`, identify when a heading cell (`h1` through `h6`) is the active level (`task.level === N`).
   - Instead of placing the text directly in the `<td>`, wrap the text in a `<span className="level-pill">`.
2. **Update CSS:**
   - Define `.level-pill` styling.
   - Apply `border-radius: 4px;` and a subtle background color using Obsidian's CSS variables (e.g., `background-color: var(--background-modifier-accent);` or a soft semantic color).
   - Add internal padding (e.g., `padding: 2px 6px;`).
   - Reduce the font size slightly (e.g., `font-size: 0.85em;`) and ensure the text color provides good contrast.

## Phase 4: Structured Header with Subtle Dividers (Idea 3)
1. **Update CSS for Table Headers:**
   - Target `.task-manager-table thead th`.
   - Add a subtle vertical divider using `border-right: 1px solid var(--background-modifier-border);`. (Remove the right border on the last `th` using `:last-child`).
   - Add a definitive bottom border to the `<thead>` or the `th` elements to separate the header from the body rows.
   - Update typography: apply `text-transform: capitalize;`, set color to `var(--text-muted);`, and set `font-weight: 500;`.
   - Set text alignment to left (or match the column content) with consistent padding.
2. **Add Interactive Row Hover (Bonus):**
   - Target `.task-manager-table tbody tr:hover`.
   - Add a subtle background color shift (e.g., `background-color: var(--background-modifier-hover);`) to mimic Notion's row hover interaction.

## Phase 5: Testing and Refinement
1. Build the plugin and reload it in Obsidian.
2. Open the Task Manager view to verify the visual changes against different Obsidian themes (light mode and dark mode) to ensure the CSS variables provide appropriate contrast.
3. Verify that click events on the file names and the pills continue to trigger the `onOpenLink` function correctly.