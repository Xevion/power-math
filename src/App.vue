<template>
    <div id="app">
        <div class="columns is-justify-content-flex-end pt-2">
            <div class="column is-narrow">
                <div class="top-controls">
                    <o-icon
                        @click="toggleTheme()"
                        class="is-clickable theme-toggle"
                        pack="fas"
                        :icon="theme === 'dark' ? 'moon' : 'sun'"
                    />
                    <o-icon
                        @click="isSettingsMenuActive = true"
                        class="is-clickable settings-cog"
                        pack="fas"
                        icon="cog"
                    />
                </div>
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
                        <o-input
                            v-model="answer"
                            :class="inputClass"
                            @keyup.enter="checkAnswer()"
                        />
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
    import { useTheme } from '@/composables/useTheme';
    import { parseAnswer } from '@/answer';
    import type { GeneratedProblem } from '@/types';

    const { problems, getProblem } = useProblems();
    const { theme, toggleTheme, initTheme } = useTheme();

    const answer = ref('');
    const currentQuestion = ref<GeneratedProblem | null>(null);
    const inputClass = ref('');
    const allowInputSubmit = ref(true);
    const currentAnimation = ref('');
    const chances = ref(3);
    const isSettingsMenuActive = ref(false);

    const expression = computed(() => currentQuestion.value?.text ?? '');

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
        const parsed = parseAnswer(answer.value);
        const correct = question != null && parsed != null && question.answer === parsed;

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
        initTheme();
        window.addEventListener('keyup', onKeyup);
        nextQuestion();
    });

    onUnmounted(() => {
        window.removeEventListener('keyup', onKeyup);
    });
</script>
