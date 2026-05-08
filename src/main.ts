import { Plugin, BasesView, Menu, ColorComponent, Modal } from 'obsidian';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { mapHeadingsToTasks } from './mapper';
import { HeadingTask, TaskManagerSettings, DEFAULT_SETTINGS } from './types';
import { TaskTable } from './components/TaskTable';

export const ExampleViewType = 'task-table';

export class TaskManagerPlugin extends Plugin {
  settings: TaskManagerSettings;

  async onload() {
    console.log('Task Manager Plugin loading...');

    await this.loadSettings();

    const registered = this.registerBasesView(ExampleViewType, {
      name: 'Task Table',
      icon: 'lucide-table',
      factory: (controller, containerEl) => {
        return new TaskBasesView(controller, containerEl, this);
      },
    });

    if (!registered) {
      console.warn('Task Manager: registerBasesView returned false — Bases may not be enabled in this vault.');
      return;
    }

    console.log('Task Table view registered successfully.');

    this.app.workspace.onLayoutReady(() => {
      this.app.workspace.getLeavesOfType('bases').forEach((leaf: any) => {
        leaf.setViewState(leaf.getViewState());
      });
    });
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
    // Refresh views after settings change
    this.app.workspace.getLeavesOfType('bases').forEach((leaf: any) => {
      if (leaf.view && leaf.view.type === ExampleViewType && typeof (leaf.view as any).onDataUpdated === 'function') {
        (leaf.view as any).onDataUpdated();
      }
    });
  }
}

// Ensure Obsidian can load the plugin (Obsidian expects a default export)
// We follow the Law by using named exports primarily, but provide this for platform compatibility.
export default TaskManagerPlugin;

class TagColorModal extends Modal {
  tag: string;
  plugin: TaskManagerPlugin;

  constructor(app: any, plugin: TaskManagerPlugin, tag: string) {
    super(app);
    this.plugin = plugin;
    this.tag = tag;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('h2', { text: `Select color for #${this.tag}` });

    const colorPicker = new ColorComponent(contentEl)
      .setValue(this.plugin.settings.tagColors[this.tag] || '#000000')
      .onChange(async (value) => {
        this.plugin.settings.tagColors[this.tag] = value;
        await this.plugin.saveSettings();
      });
    
    colorPicker.addColorPicker();
    
    contentEl.createEl('br');
    const saveBtn = contentEl.createEl('button', { text: 'Save' });
    saveBtn.onclick = async () => {
      await this.plugin.saveSettings();
      this.close();
    };
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

export class TaskBasesView extends BasesView {
  readonly type = ExampleViewType;
  private containerEl: HTMLElement;
  private root: Root | null = null;
  private plugin: TaskManagerPlugin;

  constructor(controller: any, parentEl: HTMLElement, plugin: TaskManagerPlugin) {
    super(controller);
    this.plugin = plugin;
    this.containerEl = parentEl.createDiv('task-manager-view-container');
  }

  onDataUpdated(): void {
    const flattenedTasks = this.flattenData();
    
    if (!this.root) {
      this.root = createRoot(this.containerEl);
    }

    const handleOpenLink = (file: string, heading: string) => {
      const { app } = this;
      const path = file + (heading ? '#' + heading : '');
      void app.workspace.openLinkText(path, '', false);
    };

    const handleTagContextMenu = (tag: string, event: React.MouseEvent) => {
      const menu = new Menu();
      
      menu.addItem((item) =>
        item
          .setTitle('Tag Color')
          .setIcon('palette')
          .onClick(() => {
            new TagColorModal(this.app, this.plugin, tag).open();
          })
      );

      menu.showAtMouseEvent(event.nativeEvent);
    };

    this.root.render(
      React.createElement(TaskTable, { 
        tasks: flattenedTasks,
        onOpenLink: handleOpenLink,
        onTagContextMenu: handleTagContextMenu,
        tagColors: { ...this.plugin.settings.tagColors }
      })
    );
  }

  protected flattenData(): HeadingTask[] {
    const allTasks: HeadingTask[] = [];
    const { app, data } = this;

    if (!data || !data.groupedData) return [];

    for (const group of data.groupedData) {
      for (const entry of group.entries) {
        const file = entry.file;
        const cache = app.metadataCache.getFileCache(file);
        if (cache && cache.headings) {
          const fileTasks = mapHeadingsToTasks(file.name, cache.headings, cache.tags || []);
          allTasks.push(...fileTasks);
        }
      }
    }

    return allTasks;
  }
}
