<template>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Settings</p>
            <b-icon @click.native="$parent.close()" class="is-clickable" pack="fas" icon="times"></b-icon>
        </header>
        <section class="modal-card-body">
            <b-field addons v-for="(problemType, problemIndex) in problems" :key="problemType.id">
                <p class="control">
                    <b-button class="button-unhoverable" :hovered="false" style="cursor: default;">
                        {{ problemType.name }}
                    </b-button>
                </p>
                <p class="control">
                    <b-button @click="disableProblem(problemIndex)" :type="!problemType.enabled ? 'is-info' : ''" :selected="!problemType.enabled">
                        Off
                    </b-button>
                </p>
                <p class="control" v-for="(difficulty, difficultyIndex) in problemType.difficulties" :key="difficulty.id">
                    <b-button :type="problemType.enabled && problemType.current === difficultyIndex ? 'is-info' : ''"
                              :selected="problemType.enabled && problemType.current === difficultyIndex"
                                @click.native="selectProblemDifficulty(problemIndex, difficultyIndex)">
                        {{ difficulty.name }}
                    </b-button>
                </p>
            </b-field>
        </section>
    </div>
</template>

<style lang="scss">

</style>

<script>
import problems from "@/problems";

export default {
    name: 'SettingsMenu',
    data() {
        return {
            problems: problems.data()
        }
    },
    created() {
    },
    methods: {
        selectProblemDifficulty(problemIndex, difficultyIndex) {
            console.log(`Selected problem ${this.problems[problemIndex].name}, difficulty ${this.problems[problemIndex].difficulties[difficultyIndex].name}`)
            this.problems[problemIndex].enabled = true;
            this.problems[problemIndex].current = difficultyIndex;
        },
        disableProblem(problemIndex) {
            console.log(`Disabled problem ${this.problems[problemIndex].name}`)
            this.problems[problemIndex].enabled = false;
        }
    }
}
</script>
