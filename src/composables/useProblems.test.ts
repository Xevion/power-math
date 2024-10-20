import { describe, expect, it } from 'vitest';
import { useProblems } from './useProblems';

describe('useProblems', () => {
    it('exposes the five problem types, all enabled by default', () => {
        const { problems, availableProblems } = useProblems();
        expect(problems).toHaveLength(5);
        expect(availableProblems.value).toHaveLength(5);
    });

    it('getProblem returns a renderable problem with a numeric answer', () => {
        const { getProblem } = useProblems();
        for (let i = 0; i < 50; i++) {
            const problem = getProblem();
            expect(typeof problem.text).toBe('string');
            expect(problem.text.length).toBeGreaterThan(0);
            expect(typeof problem.answer).toBe('number');
        }
    });

    it('availableProblems reflects the enabled flags', () => {
        const { problems, availableProblems } = useProblems();
        problems.forEach((problem) => (problem.enabled = false));
        expect(availableProblems.value).toHaveLength(0);
    });

    it('getProblem does not throw when no problem types are enabled', () => {
        const { problems, getProblem } = useProblems();
        problems.forEach((problem) => (problem.enabled = false));
        expect(() => getProblem()).not.toThrow();
    });

    it('only draws from enabled generators', () => {
        const { problems, getProblem } = useProblems();
        problems.forEach((problem) => (problem.enabled = problem.spec.id === 'square_root'));
        for (let i = 0; i < 50; i++) {
            expect(getProblem().text.startsWith('\\sqrt')).toBe(true);
        }
    });

    it('weight biases the draw toward the heavier generator', () => {
        const { problems, getProblem } = useProblems();
        for (const problem of problems) {
            problem.enabled = problem.spec.id === 'addition' || problem.spec.id === 'square_root';
            problem.weight = problem.spec.id === 'addition' ? 5 : 1;
        }

        let roots = 0;
        const draws = 600;
        for (let i = 0; i < draws; i++) {
            if (getProblem().text.startsWith('\\sqrt')) roots++;
        }
        // square root carries 1/6 of the weight, so it should stay the minority
        expect(roots).toBeLessThan(draws - roots);
    });
});
