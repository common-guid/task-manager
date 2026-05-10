## Fix: "h is not a constructor" on Plugin Load | 2026-03-08
Resolved an issue where the `task-view` plugin failed to load in Obsidian with a `TypeError: h is not a constructor`. Obsidian requires the main plugin class to be the `default` export of the script. Updated `src/main.ts` to export `TaskManagerPlugin` as default (`export default class...`) instead of a named export, which allows Obsidian's plugin loader to correctly instantiate the class. The unit tests were also mapped to use the default export.

## Fix: Plugin not loading natively in test-vault | 2026-03-08
Resolved an issue where the `task-view` plugin was not loading due to a missing `manifest.json`. Created the required file, and updated the build script (`package.json`) to accurately compile and copy `main.js`, `manifest.json`, and `styles.css` directly into the `test-vault/.obsidian/plugins/task-view/` directory. Note: manual verification in Obsidian is required to finally validate the UI load.

## Fix: "Unknown view type: task-table" on Startup | 2026-03-08
Resolved a startup race condition where Obsidian's deferred-view system could render the active `.base` tab before the community plugin's `onload` registered the `task-table` view type; the fix captures `registerBasesView`'s boolean return (warning and exiting early if Bases is disabled) and schedules an `app.workspace.onLayoutReady` callback that calls `leaf.setViewState(leaf.getViewState())` on every open Bases leaf, forcing them to re-render and pick up the now-registered view type.

## Notion-Style Task Manager UI Upgrade | 2026-03-08
Implemented a Notion-style visual overhaul for `TaskTable.tsx` across four phases: created a scoped `styles.css` with Obsidian CSS variables for enhanced row padding, column dividers, and hover effects; added an inline Lucide-style `FileIcon` SVG with a `.file-icon-wrapper` flex container in the file cell; wrapped active heading-level text in `.level-pill` badge spans; and updated the test suite to validate the new DOM structure (pill class on active spans, file icon wrapper presence).

## Notion-Style Tag Pills | 2026-03-16
Implemented Notion-style tag pills within the Task Manager table. Tags are automatically correlated with their immediate parent heading based on file position, preventing "bubbling up" to higher-level parents. Updated the data model, mapping logic, and React components to support this structured display; added CSS for `.tag-pill` (subtle purple background with grey text) and `.heading-tag` (plain text for parent levels). Automated tests validate that only the active level's tags are rendered as pills and that tags are correctly scoped to their immediate section. Created a visual verification environment in `tests/` including a mock dataset and Chrome startup script for manual UI review.

## Move Toggle to File Column | 2026-03-25
Refined the Tree Table UI by moving the hierarchical toggle from the heading cells to the first column (File column). Replaced the file icon with a chevron toggle for parent rows to maintain a clean layout in content columns. Updated styling to ensure identical 16x16px dimensions and vertical alignment between the toggle and file icons. Updated the test suite to verify the new toggle location and confirmed that heading columns no longer contain toggle logic. Manual verification in Obsidian is required to confirm pixel-perfect alignment.

## Fix: Styling Conflicts and Icon Sizing | 2026-03-25
Resolved issues where Obsidian themes or other plugins (like "Bases") were causing styling conflicts, leading to giant icons and unintended UI elements. Switched to unique `tm-` prefixed class names for all components to prevent namespace collisions. Implemented inline styles for SVG icon and button dimensions to ensure a consistent 16x16px footprint that overrides global theme CSS. Updated `styles.css` with higher-specificity rules and `!important` flags for critical layout properties. These changes ensure the Notion-style UI remains stable regardless of the user's active theme or environment.

## Visual Verification | 2026-05-07
Screenshot captured: `/app/tests/interface_images/immediate-functional-gains.png`


## Immediate Functional Gains | 2026-05-07
Implemented sticky file headers, breadcrumb tooltips on hover using full parent hierarchy, and quick actions (Open/Copy Link) on hover for TaskTable rows.
