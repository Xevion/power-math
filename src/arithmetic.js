import utils from '@/utils';

export default {
    methods: {
        // Generate a addition problem
        addition(options) {
            let a = utils.methods.getRandomInt(options.low, options.high);
            let b = utils.methods.getRandomInt(options.low, options.high);
            return {
                text: `${a} + ${b}`,
                answer: a + b
            }
        },
        subtraction(options) {
            let a = utils.methods.getRandomInt(options.low, options.high);
            let b = utils.methods.getRandomInt(options.low, options.high);
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
        }
    },
    data() {
        let self = this;
        return {
            problems: [
                {
                    name: 'Addition',
                    id: 'addition',
                    description: 'Find the sum of two integers',
                    difficulties: [
                        {
                            id: 'easy',
                            name: 'Easy',
                            options: {
                                low: 7,
                                high: 50
                            },
                            style: 'is-success'
                        },
                        {
                            id: 'medium',
                            name: 'Medium',
                            options: {
                                low: 9,
                                high: 100
                            },
                            style: 'is-warning'
                        },
                        {
                            id: 'hard',
                            name: 'Hard',
                            options: {
                                low: 15,
                                high: 150
                            },
                            style: 'is-danger'
                        }
                    ],
                    method: self.methods.addition,
                    enabled: true,
                    current: 0
                }
            ]
        }
    }
}
