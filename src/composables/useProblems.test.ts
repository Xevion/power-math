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
});
