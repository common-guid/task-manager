# Specification: Reimagining the Hierarchy

## Goal
Transform the current rigid 7-column TaskTable into a flexible, grouped, and visually indented view that provides better context and less empty space.

## Requirements
1.  **Grouping by File**: Rows should be grouped by their source file. The file name should appear once as a header for each group.
2.  **Single Content Column**: Instead of H1-H6 columns, use a single "Content" or "Heading" column.
3.  **Visual Indentation**: Headings should be indented based on their level (H1 = 0px, H2 = 20px, H3 = 40px, etc.).
4.  **Styling**: Use font weight and size to further distinguish heading levels.
5.  **Visual Verification**: Capture a screenshot of the new UI using the sandbox scripts and save it to `/tests/interface_images/reimagine-hierarchy.png`.

## Success Criteria
- Table is no longer 7 columns wide.
- File names are not repeated on every row.
- Hierarchy is clear through indentation and styling.
- A visual verification image is generated.
