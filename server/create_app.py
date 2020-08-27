from flask import Flask, render_template
from flask_restful import Api

from server.config import configs


def create_app(env=None):
    app = Flask(
        __name__,
        static_folder="./../dist/static",
        template_folder="./../dist"
    )

    # Instantiate Flask-Restful API and register appropriate routes
    from server.api import Question, Category, Categories
    api = Api(app, prefix='/api/')
    api.add_resource(Question, '/question/', '/question/<string:question_id>')
    api.add_resource(Category, '/category/<string:category_id>')
    api.add_resource(Categories, '/categories/')

    if not env:
        env = app.config['ENV']
    app.config.from_object(configs[env])

    # @app.shell_context_processor
    # def shell_context():
    #     pass

    with app.app_context():
        # noinspection PyUnresolvedReferences
        from server import api

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def catch_all(path):
        return render_template("index.html")

    return app
