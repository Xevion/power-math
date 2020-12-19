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
        multiplication(options) {
            let a = utils.methods.getRandomInt(options.low, options.high);
            let b = utils.methods.getRandomInt(options.low, options.high);
            return {
                text: `${a} \\times ${b}`,
                answer: a * b
            }
        },
        division(options) {
            let a = utils.methods.getRandomInt(options.low, options.high);
            let b = utils.methods.getRandomInt(options.low, options.high);
            return {
                text: `${a * b} \\div ${b}`,
                answer: a
            }

        },
        square_root(options) {
            let a = utils.methods.getRandomInt(options.low, options.high);
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
                                low: 30,
                                high: 100
                            },
                            style: 'is-warning'
                        },
                        {
                            id: 'hard',
                            name: 'Hard',
                            options: {
                                low: 50,
                                high: 200
                            },
                            style: 'is-danger'
                        }
                    ],
                    method: self.methods.addition,
                    enabled: true,
                    current: 0
                },
                {
                    name: 'Subtraction',
                    id: 'subtraction',
                    description: 'Evaluate the difference between two integers.',
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
                                low: 20,
                                high: 80
                            },
                            style: 'is-warning'
                        },
                        {
                            id: 'hard',
                            name: 'Hard',
                            options: {
                                low: 40,
                                high: 110
                            },
                            style: 'is-danger'
                        }
                    ],
                    method: self.methods.subtraction,
                    enabled: true,
                    current: 0
                },
                {
                    name: 'Multiplication',
                    id: 'multiplication',
                    description: 'Evaluate the product of two integers.',
                    difficulties: [
                        {
                            id: 'easy',
                            name: 'Easy',
                            options: {
                                low: 5,
                                high: 35
                            },
                            style: 'is-success'
                        },
                        {
                            id: 'medium',
                            name: 'Medium',
                            options: {
                                low: 8,
                                high: 50
                            },
                            style: 'is-warning'
                        },
                        {
                            id: 'hard',
                            name: 'Hard',
                            options: {
                                low: 15,
                                high: 95
                            },
                            style: 'is-danger'
                        }
                    ],
                    method: self.methods.multiplication,
                    enabled: true,
                    current: 0
                },
                {
                    name: 'Division',
                    id: 'division',
                    description: 'Divide one integer by another to get a third integer.',
                    difficulties: [
                        {
                            id: 'easy',
                            name: 'Easy',
                            options: {
                                low: 5,
                                high: 35
                            },
                            style: 'is-success'
                        },
                        {
                            id: 'medium',
                            name: 'Medium',
                            options: {
                                low: 8,
                                high: 50
                            },
                            style: 'is-warning'
                        },
                        {
                            id: 'hard',
                            name: 'Hard',
                            options: {
                                low: 15,
                                high: 95
                            },
                            style: 'is-danger'
                        }
                    ],
                    method: self.methods.division,
                    enabled: true,
                    current: 0
                },
                {
                    name: 'Square Root',
                    id: 'square_root',
                    description: 'Find the square root of a given integer.',
                    difficulties: [
                        {
                            id: 'easy',
                            name: 'Easy',
                            options: {
                                low: 4,
                                high: 20
                            },
                            style: 'is-success'
                        },
                        {
                            id: 'medium',
                            name: 'Medium',
                            options: {
                                low: 13,
                                high: 30
                            },
                            style: 'is-warning'
                        },
                        {
                            id: 'hard',
                            name: 'Hard',
                            options: {
                                low: 19,
                                high: 60
                            },
                            style: 'is-danger'
                        }
                    ],
                    method: self.methods.square,
                    enabled: true,
                    current: 0
                }
            ]
        }
    }
}
