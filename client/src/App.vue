<template>
    <div id="app">
        <div id="expression" v-katex="expression"></div>
        <button v-on:click="fetchQuestion">
            Fetch Question
        </button>
    </div>
</template>

<style lang="scss">
html, body {
    background: hsl(0, 0%, 6%)
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
    text-align: center;

    .katex {
        font-size: 16em !important;
        white-space: nowrap;
        user-select: none;
    }
}
</style>

<script>
import axios from "axios";

export default {
    name: 'App',
    data() {
        return {
            currentQuestion: null
        }
    },
    computed: {
        expression() {
            return this.currentQuestion != null ? this.currentQuestion.question : "loading";
        },
    },
    mounted: function () {
        this.$nextTick(() => {
            this.fetchQuestion();
        })
    },
    methods: {
        fetchQuestion() {
            // Fetch the next question, display with KaTeX
            axios.put(`${process.env.VUE_APP_API_URL}/api/question/`)
                .then((res) => {
                    this.currentQuestion = res.data
                })
        },
    }
}
</script>
