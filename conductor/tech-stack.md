# Tech Stack: Obsidian Task Manager

## Core Technology
- **Programming Language:** TypeScript (The standard and recommended language for Obsidian plugins).
- **Frontend Framework:** React (Highly compatible with Obsidian for building rich UIs).
- **Core Dependency:** Obsidian "Bases" core plugin (foundation for database-like task views).
- **API Support:** Official Obsidian API.

## Data Storage & Architecture
- **Local-First Architecture:** All task data remains within the user's local Obsidian vault.
- **Markdown-Centric:** Tasks and metadata are stored in standard Markdown, frontmatter/properties, and Dataview-style inline fields (Key:: Value).
- **Bases Syntax:** Leverage Obsidian's `.base` format and embedded code blocks for task management logic.

## Supporting Tools
- **Automation:** Potential for Python scripts for bulk task manipulation or data analysis (as per project guidelines).
- **Docker:** Support for containerized development workflows (as per project guidelines).
