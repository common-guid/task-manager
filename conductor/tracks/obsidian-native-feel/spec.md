# Specification: Visual Depth and Obsidian-Native Feel

## Goal
Polish the interface to feel like an integral part of Obsidian by adding visual depth, interactive feedback, and familiar UI patterns like indentation guides and native iconography.

## Requirements
1.  **Row Hover States**: Implement a subtle background highlight for rows on hover to improve eye-tracking across the table.
2.  **Indentation Guides**: Add faint vertical lines for nested headings, mirroring Obsidian's Outline and File Explorer views.
3.  **Task-Specific Iconography**: 
    -   Use checkbox icons for headings that are tasks (`- [ ]`).
    -   Differentiate between folder/file icons and task icons.
4.  **Theme Consistency**: Ensure all new visual elements use Obsidian CSS variables (e.g., `--background-modifier-hover`, `--hr-color`).
5.  **Visual Verification**: Capture a screenshot of the polished UI and save it to `/tests/interface_images/obsidian-native-feel.png`.

## Success Criteria
- The table feels more interactive due to hover states.
- Hierarchical structure is reinforced by vertical guide lines.
- Icons clearly distinguish between content types (tasks vs. headings).
- A visual verification image is generated.
