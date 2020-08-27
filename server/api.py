from flask import current_app, jsonify, request

from server import questions
from server.helpers import generate_id

# Stores active questions in memory for checking answers.
# Keys represent random question IDs. Values are Question objects.
active_questions = {}

categories = {
    'arithmetic': questions.get_arithmetic
}


@current_app.route('/api/<category>/new')
def new_question(category: str):
    q_id = None
    while q_id in active_questions.keys() or q_id is None:
        q_id = generate_id(5)

    active_questions[q_id] = categories[category]()()

    return jsonify(active_questions[q_id])


@current_app.route('/api/<category>/check')
def check_question(category: str):
    if 'id' not in request.args.keys():
        return jsonify({'error': ''}), 400

    return jsonify({'answer': active_questions.get(request.args[id])})
