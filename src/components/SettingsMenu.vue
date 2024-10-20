<template>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Settings</p>
            <o-icon @click="emit('close')" class="is-clickable" pack="fas" icon="times" />
        </header>
        <section class="modal-card-body">
            <o-field addons class="is-flex mb-1" v-for="state in problems" :key="state.spec.id">
                <p class="control is-flex-grow-0" style="min-width: 150px">
                    <o-button
                        class="button-unhoverable is-block darker w-100"
                        style="cursor: default"
                    >
                        {{ state.spec.name }}
                    </o-button>
                </p>
                <p class="control is-flex-grow-2">
                    <o-button
                        class="w-100"
                        :class="!state.enabled ? 'is-info' : ''"
                        @click="state.enabled = false"
                    >
                        Off
                    </o-button>
                </p>
                <p
                    class="control is-flex-grow-2"
                    v-for="difficulty in state.spec.difficulties"
                    :key="difficulty.id"
                >
                    <o-tooltip class="w-100" variant="dark">
                        <o-button
                            class="w-100"
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
                </p>
            </o-field>
        </section>
    </div>
</template>

<script setup lang="ts">
    import { valuesForDifficulty } from '@/types';
    import type { GeneratorState } from '@/types';

    const props = defineProps<{ problems: GeneratorState[] }>();
    const emit = defineEmits<{ close: [] }>();

    function selectDifficulty(state: GeneratorState, difficultyId: string) {
        state.enabled = true;
        state.difficultyId = difficultyId;
        state.values = valuesForDifficulty(state.spec, difficultyId);
    }

    function example(state: GeneratorState, difficultyId: string): string {
        return state.spec.generate(valuesForDifficulty(state.spec, difficultyId)).text;
    }
</script>
