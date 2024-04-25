export interface GeneratedProblem {
    text: string;
    answer: number;
}

export interface ProblemOptions {
    low: number;
    high: number;
}

export type ProblemGenerator = (options: ProblemOptions) => GeneratedProblem;

export interface Difficulty {
    id: string;
    name: string;
    options: ProblemOptions;
    style: string;
}

export interface ProblemType {
    name: string;
    id: string;
    description: string;
    difficulties: Difficulty[];
    method: ProblemGenerator;
    enabled: boolean;
    current: number;
}
