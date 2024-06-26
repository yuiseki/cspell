import { describe, expect, test, vi } from 'vitest';

import { AutoResolveLastNCalls, AutoResolveLRUCache } from './AutoResolveLRUCache.js';
import { isRecordEqual } from './util.js';

describe('AutoResolveLRUCache', () => {
    test('AutoResolveLRUCache', () => {
        const ar = new AutoResolveLRUCache<Record<string, unknown>, string[]>(3, isRecordEqual);
        const fn = vi.fn((obj: Record<string, unknown>) => Object.keys(obj));
        AutoResolveLRUCache.assertValid(ar);
        expect(ar.get({})).toBe(undefined);
        expect(ar.get({}, fn)).toEqual([]);
        expect(ar.get({ name: 'test' }, fn)).toEqual(['name']);
        expect(ar.stats()).toEqual({ hits: 0, misses: 3, size: 2, added: 2, removed: 0 });
        expect(ar.get({ name: 'test' }, fn)).toEqual(['name']);
        AutoResolveLRUCache.assertValid(ar);
        expect(ar.stats()).toEqual({ hits: 1, misses: 3, size: 2, added: 2, removed: 0 });
        expect(ar.get({ name: 'test', address: 'adr' }, fn)).toEqual(['name', 'address']);
        expect(ar.get({ address: 'adr', name: 'test' }, fn)).toEqual(['name', 'address']);
        expect(ar.stats()).toEqual({ hits: 2, misses: 4, size: 3, added: 3, removed: 0 });
        expect(ar.get({ address: 'adr' }, fn)).toEqual(['address']);
        expect(ar.stats()).toEqual({ hits: 2, misses: 5, size: 3, added: 4, removed: 1 });
    });

    test('AutoResolveLastNCalls', () => {
        const ar = new AutoResolveLastNCalls<[string], number>(3);
        const fn = vi.fn(([s]: [string]) => s.length);
        expect(ar.get([''])).toBe(undefined);
        AutoResolveLRUCache.assertValid(ar);
        expect(ar.stats()).toEqual({ hits: 0, misses: 1, size: 0, added: 0, removed: 0 });
        expect(ar.get([''], fn)).toBe(0);
        expect(ar.stats()).toEqual({ hits: 0, misses: 2, size: 1, added: 1, removed: 0 });
        expect(fn).toHaveBeenCalledTimes(1);
        expect(ar.get([''], fn)).toBe(0);
        expect(ar.get([''], fn)).toBe(0);
        expect(ar.get([''], fn)).toBe(0);
        expect(ar.stats()).toEqual({ hits: 3, misses: 2, size: 1, added: 1, removed: 0 });
        expect(fn).toHaveBeenCalledTimes(1);
        expect(ar.get(['a'], fn)).toBe(1);
        expect(ar.stats()).toEqual({ hits: 3, misses: 3, size: 2, added: 2, removed: 0 });
        expect(fn).toHaveBeenCalledTimes(2);
        expect(ar.get(['a'], fn)).toBe(1);
        expect(ar.stats()).toEqual({ hits: 4, misses: 3, size: 2, added: 2, removed: 0 });
        expect(fn).toHaveBeenCalledTimes(2);
        expect(ar.get([''], fn)).toBe(0);
        AutoResolveLRUCache.assertValid(ar);
        expect(ar.stats()).toEqual({ hits: 5, misses: 3, size: 2, added: 2, removed: 0 });
        expect(fn).toHaveBeenCalledTimes(2);
        expect(ar.get(['bb'], fn)).toBe(2);
        expect(ar.stats()).toEqual({ hits: 5, misses: 4, size: 3, added: 3, removed: 0 });
        expect(fn).toHaveBeenCalledTimes(3);
        expect(ar.get([''], fn)).toBe(0);
        expect(ar.stats()).toEqual({ hits: 6, misses: 4, size: 3, added: 3, removed: 0 });
        expect(fn).toHaveBeenCalledTimes(3);
        expect(ar.get(['ccc'], fn)).toBe(3);
        expect(ar.stats()).toEqual({ hits: 6, misses: 5, size: 3, added: 4, removed: 1 });
        expect(fn).toHaveBeenCalledTimes(4);
        expect(ar.get(['a'], fn)).toBe(1);
        expect(ar.stats()).toEqual({ hits: 6, misses: 6, size: 3, added: 5, removed: 2 });
        expect(fn).toHaveBeenCalledTimes(5);
        expect(ar.get(['a'], fn)).toBe(1);
        expect(ar.stats()).toEqual({ hits: 7, misses: 6, size: 3, added: 5, removed: 2 });
        expect(fn).toHaveBeenCalledTimes(5);
        expect(ar.get(['ccc'], fn)).toBe(3);
        AutoResolveLRUCache.assertValid(ar);
        expect(ar.stats()).toEqual({ hits: 8, misses: 6, size: 3, added: 5, removed: 2 });
        expect(fn).toHaveBeenCalledTimes(5);
        expect(ar.get(['bb'], fn)).toBe(2);
        expect(ar.stats()).toEqual({ hits: 8, misses: 7, size: 3, added: 6, removed: 3 });
        expect(fn).toHaveBeenCalledTimes(6);
        expect(ar.get(['ccc'], fn)).toBe(3);
        expect(ar.stats()).toEqual({ hits: 9, misses: 7, size: 3, added: 6, removed: 3 });
        AutoResolveLRUCache.assertValid(ar);
        ar.clear();
        AutoResolveLRUCache.assertValid(ar);
        expect(ar.stats()).toEqual({ hits: 0, misses: 0, size: 0, added: 0, removed: 0 });
        expect(ar.get(['ccc'], fn)).toBe(3);
        expect(ar.stats()).toEqual({ hits: 0, misses: 1, size: 1, added: 1, removed: 0 });
        expect(ar.get(['ccc'], fn)).toBe(3);
        AutoResolveLRUCache.assertValid(ar);
        expect(ar.stats()).toEqual({ hits: 1, misses: 1, size: 1, added: 1, removed: 0 });
    });
});
