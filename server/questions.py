import random
from server import arithmetic


def get_arithmetic():
    return random.choice(arithmetic.questions)
