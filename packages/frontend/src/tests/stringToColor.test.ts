import { describe, it, expect } from 'vitest';
import stringToColor from '../utils/stringToColor';

describe('stringToColor', () => {
  it('returns fallback color for null', () => {
    expect(stringToColor(null)).toBe('#888888');
  });

  it('returns fallback color for empty string', () => {
    expect(stringToColor('')).toBe('#888888');
  });

  it('returns hsl string for a valid input', () => {
    expect(stringToColor('Alice')).toMatch(/^hsl\(\d+(\.\d+)?, 65%, 35%\)$/);
  });

  it('is deterministic — same input always produces same output', () => {
    expect(stringToColor('Alice')).toBe(stringToColor('Alice'));
  });

  it('produces different colors for different inputs', () => {
    expect(stringToColor('Alice')).not.toBe(stringToColor('Bob'));
  });

  it('respects custom lightness', () => {
    expect(stringToColor('Alice', 90)).toMatch(/^hsl\(\d+(\.\d+)?, 65%, 90%\)$/);
  });

  it('default lightness is 35', () => {
    expect(stringToColor('Alice')).toContain('35%');
  });
});
