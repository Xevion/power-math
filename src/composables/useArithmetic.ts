import type { ProblemGenerator } from '@/types';

// max is exclusive, min is inclusive
export function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

export const addition: ProblemGenerator = ({ low, high }) => {
    const a = getRandomInt(low, high);
    const b = getRandomInt(low, high);
    return { text: `${a} + ${b}`, answer: a + b };
};

export const subtraction: ProblemGenerator = ({ low, high }) => {
    const a = getRandomInt(low, high);
    const b = getRandomInt(low, high);
    // Mix in negative-first forms so the answer is not always positive
    if (Math.random() > 0.5) {
        return { text: `${a} - ${b}`, answer: a - b };
    }
    return { text: `-${a} + ${b}`, answer: -a + b };
};

export const multiplication: ProblemGenerator = ({ low, high }) => {
    const a = getRandomInt(low, high);
    const b = getRandomInt(low, high);
    return { text: `${a} \\times ${b}`, answer: a * b };
};

export const division: ProblemGenerator = ({ low, high }) => {
    const a = getRandomInt(low, high);
    const b = getRandomInt(low, high);
    // Build the dividend from the answer so the result is always an integer
    return { text: `${a * b} \\div ${b}`, answer: a };
};

export const squareRoot: ProblemGenerator = ({ low, high }) => {
    const a = getRandomInt(low, high);
    return { text: `\\sqrt{${a * a}}`, answer: a };
};
