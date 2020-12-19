<template>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Settings</p>
            <b-icon @click.native="$parent.close()" class="is-clickable" pack="fas" icon="times"></b-icon>
        </header>
        <section class="modal-card-body">
            <b-field addons class="is-flex mb-1" v-for="(problemType, problemIndex) in problems" :key="problemType.id">
                <p class="control is-flex-grow-0" style="min-width: 150px;">
                    <b-button class="button-unhoverable is-block darker w-100" :hovered="false"
                              style="cursor: default;">
                        {{ problemType.name }}
                    </b-button>
                </p>
                <p class="control is-flex-grow-2">
                    <b-button class="w-100" @click="disableProblem(problemIndex)"
                              :type="!problemType.enabled ? 'is-info' : ''" :selected="!problemType.enabled">
                        Off
                    </b-button>
                </p>
                <p class="control is-flex-grow-2" v-for="(difficulty, difficultyIndex) in problemType.difficulties"
                   :key="difficulty.id">
                    <b-tooltip class="w-100" type="is-dark" :animated="false">
                        <b-button class="w-100"
                                  :type="problemType.enabled && problemType.current === difficultyIndex ? (difficulty.style || 'is-info') : ''"
                                  :selected="problemType.enabled && problemType.current === difficultyIndex"
                                  @click.native="selectProblemDifficulty(problemIndex, difficultyIndex)"
                        >
                            {{ difficulty.name }}
                        </b-button>
                        <template v-slot:content>
                            <katex-element :expression="getExample(problemIndex, difficultyIndex)"/>
                        </template>
                    </b-tooltip>
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
    props: {
        problems
    },
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
            return problemType.method(problemType.difficulties[difficultyIndex].options).text
        }
    }
}
</script>
