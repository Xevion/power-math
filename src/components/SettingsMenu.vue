<template>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Settings</p>
            <button class="icon-btn" @click="emit('close')" aria-label="Close">
                <X :size="22" />
            </button>
        </header>
        <section class="modal-card-body">
            <div class="generator" v-for="state in problems" :key="state.spec.id">
                <div class="generator-head">
                    <div>
                        <span class="generator-name">{{ state.spec.name }}</span>
                        <span class="generator-desc">{{ state.spec.description }}</span>
                    </div>
                    <o-switch v-model="state.enabled" />
                </div>

                <div class="buttons difficulty-row">
                    <o-tooltip
                        v-for="difficulty in state.spec.difficulties"
                        :key="difficulty.id"
                        variant="dark"
                    >
                        <o-button
                            :class="
                                state.enabled && state.difficultyId === difficulty.id
                                    ? difficulty.style || 'is-info'
                                    : ''
                            "
                            @click="selectDifficulty(state, difficulty.id)"
                        >
                            {{ difficulty.name }}
                        </o-button>
                        <template #content>
                            <span v-katex="example(state, difficulty.id)"></span>
                        </template>
                    </o-tooltip>
                </div>

                <div class="generator-tune" v-show="state.enabled">
                    <o-field label="Frequency" class="tune-field">
                        <o-slider v-model="state.weight" :min="1" :max="5" :step="1" tooltip />
                    </o-field>
                    <template v-for="field in state.spec.fields" :key="field.key">
                        <o-field
                            v-if="field.kind === 'number'"
                            :label="field.label"
                            class="tune-field"
                        >
                            <o-input
                                number
                                :min="field.min"
                                :max="field.max"
                                :step="field.step ?? 1"
                                :model-value="readNumber(state, field.key)"
                                @update:model-value="
                                    (value: unknown) => setValue(state, field.key, Number(value))
                                "
                            />
                        </o-field>
                        <o-field v-else :label="field.label" class="tune-field">
                            <o-switch
                                :model-value="readBoolean(state, field.key)"
                                @update:model-value="
                                    (value: unknown) => setValue(state, field.key, value === true)
                                "
                            />
                        </o-field>
                    </template>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
    import { X } from 'lucide-vue-next';
    import { valuesForDifficulty } from '@/types';
    import type { GeneratorState } from '@/types';

    defineProps<{ problems: GeneratorState[] }>();
    const emit = defineEmits<{ close: [] }>();

    function selectDifficulty(state: GeneratorState, difficultyId: string) {
        state.enabled = true;
        state.difficultyId = difficultyId;
        state.values = valuesForDifficulty(state.spec, difficultyId);
    }

    function example(state: GeneratorState, difficultyId: string): string {
        return state.spec.generate(valuesForDifficulty(state.spec, difficultyId)).text;
    }

    function readNumber(state: GeneratorState, key: string): number {
        return Number(state.values[key]);
    }

    function readBoolean(state: GeneratorState, key: string): boolean {
        return state.values[key] === true;
    }

    function setValue(state: GeneratorState, key: string, value: number | boolean) {
        state.values[key] = value;
    }
</script>

<style scoped lang="scss">
    .generator {
        padding: 0.85rem 0;

        & + .generator {
            border-top: 1px solid var(--border);
        }
    }

    .generator-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 0.5rem;
    }

    .generator-name {
        font-weight: 600;
        margin-right: 0.5rem;
    }

    .generator-desc {
        color: var(--text);
        opacity: 0.7;
        font-size: 0.85rem;
    }

    .difficulty-row {
        gap: 0.4rem;
        margin-bottom: 0.5rem;
    }

    .generator-tune {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        gap: 0.75rem 1.25rem;
    }

    .tune-field {
        min-width: 9rem;
    }
</style>
