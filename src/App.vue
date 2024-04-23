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

<script>
    import problems from '@/problems';
    import SettingsMenu from '@/components/SettingsMenu.vue';

    export default {
        name: 'App',
        mixins: [problems],
        components: { SettingsMenu },
        data() {
            return {
                answer: null,
                currentQuestion: null,
                inputClass: '',
                allowInputSubmit: true,
                currentAnimation: '',
                chances: 3,
                isSettingsMenuActive: false,
            };
        },
        computed: {
            expression() {
                return this.currentQuestion != null ? this.currentQuestion.text : 'error';
            },
        },
        created() {
            window.addEventListener('keyup', (e) => {
                if (e.key === 'ArrowUp') {
                    this.nextQuestion();
                } else if (e.key === 'ArrowRight') {
                    this.checkAnswer(true);
                }
            });
        },
        mounted() {
            this.$nextTick(() => {
                this.nextQuestion();
            });
        },
        methods: {
            nextQuestion(fail = false) {
                let problem = this.getProblem();
                if (this.currentQuestion == null) this.currentQuestion = problem;
                else {
                    // Animate fade out
                    if (fail) this.currentAnimation = 'animate__fadeOutRight';
                    else this.currentAnimation = 'animate__fadeOutUp';

                    // Fade in down
                    setTimeout(() => {
                        this.currentQuestion = problem;
                        this.currentAnimation = 'animate__fadeInDown';
                        setTimeout(() => {
                            this.currentAnimation = '';
                        }, 500);
                    }, 200);
                }
            },
            checkAnswer(force = false) {
                // Skip answer checking if answer submission currently locked
                if (!this.allowInputSubmit && !force) return;

                // Check answer
                let correct;
                // Number parsing if the answer is a specific number
                if (typeof this.currentQuestion.answer === 'number')
                    correct = this.currentQuestion.answer === Number.parseInt(this.answer);
                // String based answer (like a fraction)
                else correct = this.currentQuestion.answer === this.answer;

                if (correct || force) {
                    // Correct answer animation, new question & reset answer box
                    this.inputClass = 'correct';
                    setTimeout(this.clearInputClass, 500);
                    this.nextQuestion();
                    this.answer = '';
                } else {
                    if (--this.chances === 0) {
                        this.nextQuestion(true);
                        this.chances = 3;
                    }

                    // Shake input
                    this.inputClass = 'incorrect';
                    setTimeout(this.clearInputClass, 500);

                    // Lock submission
                    this.allowInputSubmit = false;
                    setTimeout(this.unlockInput, 500);
                }
            },
            clearInputClass() {
                this.inputClass = '';
            },
            unlockInput() {
                this.allowInputSubmit = true;
            },
        },
    };
</script>
