import type { ConfigField, ConfigValues, GeneratedProblem, GeneratorSpec } from '@/types';

// max is exclusive, min is inclusive
export function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function num(config: ConfigValues, key: string): number {
    const value = config[key];
    return typeof value === 'number' ? value : 0;
}

// Every arithmetic generator is tuned by an inclusive integer range; the
// difficulties below just move that range around.
const range: ConfigField[] = [
    { kind: 'number', key: 'low', label: 'Minimum', min: 0, max: 500, default: 5 },
    { kind: 'number', key: 'high', label: 'Maximum', min: 1, max: 1000, default: 50 },
];

function difficulty(id: string, name: string, style: string, low: number, high: number) {
    return { id, name, style, values: { low, high } };
}

export const additionSpec: GeneratorSpec = {
    id: 'addition',
    name: 'Addition',
    description: 'Find the sum of two integers.',
    fields: range,
    difficulties: [
        difficulty('easy', 'Easy', 'is-success', 7, 50),
        difficulty('medium', 'Medium', 'is-warning', 30, 100),
        difficulty('hard', 'Hard', 'is-danger', 50, 200),
    ],
    generate: (config) => {
        const a = getRandomInt(num(config, 'low'), num(config, 'high'));
        const b = getRandomInt(num(config, 'low'), num(config, 'high'));
        return { text: `${a} + ${b}`, answer: a + b };
    },
};

export const subtractionSpec: GeneratorSpec = {
    id: 'subtraction',
    name: 'Subtraction',
    description: 'Evaluate the difference between two integers.',
    fields: range,
    difficulties: [
        difficulty('easy', 'Easy', 'is-success', 7, 50),
        difficulty('medium', 'Medium', 'is-warning', 20, 80),
        difficulty('hard', 'Hard', 'is-danger', 40, 110),
    ],
    generate: (config) => {
        const a = getRandomInt(num(config, 'low'), num(config, 'high'));
        const b = getRandomInt(num(config, 'low'), num(config, 'high'));
        // Mix in negative-first forms so the answer is not always positive
        if (Math.random() > 0.5) {
            return { text: `${a} - ${b}`, answer: a - b };
        }
        return { text: `-${a} + ${b}`, answer: -a + b };
    },
};

export const multiplicationSpec: GeneratorSpec = {
    id: 'multiplication',
    name: 'Multiplication',
    description: 'Evaluate the product of two integers.',
    fields: range,
    difficulties: [
        difficulty('easy', 'Easy', 'is-success', 5, 35),
        difficulty('medium', 'Medium', 'is-warning', 8, 50),
        difficulty('hard', 'Hard', 'is-danger', 15, 95),
    ],
    generate: (config) => {
        const a = getRandomInt(num(config, 'low'), num(config, 'high'));
        const b = getRandomInt(num(config, 'low'), num(config, 'high'));
        return { text: `${a} \\times ${b}`, answer: a * b };
    },
};

export const divisionSpec: GeneratorSpec = {
    id: 'division',
    name: 'Division',
    description: 'Divide one integer by another to get a third integer.',
    fields: range,
    difficulties: [
        difficulty('easy', 'Easy', 'is-success', 5, 35),
        difficulty('medium', 'Medium', 'is-warning', 8, 50),
        difficulty('hard', 'Hard', 'is-danger', 15, 95),
    ],
    generate: (config) => {
        const a = getRandomInt(num(config, 'low'), num(config, 'high'));
        const b = getRandomInt(num(config, 'low'), num(config, 'high'));
        // Build the dividend from the answer so the result is always an integer
        return { text: `${a * b} \\div ${b}`, answer: a };
    },
};

export const squareRootSpec: GeneratorSpec = {
    id: 'square_root',
    name: 'Square Root',
    description: 'Find the square root of a given integer.',
    fields: range,
    difficulties: [
        difficulty('easy', 'Easy', 'is-success', 4, 20),
        difficulty('medium', 'Medium', 'is-warning', 13, 30),
        difficulty('hard', 'Hard', 'is-danger', 19, 60),
    ],
    generate: (config) => {
        const a = getRandomInt(num(config, 'low'), num(config, 'high'));
        return { text: `\\sqrt{${a * a}}`, answer: a };
    },
};

export const generators: GeneratorSpec[] = [
    additionSpec,
    subtractionSpec,
    multiplicationSpec,
    divisionSpec,
    squareRootSpec,
];

// Re-export the type so callers can keep importing problem shapes from here.
export type { GeneratedProblem };
