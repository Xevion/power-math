import { describe, expect, it } from 'vitest';
import {
    additionSpec,
    divisionSpec,
    getRandomInt,
    multiplicationSpec,
    squareRootSpec,
    subtractionSpec,
} from './useArithmetic';
import { defaultValues } from '@/types';
import type { GeneratorSpec } from '@/types';

// Field defaults with an easy-ish range, the shape the app always passes
function cfg(spec: GeneratorSpec) {
    return { ...defaultValues(spec), low: 5, high: 50 };
}

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
            const { text, answer } = additionSpec.generate(cfg(additionSpec));
            const [a, b] = text.split(' + ').map(Number);
            expect(answer).toBe(a + b);
        }
    });

    it('subtraction: answer is the difference shown in the text', () => {
        for (let i = 0; i < 200; i++) {
            const { text, answer } = subtractionSpec.generate(cfg(subtractionSpec));
            const [a, b] = text.split(' - ').map(Number);
            expect(answer).toBe(a - b);
        }
    });

    it('multiplication: answer is the product', () => {
        for (let i = 0; i < 200; i++) {
            const { text, answer } = multiplicationSpec.generate(cfg(multiplicationSpec));
            const [a, b] = text.split(' \\times ').map(Number);
            expect(answer).toBe(a * b);
        }
    });

    it('division: result is an exact integer quotient', () => {
        for (let i = 0; i < 200; i++) {
            const { text, answer } = divisionSpec.generate(cfg(divisionSpec));
            const [dividend, divisor] = text.split(' \\div ').map(Number);
            expect(dividend / divisor).toBe(answer);
            expect(Number.isInteger(answer)).toBe(true);
        }
    });

    it('square root: answer squared is the radicand', () => {
        for (let i = 0; i < 200; i++) {
            const { text, answer } = squareRootSpec.generate(cfg(squareRootSpec));
            const radicand = Number(text.replace('\\sqrt{', '').replace('}', ''));
            expect(answer * answer).toBe(radicand);
        }
    });
});
