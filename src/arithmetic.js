import utils from './utils.js';

export default {
    methods: {
        // Generate a addition problem
        addition(mult = 1) {
            let a = utils.methods.getRandomInt(5 * mult, 100 * mult);
            let b = utils.methods.getRandomInt(5 * mult, 100 * mult);
            return {
                text: `${a} + ${b}`,
                answer: a + b
            }
        },
        subtraction(mult = 1) {
            let a = utils.methods.getRandomInt(5 * mult, 100 * mult);
            let b = utils.methods.getRandomInt(5 * mult, 100 * mult);
            if (Math.random() > 0.5) {
                return {
                    text: `${a} - ${b}`,
                    answer: a - b,
                }
            }
            else {
                return {
                    text: `-${a} + ${b}`,
                    answer: -a + b
                }
            }
        },
        multiplication(mult = 1) {
            let a = utils.methods.getRandomInt(3 * mult, 30 * mult);
            let b = utils.methods.getRandomInt(3 * mult, 15 * mult);
            return {
                text: `${a} \\times ${b}`,
                answer: a * b
            }
        },
        square_root(mult = 1) {
            let a = utils.methods.getRandomInt(2 * mult, 20 * mult);
            return {
                text: `\\sqrt{${a * a}}`,
                answer: a
            }
        },
        getProblem: function () {
            let possible = [this.multiplication, this.square_root];
            let index = utils.methods.getRandomInt(0, possible.length);
            return possible[index]();
        }
    }
}
