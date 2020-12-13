"""
arithmetic.py

Organizes all questions related to basic arithmetic, i.e. the four primary mathematical operations.
Also includes arithmetic related to exponents (positive and negative), fractions and more.
"""
import inspect
import random


def addition():
    a, b = random.randint(6, 70), random.randint(6, 70)
    return {
        'type': inspect.stack()[0][3],
        'question': f'{a} + {b}',
        'answer': a + b
    }


def subtraction():
    a, b = random.randint(6, 70), random.randint(6, 70)
    return {
        'type': inspect.stack()[0][3],
        'question': f'{a} - {b}',
        'answer': a - b
    }


def multiplication():
    a = random.randint(2, 18)
    b = random.randint(2, 26 - a)
    return {
        'type': inspect.stack()[0][3],
        'question': f'{a}\\times {b}',
        'answer': a * b
    }


def division():
    a = random.randint(2, 18)
    b = random.randint(2, 26 - a)
    return {
        'type': inspect.stack()[0][3],
        'question': f'{a * b}\\div {b}',
        'answer': a
    }


def simplify_fraction():
    a = random.randint(1, 12)
    b = random.randint(2, 20 - a)

    # Multiply by even/odd to
    c, d = a, b
    while c + d <= 15:
        multiplier = random.randint(2, 3)
        c, d = c * multiplier, d * multiplier

    return {
        'type': inspect.stack()[0][3],
        'question': f'Simplify. \\frac{{{c}}}{{{d}}}',
        'answer': f'{a}/{b}'
    }


questions = [addition, subtraction, multiplication, division, simplify_fraction]
