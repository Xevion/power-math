<template>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Settings</p>
            <o-icon @click="$emit('close')" class="is-clickable" pack="fas" icon="times" />
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

<script>
    export default {
        name: 'SettingsMenu',
        props: ['problems'],
        emits: ['close'],
        methods: {
            selectProblemDifficulty(problemIndex, difficultyIndex) {
                this.problems[problemIndex].enabled = true;
                this.problems[problemIndex].current = difficultyIndex;
            },
            disableProblem(problemIndex) {
                this.problems[problemIndex].enabled = false;
            },
            getExample(problemIndex, difficultyIndex) {
                let problemType = this.problems[problemIndex];
                return problemType.method(problemType.difficulties[difficultyIndex].options).text;
            },
        },
    };
</script>
