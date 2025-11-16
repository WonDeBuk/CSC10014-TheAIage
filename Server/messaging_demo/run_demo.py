# Server/messaging_demo/run_demo.py
from flask import Flask
from flask_cors import CORS
from .routes import messaging_bp

def create_demo_app():
    app = Flask(__name__, static_folder=None)
    # secret_key for session (dev only)
    app.secret_key = "dev-secret-change-me"
    app.config.update({
        "SESSION_COOKIE_SAMESITE": "Lax",
        "SESSION_COOKIE_SECURE": False,
    })
    # allow your frontend origin and support credentials
    CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://localhost:3000"])
    app.register_blueprint(messaging_bp)
    return app

if __name__ == "__main__":
    app = create_demo_app()
    app.run(host="127.0.0.1", port=5000, debug=True)
