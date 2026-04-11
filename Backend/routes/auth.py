from flask import Blueprint, request, jsonify

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/login', methods=['POST'])
def login():
    # Simple mock login
    return jsonify({ "name": "Admin", "isLoggedIn": True })

@auth_bp.route('/api/signup', methods=['POST'])
def signup():
    # Simple mock signup
    return jsonify({ "name": "Admin", "isLoggedIn": True })
