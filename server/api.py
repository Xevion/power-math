"""
api.py

Organizes all API routes for acquiring, checking, removing questions, as well as other important and miscellaneous
API interactions, static or dynamic.
"""
import copy
import random

from flask import jsonify
from flask_restful import Resource, reqparse, abort

from server import questions
from server.helpers import generate_id

# Stores active questions in memory for checking answers.
# Keys represent random question IDs. Values are Question objects.
active_questions = {}

# Question categories, key name, value function for acquiring a random question generator.
categories = {
    'arithmetic': questions.get_arithmetic
}

parser = reqparse.RequestParser()
parser.add_argument(
    'category',
    required=False, type=str, choices=tuple(categories.keys()), help='Invalid Category: {error_msg}'
)


class Question(Resource):
    """
    Questions are small objects represented generated questions for users with a prompt and a answer.
    They are identified by a String ID.
    """

    def get(self, question_id):
        """Retrieve information about a given question, including the answer for it."""
        pass

    def put(self, question_id = None):
        """
        Request a new question.

        A category can be specified in the query arguments in order to filter the question type.
        Furthermore, a question type can be also specified .
        The Question object is returned, although the answer is omitted.
        """
        args = parser.parse_args()
        q_id = None
        while q_id in active_questions.keys() or q_id is None:
            q_id = generate_id(5)

        # Get category arg or choose one if not specified.
        if args.get('category') is not None:
            category = args.get('category')
            if category not in categories.keys():
                abort(404, message=f'Category {category} is not valid.')
        else:
            category = random.choice(list(categories.keys()))

        # Acquire a question generator and generate a function, then store the result.
        active_questions[q_id] = categories[category]()()

        # Make a shallow copy, hide 'answer' key.
        question = copy.copy(active_questions[q_id])
        del question['answer']

        return question, 200


class Category(Resource):
    """
    A category is a static designation for a problem to be classified as.
    Any question will only have one category it belongs to.
    """

    def get(self, category_id):
        """Get all information about a category"""
        pass


class Categories(Resource):
    """
    Categories are static identifiers for the different types of questions available to users.
    They are identified with pre-chosen identifiers.
    """

    def get(self):
        """Get a list of all categories."""
        return list(categories.keys()), 200


