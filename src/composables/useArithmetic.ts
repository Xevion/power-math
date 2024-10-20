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

function bool(config: ConfigValues, key: string): boolean {
    return config[key] === true;
}

// Draw `count` operands in [low, high), optionally negating some of them
function drawTerms(count: number, low: number, high: number, allowNegative: boolean): number[] {
    const terms: number[] = [];
    for (let i = 0; i < count; i++) {
        let term = getRandomInt(low, high);
        if (allowNegative && Math.random() < 0.5) term = -term;
        terms.push(term);
    }
    return terms;
}

// Render a + b - c, folding negative terms into a subtraction sign
function renderAdditive(terms: number[]): string {
    return terms
        .map((term, index) => {
            if (index === 0) return `${term}`;
            return term < 0 ? `- ${-term}` : `+ ${term}`;
        })
        .join(' ');
}

const low: ConfigField = {
    kind: 'number',
    key: 'low',
    label: 'Minimum',
    min: 0,
    max: 500,
    default: 5,
};
const high: ConfigField = {
    kind: 'number',
    key: 'high',
    label: 'Maximum',
    min: 1,
    max: 1000,
    default: 50,
};

function operandCount(max: number): ConfigField {
    return { kind: 'number', key: 'operandCount', label: 'Operands', min: 2, max, default: 2 };
}

function difficulty(id: string, name: string, style: string, lo: number, hi: number) {
    return { id, name, style, values: { low: lo, high: hi } };
}

export const additionSpec: GeneratorSpec = {
    id: 'addition',
    name: 'Addition',
    description: 'Find the sum of two or more integers.',
    fields: [
        low,
        high,
        operandCount(4),
        { kind: 'boolean', key: 'allowNegative', label: 'Allow negatives', default: false },
    ],
    difficulties: [
        difficulty('easy', 'Easy', 'is-success', 7, 50),
        difficulty('medium', 'Medium', 'is-warning', 30, 100),
        difficulty('hard', 'Hard', 'is-danger', 50, 200),
    ],
    generate: (config) => {
        const terms = drawTerms(
            num(config, 'operandCount'),
            num(config, 'low'),
            num(config, 'high'),
            bool(config, 'allowNegative'),
        );
        const answer = terms.reduce((sum, term) => sum + term, 0);
        return { text: renderAdditive(terms), answer };
    },
};

export const subtractionSpec: GeneratorSpec = {
    id: 'subtraction',
    name: 'Subtraction',
    description: 'Evaluate the difference between two integers.',
    fields: [
        low,
        high,
        { kind: 'boolean', key: 'allowNegative', label: 'Allow negatives', default: true },
    ],
    difficulties: [
        difficulty('easy', 'Easy', 'is-success', 7, 50),
        difficulty('medium', 'Medium', 'is-warning', 20, 80),
        difficulty('hard', 'Hard', 'is-danger', 40, 110),
    ],
    generate: (config) => {
        let a = getRandomInt(num(config, 'low'), num(config, 'high'));
        let b = getRandomInt(num(config, 'low'), num(config, 'high'));
        // Keep the answer non-negative unless negatives are allowed
        if (!bool(config, 'allowNegative') && b > a) {
            [a, b] = [b, a];
        }
        return { text: `${a} - ${b}`, answer: a - b };
    },
};

export const multiplicationSpec: GeneratorSpec = {
    id: 'multiplication',
    name: 'Multiplication',
    description: 'Evaluate the product of two or more integers.',
    fields: [low, high, operandCount(3)],
    difficulties: [
        difficulty('easy', 'Easy', 'is-success', 5, 35),
        difficulty('medium', 'Medium', 'is-warning', 8, 50),
        difficulty('hard', 'Hard', 'is-danger', 15, 95),
    ],
    generate: (config) => {
        const factors = drawTerms(
            num(config, 'operandCount'),
            num(config, 'low'),
            num(config, 'high'),
            false,
        );
        const answer = factors.reduce((product, factor) => product * factor, 1);
        return { text: factors.join(' \\times '), answer };
    },
};

export const divisionSpec: GeneratorSpec = {
    id: 'division',
    name: 'Division',
    description: 'Divide one integer by another to get a third integer.',
    fields: [low, high],
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
    fields: [low, high],
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
