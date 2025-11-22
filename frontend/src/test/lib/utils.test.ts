import { describe, it, expect } from 'vitest';
import { cn, getLanguageFromFileName, formatTimestamp } from '../lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('should handle conditional classes', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
    });

    it('should merge tailwind classes', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    });
  });

  describe('getLanguageFromFileName', () => {
    it('should detect typescript', () => {
      expect(getLanguageFromFileName('test.ts')).toBe('typescript');
      expect(getLanguageFromFileName('test.tsx')).toBe('typescript');
    });

    it('should detect javascript', () => {
      expect(getLanguageFromFileName('test.js')).toBe('javascript');
      expect(getLanguageFromFileName('test.jsx')).toBe('javascript');
    });

    it('should detect other languages', () => {
      expect(getLanguageFromFileName('test.py')).toBe('python');
      expect(getLanguageFromFileName('test.html')).toBe('html');
      expect(getLanguageFromFileName('test.css')).toBe('css');
    });

    it('should return plaintext for unknown extensions', () => {
      expect(getLanguageFromFileName('test.xyz')).toBe('plaintext');
    });
  });

  describe('formatTimestamp', () => {
    it('should format recent timestamps', () => {
      const now = Date.now();
      expect(formatTimestamp(now)).toBe('just now');
      expect(formatTimestamp(now - 30000)).toBe('just now');
    });

    it('should format minutes ago', () => {
      const now = Date.now();
      expect(formatTimestamp(now - 60000)).toBe('1m ago');
      expect(formatTimestamp(now - 120000)).toBe('2m ago');
    });

    it('should format hours ago', () => {
      const now = Date.now();
      expect(formatTimestamp(now - 3600000)).toBe('1h ago');
    });

    it('should format days ago', () => {
      const now = Date.now();
      expect(formatTimestamp(now - 86400000)).toBe('1d ago');
    });
  });
});
