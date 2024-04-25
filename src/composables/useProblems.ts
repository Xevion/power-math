import { computed, reactive } from 'vue';
import type { GeneratedProblem, ProblemType } from '@/types';
import {
    addition,
    division,
    getRandomInt,
    multiplication,
    squareRoot,
    subtraction,
} from '@/composables/useArithmetic';

function buildProblems(): ProblemType[] {
    return [
        {
            name: 'Addition',
            id: 'addition',
            description: 'Find the sum of two integers',
            method: addition,
            enabled: true,
            current: 0,
            difficulties: [
                { id: 'easy', name: 'Easy', options: { low: 7, high: 50 }, style: 'is-success' },
                { id: 'medium', name: 'Medium', options: { low: 30, high: 100 }, style: 'is-warning' },
                { id: 'hard', name: 'Hard', options: { low: 50, high: 200 }, style: 'is-danger' },
            ],
        },
        {
            name: 'Subtraction',
            id: 'subtraction',
            description: 'Evaluate the difference between two integers.',
            method: subtraction,
            enabled: true,
            current: 0,
            difficulties: [
                { id: 'easy', name: 'Easy', options: { low: 7, high: 50 }, style: 'is-success' },
                { id: 'medium', name: 'Medium', options: { low: 20, high: 80 }, style: 'is-warning' },
                { id: 'hard', name: 'Hard', options: { low: 40, high: 110 }, style: 'is-danger' },
            ],
        },
        {
            name: 'Multiplication',
            id: 'multiplication',
            description: 'Evaluate the product of two integers.',
            method: multiplication,
            enabled: true,
            current: 0,
            difficulties: [
                { id: 'easy', name: 'Easy', options: { low: 5, high: 35 }, style: 'is-success' },
                { id: 'medium', name: 'Medium', options: { low: 8, high: 50 }, style: 'is-warning' },
                { id: 'hard', name: 'Hard', options: { low: 15, high: 95 }, style: 'is-danger' },
            ],
        },
        {
            name: 'Division',
            id: 'division',
            description: 'Divide one integer by another to get a third integer.',
            method: division,
            enabled: true,
            current: 0,
            difficulties: [
                { id: 'easy', name: 'Easy', options: { low: 5, high: 35 }, style: 'is-success' },
                { id: 'medium', name: 'Medium', options: { low: 8, high: 50 }, style: 'is-warning' },
                { id: 'hard', name: 'Hard', options: { low: 15, high: 95 }, style: 'is-danger' },
            ],
        },
        {
            name: 'Square Root',
            id: 'square_root',
            description: 'Find the square root of a given integer.',
            method: squareRoot,
            enabled: true,
            current: 0,
            difficulties: [
                { id: 'easy', name: 'Easy', options: { low: 4, high: 20 }, style: 'is-success' },
                { id: 'medium', name: 'Medium', options: { low: 13, high: 30 }, style: 'is-warning' },
                { id: 'hard', name: 'Hard', options: { low: 19, high: 60 }, style: 'is-danger' },
            ],
        },
    ];
}

export function useProblems() {
    const problems = reactive<ProblemType[]>(buildProblems());
    const availableProblems = computed(() => problems.filter((problem) => problem.enabled));

    let previousProblem: GeneratedProblem | null = null;

    function getProblem(): GeneratedProblem {
        const pool = availableProblems.value;
        if (pool.length === 0) {
            return { text: '\\text{No problem types enabled}', answer: NaN };
        }

        const problemType = pool[getRandomInt(0, pool.length)];
        let problem = problemType.method(problemType.difficulties[problemType.current].options);

        // Retry a few times to avoid repeating the exact same problem back to back
        for (let i = 0; i < 5; i++) {
            if (previousProblem == null || problem.text !== previousProblem.text) break;
            problem = problemType.method(problemType.difficulties[problemType.current].options);
        }

        previousProblem = problem;
        return problem;
    }

    return { problems, availableProblems, getProblem };
}
