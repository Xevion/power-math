<template>
    <div id="app">
        <header class="app-bar">
            <span class="app-title">power-math</span>
            <button
                class="icon-btn"
                @click="toggleTheme()"
                :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
            >
                <component :is="theme === 'dark' ? Moon : Sun" :size="22" />
            </button>
        </header>

        <main class="stage">
            <div ref="stageEl" class="stage-problem">
                <div class="expr-anim animate__animated animate__faster" :class="currentAnimation">
                    <div
                        ref="exprEl"
                        class="expr"
                        :style="{ transform: `scale(${exprScale})` }"
                        v-katex="expression"
                    ></div>
                </div>
            </div>
            <div class="stage-input">
                <o-field id="input">
                    <o-input v-model="answer" :class="inputClass" @keyup.enter="checkAnswer()" />
                </o-field>
            </div>
        </main>

        <footer class="action-bar">
            <o-tooltip :label="triesLabel" variant="dark">
                <div class="chances" aria-label="tries remaining">
                    <span
                        v-for="n in 3"
                        :key="n"
                        class="chance-dot"
                        :class="{ 'is-used': n > chances, 'is-intro': introActive }"
                        :style="introActive ? { animationDelay: `${(n - 1) * 0.12}s` } : undefined"
                    ></span>
                </div>
            </o-tooltip>
            <button class="icon-btn" @click="isSettingsMenuActive = true" aria-label="Settings">
                <Settings :size="24" />
            </button>
        </footer>

        <Teleport to="body">
            <Transition name="sheet">
                <div
                    v-if="isSettingsMenuActive"
                    class="sheet-overlay"
                    @click.self="isSettingsMenuActive = false"
                >
                    <SettingsMenu :problems="problems" @close="isSettingsMenuActive = false" />
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
    import { Moon, Settings, Sun } from 'lucide-vue-next';
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
    const introActive = ref(false);

    const expression = computed(() => currentQuestion.value?.text ?? '');
    const triesLabel = computed(
        () => `${chances.value} ${chances.value === 1 ? 'try' : 'tries'} left`,
    );

    // Scale the rendered problem to fill the available width so long expressions
    // never run off the edge of small screens
    const stageEl = ref<HTMLElement | null>(null);
    const exprEl = ref<HTMLElement | null>(null);
    const exprScale = ref(1);

    function fitExpression() {
        const expr = exprEl.value;
        const stage = stageEl.value;
        if (!expr || !stage) return;

        const naturalWidth = expr.scrollWidth;
        const naturalHeight = expr.scrollHeight;
        if (naturalWidth === 0 || naturalHeight === 0) return;

        // Shrink to fit whichever axis is tighter; never scale up past the base
        // size, so the expression can't grow tall enough to clip top/bottom
        const widthScale = (stage.clientWidth * 0.94) / naturalWidth;
        const heightScale = (stage.clientHeight * 0.9) / naturalHeight;
        exprScale.value = Math.min(1, widthScale, heightScale);
    }

    // Refit after the katex re-renders for a new problem
    watch(expression, fitExpression, { flush: 'post' });

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
        // While the settings sheet is open, only listen for Escape to close it
        if (isSettingsMenuActive.value) {
            if (e.key === 'Escape') isSettingsMenuActive.value = false;
            return;
        }

        if (e.key === 'ArrowUp') {
            nextQuestion();
        } else if (e.key === 'ArrowRight') {
            checkAnswer(true);
        }
    }

    let resizeObserver: ResizeObserver | null = null;

    onMounted(() => {
        initTheme();
        window.addEventListener('keyup', onKeyup);
        nextQuestion();

        // Briefly draw the eye to the tries indicator when play begins
        introActive.value = true;
        setTimeout(() => (introActive.value = false), 1200);

        resizeObserver = new ResizeObserver(fitExpression);
        if (stageEl.value) resizeObserver.observe(stageEl.value);
        fitExpression();
        // Refit once the math fonts have loaded and widths settle
        document.fonts?.ready.then(fitExpression);
    });

    onUnmounted(() => {
        window.removeEventListener('keyup', onKeyup);
        resizeObserver?.disconnect();
    });
</script>
