import { describe, it, expect, vi } from 'vitest';

vi.mock('react-dom/client', () => ({
  createRoot: vi.fn().mockReturnValue({
    render: vi.fn()
  })
}));

import TaskManagerPlugin, { TaskBasesView, ExampleViewType } from '../src/main';
import { createRoot } from 'react-dom/client';

describe('TaskManagerPlugin', () => {
  it('should register the Bases view on load', async () => {
    const mockOnLayoutReady = vi.fn();
    const mockGetLeavesOfType = vi.fn().mockReturnValue([]);
    const mockApp = {
      workspace: {
        onLayoutReady: mockOnLayoutReady,
        getLeavesOfType: mockGetLeavesOfType,
      },
    };

    // @ts-ignore
    const plugin = new TaskManagerPlugin(mockApp as any, {} as any);
    const spy = vi.spyOn(plugin as any, 'registerBasesView').mockReturnValue(true);

    await plugin.onload();

    expect(spy).toHaveBeenCalledWith(ExampleViewType, expect.objectContaining({
      name: 'Task Table'
    }));

    // onLayoutReady should be scheduled to refresh open Bases leaves
    expect(mockOnLayoutReady).toHaveBeenCalled();

    // Simulate the layout-ready callback firing
    const layoutReadyCallback = mockOnLayoutReady.mock.calls[0][0] as () => void;
    const mockLeaf = { getViewState: vi.fn().mockReturnValue({ type: 'bases', state: {} }), setViewState: vi.fn() };
    mockGetLeavesOfType.mockReturnValue([mockLeaf]);
    layoutReadyCallback();
    expect(mockLeaf.setViewState).toHaveBeenCalledWith(mockLeaf.getViewState());

    // Test the factory
    const factory = (spy.mock.calls[0][1] as any).factory;
    const view = factory({}, document.createElement('div'));
    expect(view).toBeInstanceOf(TaskBasesView);
  });

  it('should warn and return early if Bases is not enabled', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    // @ts-ignore
    const plugin = new TaskManagerPlugin({} as any, {} as any);
    vi.spyOn(plugin as any, 'registerBasesView').mockReturnValue(false);

    await plugin.onload();

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Bases may not be enabled'));
    consoleSpy.mockRestore();
  });
});

describe('TaskBasesView', () => {
  const controller = {} as any;
  const parentEl = {
    createDiv: vi.fn().mockReturnValue({
      empty: vi.fn(),
      createDiv: vi.fn()
    })
  } as any;
  const mockPlugin = {
    settings: {
      levelColors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
    }
  } as any;

  it('should be a class extending BasesView', () => {
    const view = new TaskBasesView(controller, parentEl, mockPlugin);
    expect(view.type).toBe(ExampleViewType);
  });

  it('should flatten Bases data into heading-based tasks', async () => {
    const view = new TaskBasesView(controller, parentEl, mockPlugin);
    
    // Mock Obsidian app with metadata cache
    (view as any).app = {
      metadataCache: {
        getFileCache: vi.fn().mockReturnValue({
          headings: [
            { heading: 'Task 1', level: 1, position: { start: { line: 0 } } },
            { heading: 'Task 2', level: 2, position: { start: { line: 5 } } },
          ],
          tags: []
        })
      },
      vault: {
        cachedRead: vi.fn().mockResolvedValue('test content')
      }
    };

    // Mock Bases data
    (view as any).data = {
      groupedData: [
        {
          entries: [
            { file: { name: 'test.md', path: 'test.md' } }
          ]
        }
      ]
    };

    // This is where we'll test the flattening logic. 
    const spy = vi.spyOn(view as any, 'flattenData');
    await view.onDataUpdated();
    
    expect(spy).toHaveBeenCalled();
    const result = await spy.mock.results[0].value;
    expect(result).toHaveLength(2);
    expect(result[0].h1.text).toBe('Task 1');
    expect(result[1].h2.text).toBe('Task 2');
  });

  it('should return empty array if data is missing', async () => {
    const view = new TaskBasesView(controller, parentEl, mockPlugin);
    (view as any).data = null;
    expect(await (view as any).flattenData()).toEqual([]);
  });

  it('should skip files with no metadata cache', async () => {
    const view = new TaskBasesView(controller, parentEl, mockPlugin);
    (view as any).app = {
      metadataCache: {
        getFileCache: vi.fn().mockReturnValue(null)
      }
    };
    (view as any).data = {
      groupedData: [{ entries: [{ file: { name: 'test.md' } }] }]
    };
    expect(await (view as any).flattenData()).toEqual([]);
  });
});
