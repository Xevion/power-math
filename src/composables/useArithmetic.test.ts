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

// Fold a rendered additive expression back into a number
function evalAdditive(text: string): number {
    const tokens = text.split(' ');
    let value = Number(tokens[0]);
    for (let i = 1; i < tokens.length; i += 2) {
        const operand = Number(tokens[i + 1]);
        value += tokens[i] === '-' ? -operand : operand;
    }
    return value;
}

describe('generator options', () => {
    it('addition honors the operand count', () => {
        const config = { low: 5, high: 10, operandCount: 3, allowNegative: false };
        for (let i = 0; i < 100; i++) {
            const { text, answer } = additionSpec.generate(config);
            const terms = text.split(' + ').map(Number);
            expect(terms).toHaveLength(3);
            expect(terms.reduce((sum, term) => sum + term, 0)).toBe(answer);
        }
    });

    it('addition with negatives still renders an expression that sums to the answer', () => {
        const config = { low: 5, high: 50, operandCount: 2, allowNegative: true };
        let sawNegative = false;
        for (let i = 0; i < 300; i++) {
            const { text, answer } = additionSpec.generate(config);
            if (text.includes(' - ')) sawNegative = true;
            expect(evalAdditive(text)).toBe(answer);
        }
        expect(sawNegative).toBe(true);
    });

    it('subtraction stays non-negative when negatives are disallowed', () => {
        const config = { low: 5, high: 50, allowNegative: false };
        for (let i = 0; i < 300; i++) {
            expect(subtractionSpec.generate(config).answer).toBeGreaterThanOrEqual(0);
        }
    });

    it('subtraction can go negative when negatives are allowed', () => {
        const config = { low: 5, high: 50, allowNegative: true };
        let sawNegative = false;
        for (let i = 0; i < 300; i++) {
            if (subtractionSpec.generate(config).answer < 0) sawNegative = true;
        }
        expect(sawNegative).toBe(true);
    });

    it('multiplication honors the operand count', () => {
        const config = { low: 2, high: 9, operandCount: 3 };
        for (let i = 0; i < 100; i++) {
            const { text, answer } = multiplicationSpec.generate(config);
            const factors = text.split(' \\times ').map(Number);
            expect(factors).toHaveLength(3);
            expect(factors.reduce((product, factor) => product * factor, 1)).toBe(answer);
        }
    });
});
