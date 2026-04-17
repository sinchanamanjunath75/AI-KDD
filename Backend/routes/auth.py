from flask import Blueprint, request, jsonify

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.json or {}
    return jsonify({ 
        "name": data.get("name", data.get("email", "User").split("@")[0].title()),
        "email": data.get("email", "user@drift.ai"),
        "isLoggedIn": True 
    })

@auth_bp.route('/api/signup', methods=['POST'])
def signup():
    data = request.json or {}
    return jsonify({ 
        "name": data.get("name", "User"),
        "email": data.get("email", "user@drift.ai"),
        "isLoggedIn": True 
    })
