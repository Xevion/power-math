import { describe, expect, it } from 'vitest';
import { MAX_ANSWER_LENGTH, parseAnswer, sanitizeAnswer } from './answer';

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

describe('sanitizeAnswer', () => {
    it('keeps digits and a leading minus only', () => {
        expect(sanitizeAnswer('42')).toBe('42');
        expect(sanitizeAnswer('-42')).toBe('-42');
        expect(sanitizeAnswer('?')).toBe('');
        expect(sanitizeAnswer('4?2')).toBe('42');
        expect(sanitizeAnswer('3.9')).toBe('39');
        expect(sanitizeAnswer('1e5')).toBe('15');
        expect(sanitizeAnswer('+3')).toBe('3');
    });

    it('allows a minus sign only in the first position', () => {
        expect(sanitizeAnswer('4-2')).toBe('42');
        expect(sanitizeAnswer('--5')).toBe('-5');
        expect(sanitizeAnswer('-')).toBe('-');
    });

    it('caps the length', () => {
        expect(sanitizeAnswer('9'.repeat(40))).toHaveLength(MAX_ANSWER_LENGTH);
    });
});
