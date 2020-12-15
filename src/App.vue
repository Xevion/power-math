<template>
    <div id="app">
        <div id="expression" v-katex="expression"></div>
        <div class="container">
            <div class="columns is-centered">
                <div class="column is-three-fifths">
                    <b-field id="input" @keyup.native.enter="checkAnswer()">
                        <b-input :custom-class="input_shake" v-model="answer"></b-input>
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
            shakeInput: false
        }
    },
    computed: {
        expression() {
            return this.currentQuestion != null ? this.currentQuestion.text : "error";
        },
        input_shake() {
            return this.shakeInput ? "shake" : "";
        }
    },
    created() {
        window.addEventListener('keyup', (e) => {
            if (e.keyCode === 39) {
                this.nextQuestion();
            }
        });
    },
    mounted: function () {
        this.$nextTick(() => {
            this.nextQuestion();
        })
    },
    methods: {
        nextQuestion() {
            this.currentQuestion = arithmetic.methods.getProblem();
        },
        checkAnswer() {
            // Check answer
            let correct;
            // Number parsing if the answer is a specific number
            if (typeof this.currentQuestion.answer === "number")
                correct = this.currentQuestion.answer === Number.parseInt(this.answer)
            else
                // String based answer (like a fraction)
                correct = this.currentQuestion.answer === this.answer

            if (correct) {
                // Correct answer toast, new question & reset answer box
                this.$buefy.toast.open({
                    message: 'Correct!',
                    type: 'is-success',
                    duration: 600
                })
                this.nextQuestion();
                this.answer = "";
            } else {
                // Incorrect answer toast
                this.$buefy.toast.open({
                    message: 'Incorrect.',
                    type: 'is-danger',
                    duration: 500
                })

                // Shake input
                this.shakeInput = true;
                setTimeout(this.stopShake, 500);
            }
        },
        stopShake() {
            this.shakeInput = false;
        }
    }
}
</script>
