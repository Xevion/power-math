<template>
    <div id="app">
        <div id="expression" class="animate__animated animate__faster" :class="currentAnimation" v-katex="expression"></div>
        <div class="container">
            <div class="columns is-centered">
                <div class="column is-three-fifths">
                    <b-field id="input" @keyup.native.enter="checkAnswer()">
                        <b-input :custom-class="inputClass" v-model="answer"></b-input>
                    </b-field>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import "./src/scss/shake.scss";

html, body, #app {
    height: 100%;
    min-height: 100%;
    background: hsl(0, 0%, 6%)
}

#input {
    input {
        text-align: center;
        background-color: transparent;
        border-color: hsl(0, 0%, 20%);
        border-left-width: 0;
        border-right-width: 0;
        border-radius: 0;
        color: hsl(0, 0%, 80%);
        font-family: 'KaTeX_Main', serif;
        padding: 0;
        height: 1.3em;
        line-height: 0;
        font-size: 8em;

        &:active, &:focus {
            box-shadow: none;
        }
    }
}

a, p, span {
    color: hsl(0, 0%, 91%);
    text-shadow: hsl(0, 0%, 5%) 5px 5px;
}

#question-text {
    font-family: "Computer Modern", serif;
}

#expression {
    width: 75%;
    margin: 0 auto;
    padding-bottom: 2em;
    text-align: center;

    .katex {
        font-size: 16em !important;
        white-space: nowrap;
        user-select: none;
    }
}

.notices .toast {
    padding: 0.6em 1.35em !important;
}
</style>

<script>
import arithmetic from './arithmetic.js';

export default {
    name: 'App',
    data() {
        return {
            answer: null,
            currentQuestion: null,
            correctTimeout: false,
            inputClass: false,
            allowInputSubmit: true,
            currentAnimation: null,
            chances: 3
        }
    },
    computed: {
        expression() {
            return this.currentQuestion != null ? this.currentQuestion.text : "error";
        }
    },
    created() {
        window.addEventListener('keyup', (e) => {
            if (e.keyCode === 38) {
                this.nextQuestion();
            } else if (e.keyCode === 39) {
                this.checkAnswer(true);
            }
        });
    },
    mounted: function () {
        this.$nextTick(() => {
            this.nextQuestion();
        })
    },
    methods: {
        nextQuestion(fail = false) {
            let problem = arithmetic.methods.getProblem();
            if (this.currentQuestion == null)
                this.currentQuestion = problem;
            else {
                // Animate fade out
                if (fail)
                    this.currentAnimation = 'animate__fadeOutRight'
                else
                    this.currentAnimation = 'animate__fadeOutUp';

                // Fade in down
                setTimeout(() => {
                    this.currentQuestion = problem;
                    this.currentAnimation = 'animate__fadeInDown';
                    setTimeout(() => {
                        this.currentAnimation = '';
                    }, 500)
                }, 200)
            }
        },
        checkAnswer(force = false) {
            // Skip answer checking if answer submission currently locked
            if (!this.allowInputSubmit && !force)
                return;

            // Check answer
            let correct;
            // Number parsing if the answer is a specific number
            if (typeof this.currentQuestion.answer === "number")
                correct = this.currentQuestion.answer === Number.parseInt(this.answer)
            else
                // String based answer (like a fraction)
                correct = this.currentQuestion.answer === this.answer

            if (correct || force) {
                // Correct answer animation, new question & reset answer box
                this.inputClass = 'correct';
                setTimeout(this.clearInputClass, 500)
                this.nextQuestion();
                this.answer = "";

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
                setTimeout(this.unlockInput, 500)
            }
        },
        clearInputClass() {
            this.inputClass = '';
        },
        unlockInput() {
            this.allowInputSubmit = true;
        }
    }
}
</script>
