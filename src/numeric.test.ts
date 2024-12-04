import { describe, expect, it } from 'vitest';
import { allowsPrefix, checkEntry, keyTarget } from './numeric';

describe('allowsPrefix', () => {
    it('refuses digits that push the value past the maximum', () => {
        expect(allowsPrefix('4', 0, 4)).toBe(true);
        expect(allowsPrefix('44', 0, 4)).toBe(false);
        expect(allowsPrefix('100', 1, 1000)).toBe(true);
        expect(allowsPrefix('1001', 1, 1000)).toBe(false);
    });

    it('allows a short entry that is still on the way into range', () => {
        expect(allowsPrefix('1', 5, 1000)).toBe(true);
        expect(allowsPrefix('4', 400, 500)).toBe(true);
        expect(allowsPrefix('1', 400, 500)).toBe(false);
        expect(allowsPrefix('6', 5, 5)).toBe(false);
    });

    it('rejects leading zeros and unsigned-range minus signs', () => {
        expect(allowsPrefix('0', 0, 10)).toBe(true);
        expect(allowsPrefix('05', 0, 10)).toBe(false);
        expect(allowsPrefix('-', 0, 10)).toBe(false);
        expect(allowsPrefix('-', -10, 10)).toBe(true);
        expect(allowsPrefix('-0', -10, 10)).toBe(false);
        expect(allowsPrefix('-11', -10, 10)).toBe(false);
    });
});

describe('checkEntry', () => {
    it('accepts in-range integers and names the bound it broke', () => {
        expect(checkEntry('7', 1, 10)).toEqual({ value: 7 });
        expect(checkEntry('0', 1, 10)).toEqual({ error: 'Minimum is 1' });
        expect(checkEntry('44', 0, 4)).toEqual({ error: 'Maximum is 4' });
        expect(checkEntry('', 0, 4)).toHaveProperty('error');
        expect(checkEntry('4x', 0, 4)).toHaveProperty('error');
    });
});

describe('keyTarget', () => {
    it('steps, takes bigger jumps, and clamps to the range', () => {
        expect(keyTarget({ key: 'ArrowUp' }, 5, 0, 10, 1)).toBe(6);
        expect(keyTarget({ key: 'ArrowLeft' }, 5, 0, 10, 1)).toBe(4);
        expect(keyTarget({ key: 'ArrowUp', shiftKey: true }, 5, 0, 100, 1)).toBe(15);
        expect(keyTarget({ key: 'PageDown' }, 5, 0, 100, 2)).toBe(0);
        expect(keyTarget({ key: 'ArrowUp' }, 10, 0, 10, 1)).toBe(10);
        expect(keyTarget({ key: 'Home' }, 5, 1, 10, 1)).toBe(1);
        expect(keyTarget({ key: 'End' }, 5, 1, 10, 1)).toBe(10);
    });

    it('ignores keys the context reserves or does not use', () => {
        const text = { horizontal: false, ends: false };
        expect(keyTarget({ key: 'ArrowLeft' }, 5, 0, 10, 1, text)).toBeNull();
        expect(keyTarget({ key: 'Home' }, 5, 0, 10, 1, text)).toBeNull();
        expect(keyTarget({ key: 'ArrowUp' }, 5, 0, 10, 1, text)).toBe(6);
        expect(keyTarget({ key: 'a' }, 5, 0, 10, 1)).toBeNull();
    });
});
