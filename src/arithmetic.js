import utils from '@/utils';

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
            if (Math.random() > 0.5)
                return {
                    text: `${a} - ${b}`,
                    answer: a - b,
                }
            else
                return {
                    text: `-${a} + ${b}`,
                    answer: -a + b
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
        division(mult = 1) {
            let a = utils.methods.getRandomInt(3 * mult, 30 * mult);
            let b = utils.methods.getRandomInt(2 * mult, 15 * mult);
            return {
                text: `${a * b} \\div ${b}`,
                answer: a
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
            let possible = [this.addition, this.subtraction, this.multiplication, this.division, this.square_root];
            let index = utils.methods.getRandomInt(0, possible.length);
            return possible[index]();
        }
    },
    data() {
        let self = this;
        return {
            problems: [
                {
                    name: 'Addition',
                    id: 'addition',
                    difficulties: [
                        {
                            id: 'easy',
                            name: 'Easy',
                            options: {
                                multiplier: 1
                            }
                        },
                        {
                            id: 'hard',
                            name: 'Hard',
                            options: {
                                multiplier: 2.5
                            }
                        },
                        {
                            id: 'very_hard',
                            name: 'Very Hard',
                            options: {
                                multiplier: 4
                            }
                        }
                    ],
                    method: self.addition,
                    enabled: true,
                    current: 0
                }
            ]
        }
    }
}
