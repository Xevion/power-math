import arithmetic from "@/arithmetic";
import utils from "@/utils";

export default {
    methods: {
        getProblem() {
            let problem = this.problems[utils.methods.getRandomInt(0, this.problems.length)];
            return problem.method(problem.difficulties[problem.current].options);
        }
    },
    data() {
        return {
            problems: arithmetic.data().problems
        }
    }
}
