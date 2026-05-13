# Obsidian Task Manager Roadmap

This roadmap outlines the future trajectory for the Obsidian Task Manager (Bases Edition). It is divided into two main categories: immediate functional enhancements that align with our current Notion-style table theme, and major strategic ideas that could significantly expand the project's scope and utility.

## Phase 1: Immediate Wins & Theme-Aligned Enhancements
These ideas build directly on the existing architecture (the `TaskTable` UI and Markdown mapper) to improve the "single pane of glass" experience without requiring a fundamental rewrite.

1. **Interactive Checkboxes (Bi-directional Sync):** 
   * **Concept:** Currently, tasks (e.g., `- [ ]`) are parsed and rendered with visual square/check icons. Make these icons interactive so that clicking them toggles the state in the UI and automatically updates the underlying Markdown file.
   * **Impact:** Transforms the view from a read-only dashboard into an actionable task manager.

2. **Inline Heading & Task Editing:**
   * **Concept:** Allow users to double-click a row's text (the `tm-level-pill`) to edit the heading or task inline. Upon pressing Enter, the changes are saved back to the original Obsidian file.
   * **Impact:** Reduces context switching by letting users refine task names or project steps directly from the hub.

3. **Advanced Filtering and Search Bar:**
   * **Concept:** Introduce a lightweight toolbar above the table to filter rows by specific tags (e.g., only show `#priority`), file names, or heading levels. 
   * **Impact:** Essential for power users with massive vaults who need to drill down into specific projects or contexts quickly.

4. **Tag Management Context Menu:**
   * **Concept:** Expand the existing tag context menu (which currently handles color) to allow users to add new tags, remove tags, or rename tags across multiple headings directly from the table UI.
   * **Impact:** Enhances the metadata management capabilities without leaving the Bases view.

---

## Phase 2: Big Ideas & Strategic Expansions
These concepts represent significant additions that could shift the plugin from a simple table view into a comprehensive project management suite.

1. **Kanban / Board View Integration:**
   * **Concept:** Build an entirely new View Type alongside the table. Columns would be defined by specific tags (e.g., `#todo`, `#in-progress`, `#done`) or heading levels. Users could drag and drop task cards between columns, automatically updating the tags in the source Markdown.
   * **Impact:** Provides a spatial, workflow-driven alternative to the hierarchical table, capturing users who prefer agile/scrum methodologies.

2. **Timeline / Gantt Chart Visualization:**
   * **Concept:** Leverage the existing parsing of date tags (e.g., `#2026-05-12`) to plot tasks on a visual timeline or calendar. Include dependency lines connecting parent/child tasks to show blockers.
   * **Impact:** Makes the plugin invaluable for project managers and teams, moving beyond simple lists into actual temporal planning.

3. **Dataview-Style Query Language & Rollups:**
   * **Concept:** Introduce a syntax or UI builder that allows users to create dynamic "rollup" columns. For example, a column that calculates the percentage of completed subtasks under a heading, or a formula that calculates days remaining until a deadline.
   * **Impact:** Brings Notion-level database power to Obsidian headings, allowing for automated progress tracking and complex data relationships.

4. **External API Synchronization:**
   * **Concept:** Create a synchronization layer that integrates the local Markdown tasks with external platforms like GitHub Issues, Jira, or Todoist. 
   * **Impact:** Positions the plugin as the ultimate command center, aggregating not just local vault tasks, but external professional obligations into a single Obsidian workspace.
