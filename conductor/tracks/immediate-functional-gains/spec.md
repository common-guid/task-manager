# Specification: Immediate Functional Gains

## Goal
Improve the usability and interactivity of the TaskTable by adding features that provide better context during navigation and enable quick actions without leaving the view.

## Requirements
1.  **Sticky File Headers**: When scrolling through a long list of tasks, the current file name header should remain stuck to the top of the viewport.
2.  **Breadcrumb Tooltips**: On hover of any heading row, show a tooltip or status bar item displaying the full hierarchy (e.g., `Project.md > Phase 1 > Setup`).
3.  **Quick Actions**: Add "ghost" buttons (visible on row hover) for:
    -   **Open**: Jump to the exact heading in the editor.
    -   **Copy Link**: Copy the `[[File#Heading]]` link to the clipboard.
4.  **Visual Verification**: Capture a screenshot of the interface demonstrating these functional enhancements and save it to `/tests/interface_images/immediate-functional-gains.png`.

## Success Criteria
- User never loses file context while scrolling.
- Full hierarchy is discoverable via breadcrumbs.
- Common actions (Open, Copy) are accessible with a single click.
- A visual verification image is generated.
