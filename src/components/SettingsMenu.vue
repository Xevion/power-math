<template>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Settings</p>
            <o-icon @click="emit('close')" class="is-clickable" pack="fas" icon="times" />
        </header>
        <section class="modal-card-body">
            <o-field
                addons
                class="is-flex mb-1"
                v-for="(problemType, problemIndex) in problems"
                :key="problemType.id"
            >
                <p class="control is-flex-grow-0" style="min-width: 150px">
                    <o-button class="button-unhoverable is-block darker w-100" style="cursor: default">
                        {{ problemType.name }}
                    </o-button>
                </p>
                <p class="control is-flex-grow-2">
                    <o-button
                        class="w-100"
                        :class="!problemType.enabled ? 'is-info' : ''"
                        @click="disableProblem(problemIndex)"
                    >
                        Off
                    </o-button>
                </p>
                <p
                    class="control is-flex-grow-2"
                    v-for="(difficulty, difficultyIndex) in problemType.difficulties"
                    :key="difficulty.id"
                >
                    <o-tooltip class="w-100" variant="dark">
                        <o-button
                            class="w-100"
                            :class="
                                problemType.enabled && problemType.current === difficultyIndex
                                    ? difficulty.style || 'is-info'
                                    : ''
                            "
                            @click="selectProblemDifficulty(problemIndex, difficultyIndex)"
                        >
                            {{ difficulty.name }}
                        </o-button>
                        <template #content>
                            <span v-katex="getExample(problemIndex, difficultyIndex)"></span>
                        </template>
                    </o-tooltip>
                </p>
            </o-field>
        </section>
    </div>
</template>

<script setup lang="ts">
    import type { ProblemType } from '@/types';

    const props = defineProps<{ problems: ProblemType[] }>();
    const emit = defineEmits<{ close: [] }>();

    function selectProblemDifficulty(problemIndex: number, difficultyIndex: number) {
        props.problems[problemIndex].enabled = true;
        props.problems[problemIndex].current = difficultyIndex;
    }

    function disableProblem(problemIndex: number) {
        props.problems[problemIndex].enabled = false;
    }

    function getExample(problemIndex: number, difficultyIndex: number): string {
        const problemType = props.problems[problemIndex];
        return problemType.method(problemType.difficulties[difficultyIndex].options).text;
    }
</script>
