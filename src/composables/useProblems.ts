import { computed, reactive } from 'vue';
import { generators } from '@/composables/useArithmetic';
import { valuesForDifficulty } from '@/types';
import type { GeneratedProblem, GeneratorState } from '@/types';

function initialState(): GeneratorState[] {
    return generators.map((spec) => {
        const difficultyId = spec.difficulties[0].id;
        return {
            spec,
            enabled: true,
            weight: 1,
            difficultyId,
            values: valuesForDifficulty(spec, difficultyId),
        };
    });
}

export function useProblems() {
    const problems = reactive<GeneratorState[]>(initialState());

    // A generator is only drawable when it is on and carries some weight
    const availableProblems = computed(() =>
        problems.filter((problem) => problem.enabled && problem.weight > 0),
    );

    let previousProblem: GeneratedProblem | null = null;

    // Pick a generator in proportion to its weight (the distribution control)
    function pickGenerator(): GeneratorState | null {
        const pool = availableProblems.value;
        if (pool.length === 0) return null;

        const total = pool.reduce((sum, problem) => sum + problem.weight, 0);
        let roll = Math.random() * total;
        for (const problem of pool) {
            roll -= problem.weight;
            if (roll < 0) return problem;
        }
        return pool[pool.length - 1];
    }

    function getProblem(): GeneratedProblem {
        const chosen = pickGenerator();
        if (chosen == null) {
            return { text: '\\text{No problem types enabled}', answer: NaN };
        }

        let problem = chosen.spec.generate(chosen.values);

        // Retry a few times to avoid repeating the exact same problem back to back
        for (let i = 0; i < 5; i++) {
            if (previousProblem == null || problem.text !== previousProblem.text) break;
            problem = chosen.spec.generate(chosen.values);
        }

        previousProblem = problem;
        return problem;
    }

    // Apply a difficulty preset, which resets the generator's tunable values
    function setDifficulty(state: GeneratorState, difficultyId: string) {
        state.enabled = true;
        state.difficultyId = difficultyId;
        state.values = valuesForDifficulty(state.spec, difficultyId);
    }

    return { problems, availableProblems, getProblem, setDifficulty };
}
