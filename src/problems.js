import arithmetic from "@/arithmetic";
import utils from "@/utils";

export default {
    computed: {
      availableProblems() {
          return this.problems.filter(problem => problem.enabled);
      }
    },
    methods: {
        getProblem() {
            let problemType = this.availableProblems[utils.methods.getRandomInt(0, this.availableProblems.length)];
            let problem = null;

            // Begin looking for a 'unique'ish problem
            for (let i = 0; i < 5; i++) {
                // Generate a problem
                problem = problemType.method(problemType.difficulties[problemType.current].options);
                // Check that there was a previous problem and that the text doesn't match
                if (this.previousProblem == null || problem.text !== this.previousProblem.text)
                    break;
            }

            this.previousProblem = problem;
            return problem;
        }
    },
    data() {
        return {
            previousProblem: null,
            problems: arithmetic.data().problems
        }
    }
}
