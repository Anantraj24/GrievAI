import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../services/storage';

describe('storage manager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns the default and persists it when the key is missing', () => {
    expect(storage.get('missing', 'fallback')).toBe('fallback');
    expect(localStorage.getItem('missing')).toBe('"fallback"');
  });

  it('round-trips objects through JSON', () => {
    storage.set('obj', { a: 1 });
    expect(storage.get('obj', null)).toEqual({ a: 1 });
  });

  it('round-trips primitives', () => {
    storage.set('s', 'hello');
    expect(storage.get('s', '')).toBe('hello');
    storage.set('n', 42);
    expect(storage.get('n', 0)).toBe(42);
  });

  it('removes keys', () => {
    storage.set('gone', 1);
    storage.remove('gone');
    expect(storage.get('gone', null)).toBeNull();
  });

  it('notifies subscribers on set', () => {
    const seen: Array<[string, unknown]> = [];
    const unsubscribe = storage.subscribe((key, value) => seen.push([key, value]));
    storage.set('n', { x: true });
    expect(seen).toEqual([['n', { x: true }]]);
    unsubscribe();
  });
});