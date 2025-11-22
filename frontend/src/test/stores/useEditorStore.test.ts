import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEditorStore } from '../stores/useEditorStore';
import type { ProjectFile } from '@ai-dev-platform/shared';

describe('useEditorStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useEditorStore());
    act(() => {
      result.current.setFiles([]);
    });
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useEditorStore());

    expect(result.current.files).toEqual([]);
    expect(result.current.activeFileId).toBeNull();
    expect(result.current.code).toBe('');
    expect(result.current.language).toBe('typescript');
  });

  it('should set files', () => {
    const { result } = renderHook(() => useEditorStore());

    const files: ProjectFile[] = [
      {
        id: '1',
        name: 'test.ts',
        path: '/test.ts',
        type: 'file',
        content: 'console.log("test");',
        language: 'typescript',
      },
    ];

    act(() => {
      result.current.setFiles(files);
    });

    expect(result.current.files).toEqual(files);
    expect(result.current.activeFileId).toBe('1');
    expect(result.current.code).toBe('console.log("test");');
  });

  it('should update code', () => {
    const { result } = renderHook(() => useEditorStore());

    const files: ProjectFile[] = [
      {
        id: '1',
        name: 'test.ts',
        path: '/test.ts',
        type: 'file',
        content: 'old code',
        language: 'typescript',
      },
    ];

    act(() => {
      result.current.setFiles(files);
      result.current.updateCode('new code');
    });

    expect(result.current.code).toBe('new code');
    expect(result.current.files[0].content).toBe('new code');
  });

  it('should set active file', () => {
    const { result } = renderHook(() => useEditorStore());

    const files: ProjectFile[] = [
      {
        id: '1',
        name: 'test1.ts',
        path: '/test1.ts',
        type: 'file',
        content: 'code 1',
        language: 'typescript',
      },
      {
        id: '2',
        name: 'test2.js',
        path: '/test2.js',
        type: 'file',
        content: 'code 2',
        language: 'javascript',
      },
    ];

    act(() => {
      result.current.setFiles(files);
      result.current.setActiveFile('2');
    });

    expect(result.current.activeFileId).toBe('2');
    expect(result.current.code).toBe('code 2');
    expect(result.current.language).toBe('javascript');
  });
});
