# Specification: Modernizing Tags and Metadata

## Goal
Enhance the visual appeal and functional clarity of tags and metadata within the TaskTable, moving away from simple boxes to a polished, color-coded, and icon-enhanced system.

## Requirements
1.  **Pill Styling**: Tags should be rendered as rounded pills with appropriate padding and subtle borders/backgrounds.
2.  **Color Coding**: Implement a system to assign colors to tags (e.g., based on hash value or specific keywords like `dev`, `fix`, `high-priority`).
3.  **Metadata Badges**: Identify specific metadata patterns (like dates or priorities) and render them with descriptive icons (Lucide icons like `calendar`, `flag`, etc.).
4.  **Obsidian Integration**: Ensure styling respects Obsidian's CSS variables for theme compatibility.
5.  **Visual Verification**: Capture a screenshot of the new UI using the sandbox scripts and save it to `/tests/interface_images/modernize-tags-metadata.png`.

## Success Criteria
- Tags are visually distinct from regular text and other metadata.
- Tag colors are consistent and aid in quick identification.
- Metadata (dates, priorities) is enhanced with relevant icons.
- A visual verification image is generated.
