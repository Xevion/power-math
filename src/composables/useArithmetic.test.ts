import { describe, expect, it } from 'vitest';
import {
    addition,
    division,
    getRandomInt,
    multiplication,
    squareRoot,
    subtraction,
} from './useArithmetic';

const opts = { low: 5, high: 50 };

describe('getRandomInt', () => {
    it('stays within [min, max) and returns integers', () => {
        for (let i = 0; i < 1000; i++) {
            const n = getRandomInt(3, 7);
            expect(n).toBeGreaterThanOrEqual(3);
            expect(n).toBeLessThan(7);
            expect(Number.isInteger(n)).toBe(true);
        }
    });
});

describe('arithmetic generators', () => {
    it('addition: answer is the sum shown in the text', () => {
        for (let i = 0; i < 200; i++) {
            const { text, answer } = addition(opts);
            const [a, b] = text.split(' + ').map(Number);
            expect(answer).toBe(a + b);
        }
    });

    it('subtraction: answer matches the rendered expression', () => {
        for (let i = 0; i < 200; i++) {
            const { text, answer } = subtraction(opts);
            if (text.includes(' - ')) {
                const [a, b] = text.split(' - ').map(Number);
                expect(answer).toBe(a - b);
            } else {
                const [a, b] = text.replace('-', '').split(' + ').map(Number);
                expect(answer).toBe(-a + b);
            }
        }
    });

    it('multiplication: answer is the product', () => {
        for (let i = 0; i < 200; i++) {
            const { text, answer } = multiplication(opts);
            const [a, b] = text.split(' \\times ').map(Number);
            expect(answer).toBe(a * b);
        }
    });

    it('division: result is an exact integer quotient', () => {
        for (let i = 0; i < 200; i++) {
            const { text, answer } = division(opts);
            const [dividend, divisor] = text.split(' \\div ').map(Number);
            expect(dividend / divisor).toBe(answer);
            expect(Number.isInteger(answer)).toBe(true);
        }
    });

    it('square root: answer squared is the radicand', () => {
        for (let i = 0; i < 200; i++) {
            const { text, answer } = squareRoot(opts);
            const radicand = Number(text.replace('\\sqrt{', '').replace('}', ''));
            expect(answer * answer).toBe(radicand);
        }
    });
});
