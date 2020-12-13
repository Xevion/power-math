"""
create_app.py

The main app creation, registering extensions, API routes, the Vue.js catch all redirect and configs.
"""

from flask import Flask, render_template, jsonify
from flask_restful import Api
from flask_cors import CORS

from server import exceptions
from server.api import Question, Questions, Category, Categories
from server.config import configs


def create_app(env=None):
    app = Flask(
        __name__,
        static_folder="./../dist/static",
        template_folder="./../dist"
    )

    # Add CORS support
    cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Instantiate Flask-Restful API and register appropriate routes
    api = Api(app, prefix='/api/')
    api.add_resource(Question, '/question/', '/question/<string:question_id>')
    api.add_resource(Category, '/category/<string:category_id>')
    api.add_resource(Categories, '/categories/')
    api.add_resource(Questions, '/questions/')

    if not env:
        env = app.config['ENV']
    app.config.from_object(configs[env])

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def catch_all(path):
        return render_template("index.html")

    @app.errorhandler(exceptions.APIException)
    def api_exceptions(e):
        return jsonify(e.json()), e.status_code

    return app
