from flask import Flask, render_template

from server.config import configs

def create_app(env = None):
    app = Flask(
        __name__,
        static_folder="./../dist/static",
        template_folder="./../dist"
    )

    if not env:
        env = app.config['ENV']
    app.config.from_object(configs[env])

    @app.shell_context_processor
    def shell_context():
        pass

    with app.app_context():
        #noinspection PyUnresolvedReferences
        from server import api

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def catch_all(path):
        return render_template("index.html")

    return app
