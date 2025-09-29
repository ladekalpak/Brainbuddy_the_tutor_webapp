from flask import Flask
from .extensions import db, migrate, login_manager, bcrypt, csrf, cors
from config import get_config
from .models import User
import os

def create_app():
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object(get_config())

    # Ensure upload folder exists
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # Init extensions
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    csrf.init_app(app)
    cors.init_app(app, origins=app.config.get("CORS_ORIGINS", "*"), supports_credentials=True)

    login_manager.init_app(app)
    login_manager.login_view = "auth.login"
    login_manager.login_message = "Please log in to access this resource."

    from .auth.routes import auth_bp
    from .api.routes import api_bp
    from .main.routes import main_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(api_bp, url_prefix="/api")
    app.register_blueprint(main_bp)

    @app.route("/")
    def index():
        return {"app": "BrainBuddy Flask API", "status": "ok"}

    return app
