from flask import Blueprint, request, jsonify
from models.models import db, AIModel

models_bp = Blueprint('models', __name__)

@models_bp.route('/api/models', methods=['GET'])
def get_models():
    models = AIModel.query.all()
    return jsonify([m.to_dict() for m in models])

@models_bp.route('/api/models', methods=['POST'])
def add_model():
    data = request.json
    if not data or 'name' not in data:
        return jsonify({"error": "Model name is required"}), 400
        
    new_model = AIModel(
        name=data['name'],
        health=data.get('health', 'good'),
        version=data.get('version', '1.0'),
        tokens=data.get('tokens', 'Unknown'),
        drift=data.get('drift', 0)
    )
    db.session.add(new_model)
    db.session.commit()
    return jsonify(new_model.to_dict()), 201
