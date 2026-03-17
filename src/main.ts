import { Plugin, BasesView } from 'obsidian';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { mapHeadingsToTasks } from './mapper';
import { HeadingTask } from './types';
import { TaskTable } from './components/TaskTable';

export const ExampleViewType = 'task-table';

export default class TaskManagerPlugin extends Plugin {
  async onload() {
    console.log('Task Manager Plugin loading...');

    const registered = this.registerBasesView(ExampleViewType, {
      name: 'Task Table',
      icon: 'lucide-table',
      factory: (controller, containerEl) => {
        return new TaskBasesView(controller, containerEl);
      },
    });

    if (!registered) {
      console.warn('Task Manager: registerBasesView returned false — Bases may not be enabled in this vault.');
      return;
    }

    console.log('Task Table view registered successfully.');

    // Obsidian's deferred-view system can render the active .base tab before
    // a community plugin's onload completes (startup race condition).  After
    // the workspace layout is fully ready, force every open Bases leaf to
    // re-apply its state so that it picks up the now-registered view type.
    this.app.workspace.onLayoutReady(() => {
      this.app.workspace.getLeavesOfType('bases').forEach((leaf: any) => {
        leaf.setViewState(leaf.getViewState());
      });
    });
  }
}

export class TaskBasesView extends BasesView {
  readonly type = ExampleViewType;
  private containerEl: HTMLElement;
  private root: Root | null = null;

  constructor(controller: any, parentEl: HTMLElement) {
    super(controller);
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

    this.root.render(
      React.createElement(TaskTable, { 
        tasks: flattenedTasks,
        onOpenLink: handleOpenLink
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
