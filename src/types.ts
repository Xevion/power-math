export interface GeneratedProblem {
    text: string;
    answer: number;
}

// A configurable knob a generator exposes. The settings UI is rendered straight
// from these, so each field carries its own label and bounds.
export type ConfigField =
    | {
          kind: 'number';
          key: string;
          label: string;
          min: number;
          max: number;
          step?: number;
          default: number;
      }
    | {
          kind: 'boolean';
          key: string;
          label: string;
          default: boolean;
      };

// Resolved values for a generator's fields, keyed by ConfigField.key.
export type ConfigValues = Record<string, number | boolean>;

export type GenerateFn = (config: ConfigValues) => GeneratedProblem;

// A named difficulty preset: a partial set of field overrides plus a colour.
export interface DifficultyPreset {
    id: string;
    name: string;
    style: string;
    values: ConfigValues;
}

// The declarative definition of a generator: what it is, what it can be tuned
// with, its difficulty presets, and how it produces a problem from config.
export interface GeneratorSpec {
    id: string;
    name: string;
    description: string;
    fields: ConfigField[];
    difficulties: DifficultyPreset[];
    generate: GenerateFn;
}

// Mutable per-generator state the session is driven from.
export interface GeneratorState {
    spec: GeneratorSpec;
    enabled: boolean;
    weight: number;
    difficultyId: string;
    values: ConfigValues;
}

// The field defaults as a fresh value set.
export function defaultValues(spec: GeneratorSpec): ConfigValues {
    const values: ConfigValues = {};
    for (const field of spec.fields) {
        values[field.key] = field.default;
    }
    return values;
}

// Field defaults with a difficulty preset's overrides applied on top.
export function valuesForDifficulty(spec: GeneratorSpec, difficultyId: string): ConfigValues {
    const preset = spec.difficulties.find((difficulty) => difficulty.id === difficultyId);
    return { ...defaultValues(spec), ...(preset?.values ?? {}) };
}
