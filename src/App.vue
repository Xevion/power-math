<template>
    <div id="app">
        <header class="app-bar">
            <span class="app-title">power-math</span>
            <div class="app-actions">
                <button
                    class="icon-btn"
                    @click="isHelpActive = true"
                    aria-label="Keyboard shortcuts"
                    title="Keyboard shortcuts (?)"
                >
                    <Keyboard :size="22" />
                </button>
                <button
                    class="icon-btn"
                    @click="toggleTheme()"
                    :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
                >
                    <component :is="theme === 'dark' ? Moon : Sun" :size="22" />
                </button>
            </div>
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
                <div id="input" class="control">
                    <input
                        ref="answerEl"
                        :value="answer"
                        class="input"
                        :class="inputClass"
                        type="text"
                        inputmode="numeric"
                        autocomplete="off"
                        autocapitalize="off"
                        spellcheck="false"
                        aria-label="Answer"
                        @input="onAnswerInput"
                        @keyup.enter="checkAnswer()"
                    />
                </div>
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
            <Transition name="dialog">
                <div v-if="isHelpActive" class="help-overlay" @click.self="isHelpActive = false">
                    <ShortcutsHelp @close="isHelpActive = false" />
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
    import { Keyboard, Moon, Settings, Sun } from 'lucide-vue-next';
    import SettingsMenu from '@/components/SettingsMenu.vue';
    import ShortcutsHelp from '@/components/ShortcutsHelp.vue';
    import { useProblems } from '@/composables/useProblems';
    import { useTheme } from '@/composables/useTheme';
    import { parseAnswer, sanitizeAnswer } from '@/answer';
    import type { GeneratedProblem } from '@/types';

    const { problems, getProblem } = useProblems();
    const { theme, toggleTheme, initTheme } = useTheme();

    const answer = ref('');
    const answerEl = ref<HTMLInputElement | null>(null);
    const currentQuestion = ref<GeneratedProblem | null>(null);
    const inputClass = ref('');
    const allowInputSubmit = ref(true);
    const currentAnimation = ref('');
    const chances = ref(3);
    const isSettingsMenuActive = ref(false);
    const isHelpActive = ref(false);
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

    // Strip anything that can't be part of an integer answer, however it got in
    // (typing, paste, drop). Writing the DOM value directly keeps the caret and
    // avoids a stale rejected character when the model value doesn't change.
    function onAnswerInput(e: Event) {
        // Leave an in-progress IME composition alone; it fires another input when committed
        if ((e as InputEvent).isComposing) return;
        const el = e.target as HTMLInputElement;
        const clean = sanitizeAnswer(el.value);
        if (clean !== el.value) {
            const caret = (el.selectionStart ?? clean.length) - (el.value.length - clean.length);
            el.value = clean;
            el.setSelectionRange(Math.max(0, caret), Math.max(0, caret));
        }
        answer.value = clean;
    }

    function clearInputClass() {
        inputClass.value = '';
    }

    function unlockInput() {
        allowInputSubmit.value = true;
    }

    function onKeyup(e: KeyboardEvent) {
        // The settings sheet and the shortcuts list own the keyboard while open
        if (isSettingsMenuActive.value || isHelpActive.value) return;

        if (e.key === 'ArrowUp') {
            nextQuestion();
        } else if (e.key === 'ArrowRight') {
            checkAnswer(true);
        }
    }

    // Escape closes the topmost layer on keydown so a control that already used
    // it (to cancel typing a number) can claim it first via preventDefault. The
    // answer and number fields reject "?", so it is free to mean help everywhere.
    function onKeydown(e: KeyboardEvent) {
        if (e.defaultPrevented) return;
        if (e.key === 'Escape') {
            if (isHelpActive.value) isHelpActive.value = false;
            else if (isSettingsMenuActive.value) isSettingsMenuActive.value = false;
        } else if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            isHelpActive.value = !isHelpActive.value;
        }
    }

    let resizeObserver: ResizeObserver | null = null;

    onMounted(() => {
        initTheme();
        // Only grab focus where a physical keyboard is likely; on touch it would
        // pop the on-screen keyboard over the problem before anyone asked for it
        if (window.matchMedia('(pointer: fine)').matches) answerEl.value?.focus();
        window.addEventListener('keyup', onKeyup);
        window.addEventListener('keydown', onKeydown);
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
        window.removeEventListener('keydown', onKeydown);
        resizeObserver?.disconnect();
    });
</script>
