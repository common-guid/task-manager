# Implementation Plan: Implement core Task Manager integration with Obsidian Bases

## Phase 1: Heading Extraction and Hierarchy Mapping [checkpoint: 28be8af]
This phase implements the logic to extract headings and their hierarchical context from Markdown files.

- [x] Task: Define TypeScript interfaces for heading-based task records [6650dc0]
    - [ ] Write unit tests for the hierarchical task data model
    - [ ] Implement the `HeadingTask` interface with `file` and `h1-h6` fields
- [x] Task: Implement heading extraction logic [c86b5c7]
    - [ ] Write failing unit tests for mapping a list of Obsidian `HeadingCache` objects to `HeadingTask` records
    - [ ] Implement the mapper logic to correctly populate `h1-h6` columns based on the current heading's level and its preceding parents
- [x] Task: Conductor - User Manual Verification 'Phase 1: Heading Extraction and Hierarchy Mapping' (Protocol in workflow.md) [28be8af]

## Phase 2: Custom Bases View Registration [checkpoint: b91bf4a]
This phase focuses on registering the custom view within the Obsidian Bases ecosystem.

- [x] Task: Implement the "Task Table" layout registration [3bb648d]
    - [x] Register the `task-table` view type in the plugin's `onload` function
    - [x] Create the `TaskBasesView` class extending `BasesView`
- [x] Task: Implement data flattening in the view [3bb648d]
    - [x] Implement the `onDataUpdated` method to process `this.data`
    - [x] Write logic to transform the list of `BasesEntry` (files) into a flattened list of `HeadingTask` records
- [x] Task: Conductor - User Manual Verification 'Phase 2: Custom Bases View Registration' (Protocol in workflow.md) [b91bf4a]

## Phase 3: Task Table UI Rendering [checkpoint: 14c592f]
This phase implements the specific table rendering logic for the Task Manager.

- [x] Task: Create the React-based table component for headings [3854837]
    - [x] Define the table structure with columns: `file`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
    - [x] Implement conditional rendering to highlight the "current" heading level in each row
- [x] Task: Implement interactive features for headings [3854837]
    - [x] Add links to the source file and specific heading (using Obsidian URI or `openLinkText`)
    - [x] Ensure hover previews work for the source file
- [x] Task: Conductor - User Manual Verification 'Phase 3: Task Table UI Rendering' (Protocol in workflow.md) [14c592f]

## Phase 4: Final Validation and Edge Case Handling [checkpoint: 17543d4]
This phase focuses on ensuring the system handles complex documents correctly.

- [x] Task: Verify hierarchy with deeply nested headings [a23fe39]
    - [x] Create test files with varying heading levels (e.g., skip H2, go straight to H3)
    - [x] Verify that the hierarchy logic handles these cases gracefully
- [x] Task: Optimize rendering performance for large vaults [TBD]
    - [x] Implement virtualization or efficient DOM updates for tables with many heading rows
- [x] Task: Conductor - User Manual Verification 'Phase 4: Final Validation and Documentation' (Protocol in workflow.md) [17543d4]

## Phase: Review Fixes
- [x] Task: Apply review suggestions [8c5f48c]
