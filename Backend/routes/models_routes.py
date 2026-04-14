from flask import Blueprint, request, jsonify
from models.models import db, KnowledgeBase
from datetime import datetime

models_bp = Blueprint('models', __name__)

@models_bp.route('/api/knowledge-bases', methods=['GET'])
def get_knowledge_bases():
    """Get all registered knowledge bases."""
    kbs = KnowledgeBase.query.all()
    return jsonify([kb.to_dict() for kb in kbs])

@models_bp.route('/api/knowledge-bases', methods=['POST'])
def add_knowledge_base():
    """Register a new knowledge base."""
    data = request.json
    if not data or 'name' not in data:
        return jsonify({"error": "Knowledge base name is required"}), 400
        
    new_kb = KnowledgeBase(
        name=data['name'],
        status=data.get('status', 'current'),
        doc_count=data.get('doc_count', 0),
        last_checked=datetime.now().strftime("%Y-%m-%d %H:%M"),
        avg_drift=data.get('avg_drift', 0)
    )
    db.session.add(new_kb)
    db.session.commit()
    return jsonify(new_kb.to_dict()), 201
