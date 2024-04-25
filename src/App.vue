<template>
    <div id="app">
        <div class="columns is-justify-content-flex-end pt-2">
            <div class="column is-1 mr-2">
                <o-icon
                    @click="isSettingsMenuActive = true"
                    class="is-clickable is-pulled-right settings-cog"
                    pack="fas"
                    icon="cog"
                />
                <o-modal
                    v-model:active="isSettingsMenuActive"
                    trap-focus
                    :destroy-on-hide="false"
                    aria-role="dialog"
                    aria-modal
                >
                    <SettingsMenu :problems="problems" @close="isSettingsMenuActive = false" />
                </o-modal>
            </div>
        </div>
        <div
            id="expression"
            class="animate__animated animate__faster"
            :class="currentAnimation"
            v-katex="expression"
        ></div>
        <div class="container">
            <div class="columns is-centered">
                <div class="column is-three-fifths">
                    <o-field id="input">
                        <o-input v-model="answer" :class="inputClass" @keyup.enter="checkAnswer()" />
                    </o-field>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted, onUnmounted, ref } from 'vue';
    import SettingsMenu from '@/components/SettingsMenu.vue';
    import { useProblems } from '@/composables/useProblems';
    import type { GeneratedProblem } from '@/types';

    const { problems, getProblem } = useProblems();

    const answer = ref('');
    const currentQuestion = ref<GeneratedProblem | null>(null);
    const inputClass = ref('');
    const allowInputSubmit = ref(true);
    const currentAnimation = ref('');
    const chances = ref(3);
    const isSettingsMenuActive = ref(false);

    const expression = computed(() => currentQuestion.value?.text ?? 'error');

    function nextQuestion(fail = false) {
        const problem = getProblem();
        if (currentQuestion.value == null) {
            currentQuestion.value = problem;
            return;
        }

        currentAnimation.value = fail ? 'animate__fadeOutRight' : 'animate__fadeOutUp';
        setTimeout(() => {
            currentQuestion.value = problem;
            currentAnimation.value = 'animate__fadeInDown';
            setTimeout(() => {
                currentAnimation.value = '';
            }, 500);
        }, 200);
    }

    function checkAnswer(force = false) {
        // Skip answer checking if submission is currently locked
        if (!allowInputSubmit.value && !force) return;

        const question = currentQuestion.value;
        const correct = question != null && question.answer === Number.parseInt(answer.value);

        if (correct || force) {
            inputClass.value = 'correct';
            setTimeout(clearInputClass, 500);
            nextQuestion();
            answer.value = '';
        } else {
            if (--chances.value === 0) {
                nextQuestion(true);
                chances.value = 3;
            }

            // Shake the input, then briefly lock submission
            inputClass.value = 'incorrect';
            setTimeout(clearInputClass, 500);
            allowInputSubmit.value = false;
            setTimeout(unlockInput, 500);
        }
    }

    function clearInputClass() {
        inputClass.value = '';
    }

    function unlockInput() {
        allowInputSubmit.value = true;
    }

    function onKeyup(e: KeyboardEvent) {
        if (e.key === 'ArrowUp') {
            nextQuestion();
        } else if (e.key === 'ArrowRight') {
            checkAnswer(true);
        }
    }

    onMounted(() => {
        window.addEventListener('keyup', onKeyup);
        nextQuestion();
    });

    onUnmounted(() => {
        window.removeEventListener('keyup', onKeyup);
    });
</script>
