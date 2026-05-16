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

## Visual Verification | 2026-05-10
Screenshot captured: `/app/tests/interface_images/obsidian-capture-20260510-183347.png`

## Colored Hierarchy Bars | 2026-05-12
Replaced the 1px vertical indentation guides with thicker (4px), colored bars to improve visual grouping of sub-tasks, as requested. 
- Implemented a configurable color palette for heading levels 1-6 in the plugin settings.
- Added `TaskManagerSettings` interface and `TaskManagerSettingTab` to allow users to customize colors via a color picker.
- Updated `TaskTable` and `TaskRow` components to accept settings and apply the configured colors to the `tm-indent-guide` elements.
- Refined `styles.css` to support the wider, rounded bars while maintaining layout alignment.
- Verified that all unit tests pass, including new mocks for the settings system.
- Note: Automated visual verification via `capture-obsidian.sh` could not be completed in this environment due to missing GUI libraries (`libgobject-2.0.so.0`) and tools (`wmctrl`, `scrot`). Manual verification in Obsidian is recommended.

## UI Refinement & Roadmap Creation | 2026-05-12
Implemented several quality-of-life UI updates to `TaskTable.tsx` and established a long-term project roadmap.
- **Removed redundant 'Open' button**: Deleted the separate open action button since clicking the row title already provides the same functionality, decluttering the action container.
- **Resized 'Copy Link' button**: Reduced the overall footprint of the link button (icon and container) to 10px with a 7px icon to minimize visual noise.
- **Enhanced File Headers**: Increased the file name font size to 2em (H1 size) with bold weight to improve visual hierarchy while maintaining the distinct grey background.
- **Project Roadmap**: Conducted a deep dive into project intent and established a `Roadmap.md` (in `conductor/`) outlining immediate functional gains (interactive checkboxes, inline editing) and strategic big ideas (Kanban views, timeline visualization).
- Verified changes via successful `npm run build` and manual inspection of the component code.


## Table Dashboard Interface | 2026-05-16
Implemented a multi-column dashboard interface by extracting Dataview-style inline metadata and providing a configurable table UI.
- **Inline Metadata Extraction**: Updated `src/mapper.ts` with a regex-based parser to extract `Key:: Value` pairs from note content beneath headings. Modified the data model to include a `metadata` dictionary for every task.
- **Configurable Columns**: Added a `columns` setting to `TaskManagerSettings` and implemented a management UI in the plugin settings tab, allowing users to add, rename, reorder, and remove dashboard columns.
- **Multi-Column UI**: Refactored `src/components/TaskTable.tsx` to render a structured `<thead>` based on user settings. Updated `TaskRow` to dynamically render metadata values in their respective columns while preserving hierarchical indentation in the primary column.
- **Native Aesthetic**: Created a comprehensive `styles.css` using standard Obsidian CSS variables for a clean, integrated look. Corrected initial reference-based colors to align with Obsidian's native theme.
- **Robust Verification**: Added comprehensive unit tests in `tests/metadata-parsing.test.ts` covering various edge cases for the metadata parser and updated component tests to validate the multi-column layout.
- **Project Alignment**: Synchronized `conductor/product.md` and `conductor/tech-stack.md` to reflect the transition to a database-driven dashboard interface.
