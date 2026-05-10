# Obsidian Task Manager (Bases Edition)

A centralized, hierarchical task management hub for Obsidian, powered by the core **Bases** plugin.

## 🚀 Overview
The Obsidian Task Manager transforms your vault's Markdown headings into a unified, database-driven workspace. By leveraging the **Bases** core plugin, it provides a "single pane of glass" to manage complex project hierarchies, task dependencies, and knowledge management without leaving your Markdown-based workflow.

### Key Features
- **Centralized Hub:** A hierarchical view projecting Markdown headings as grouped rows.
- **Visual Hierarchy:** Automatic indentation and level-specific styling (H1-H6) for clear context.
- **Bases Integration:** Built directly on top of Obsidian's "Bases" database-like functionality.
- **Local-First:** All data stays in your vault, stored in standard Markdown.

---

## 🏗️ Architecture

The plugin follows a clean, reactive architecture integrated with the Obsidian environment:

- **Data Layer (`mapper.ts`):** Scans the Obsidian MetadataCache to transform Markdown headings and tags into a structured `HeadingTask` model.
- **View Layer (`TaskBasesView`):** Extends the `BasesView` from the Obsidian API to register a custom view type (`task-table`).
- **UI Components (`TaskTable.tsx`):** A React-based interface that handles grouping logic, collapsible hierarchy state, and indentation-based rendering.
- **Styles (`styles.css`):** Scoped CSS providing a Notion-style table aesthetic with Obsidian-native theme compatibility.

---

## 🛠️ Development & Extension

### Modifying the UI
The main interface is located in `src/components/TaskTable.tsx`. 
- To change how rows are grouped, modify the `groupedTasks` useMemo hook.
- To adjust visual indentation or heading styles, update the `getHeadingStyle` function within the `TaskRow` component.

### Adding New Data Fields
1. Update the `HeadingTask` interface in `src/types.ts`.
2. Modify `src/mapper.ts` to extract the new data from the Obsidian `CachedMetadata`.
3. Update `TaskRow` in `TaskTable.tsx` to display the new field.

### Running the Project
1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Build the Plugin:**
   ```bash
   npm run build
   ```
   This generates `main.js` and copies it along with `styles.css` and `manifest.json` to the `test-vault`.

3. **Testing:**
   ```bash
   npm test          # Run unit tests
   npm run coverage  # Check code coverage
   ```

---

## 🔌 Installation

1. Create a folder named `task-view` in your vault's `.obsidian/plugins/` directory.
2. Copy `main.js`, `styles.css`, and `manifest.json` into that folder.
3. Enable **Bases** in Obsidian core settings.
4. Enable **Task View** in the Community Plugins settings.
5. Open the Command Palette (`Ctrl+P`) and run `Bases: Open Bases` to view your task hub.

---

## 📜 License
Refer to the project's license file for usage terms.
