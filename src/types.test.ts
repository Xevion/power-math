import { describe, expect, it } from 'vitest';
import { additionSpec } from './composables/useArithmetic';
import { defaultValues, valuesForDifficulty } from './types';

describe('defaultValues', () => {
    it('collects every field default into one value set', () => {
        expect(defaultValues(additionSpec)).toEqual({
            low: 5,
            high: 50,
            operandCount: 2,
            allowNegative: false,
        });
    });
});

describe('valuesForDifficulty', () => {
    it('layers a preset over the field defaults', () => {
        const hard = valuesForDifficulty(additionSpec, 'hard');
        expect(hard.low).toBe(50);
        expect(hard.high).toBe(200);
        // fields the preset does not touch keep their defaults
        expect(hard.operandCount).toBe(2);
        expect(hard.allowNegative).toBe(false);
    });

    it('falls back to the defaults for an unknown difficulty', () => {
        expect(valuesForDifficulty(additionSpec, 'nope')).toEqual(defaultValues(additionSpec));
    });
});
