from flask import Flask
from flask_cors import CORS
from models.models import db, Update, AIModel
from routes.drift import drift_bp
from routes.auth import auth_bp
from routes.models_routes import models_bp
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# ===== DATABASE CONFIG =====
basedir = os.path.abspath(os.path.dirname(__file__))

db_url = os.getenv("DATABASE_URL")

if db_url and db_url.strip() != "":
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
    print("✅ Using Supabase")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'drift.db')
    print("⚠️ Using SQLite")

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# ===== ROUTES =====
app.register_blueprint(drift_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(models_bp)

# ===== RUN =====
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)