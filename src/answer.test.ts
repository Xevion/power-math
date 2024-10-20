import { describe, expect, it } from 'vitest';
import { parseAnswer } from './answer';

describe('parseAnswer', () => {
    it('parses plain and signed integers, trimming whitespace', () => {
        expect(parseAnswer('42')).toBe(42);
        expect(parseAnswer('-7')).toBe(-7);
        expect(parseAnswer('+3')).toBe(3);
        expect(parseAnswer('  15  ')).toBe(15);
        expect(parseAnswer('0')).toBe(0);
    });

    it('rejects blanks, decimals, and trailing garbage', () => {
        expect(parseAnswer('')).toBeNull();
        expect(parseAnswer('   ')).toBeNull();
        expect(parseAnswer('3.9')).toBeNull();
        expect(parseAnswer('12abc')).toBeNull();
        expect(parseAnswer('abc')).toBeNull();
        expect(parseAnswer('1 2')).toBeNull();
    });
});
