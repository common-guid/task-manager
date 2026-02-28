# Implementation Plan: Implement core Task Manager integration with Obsidian Bases

## Phase 1: Heading Extraction and Hierarchy Mapping
This phase implements the logic to extract headings and their hierarchical context from Markdown files.

- [x] Task: Define TypeScript interfaces for heading-based task records [6650dc0]
    - [ ] Write unit tests for the hierarchical task data model
    - [ ] Implement the `HeadingTask` interface with `file` and `h1-h6` fields
- [ ] Task: Implement heading extraction logic
    - [ ] Write failing unit tests for mapping a list of Obsidian `HeadingCache` objects to `HeadingTask` records
    - [ ] Implement the mapper logic to correctly populate `h1-h6` columns based on the current heading's level and its preceding parents
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Heading Extraction and Hierarchy Mapping' (Protocol in workflow.md)

## Phase 2: Custom Bases View Registration
This phase focuses on registering the custom view within the Obsidian Bases ecosystem.

- [ ] Task: Implement the "Task Table" layout registration
    - [ ] Register the `task-table` view type in the plugin's `onload` function
    - [ ] Create the `TaskBasesView` class extending `BasesView`
- [ ] Task: Implement data flattening in the view
    - [ ] Implement the `onDataUpdated` method to process `this.data`
    - [ ] Write logic to transform the list of `BasesEntry` (files) into a flattened list of `HeadingTask` records
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Custom Bases View Registration' (Protocol in workflow.md)

## Phase 3: Task Table UI Rendering
This phase implements the specific table rendering logic for the Task Manager.

- [ ] Task: Create the React-based table component for headings
    - [ ] Define the table structure with columns: `file`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
    - [ ] Implement conditional rendering to highlight the "current" heading level in each row
- [ ] Task: Implement interactive features for headings
    - [ ] Add links to the source file and specific heading (using Obsidian URI or `openLinkText`)
    - [ ] Ensure hover previews work for the source file
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Task Table UI Rendering' (Protocol in workflow.md)

## Phase 4: Final Validation and Edge Case Handling
This phase focuses on ensuring the system handles complex documents correctly.

- [ ] Task: Verify hierarchy with deeply nested headings
    - [ ] Create test files with varying heading levels (e.g., skip H2, go straight to H3)
    - [ ] Verify that the hierarchy logic handles these cases gracefully
- [ ] Task: Optimize rendering performance for large vaults
    - [ ] Implement virtualization or efficient DOM updates for tables with many heading rows
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Validation and Documentation' (Protocol in workflow.md)
