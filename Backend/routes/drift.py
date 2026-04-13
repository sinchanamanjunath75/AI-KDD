from flask import Blueprint, request, jsonify
from models.models import db, Update, Vote, DriftCheck
import json
import random
from datetime import datetime

drift_bp = Blueprint('drift', __name__)

def calculate_drift(content):
    # Core Logic: Simulate AI detection drift score (10-95%)
    score = random.randint(20, 80)
    
    # Simple keyword-based simulation
    keywords = {
        'hallucination': 15,
        'drift': 10,
        'outdated': 12,
        'gpt-4': 5,
        'gemini': 5,
        'cutoff': 10,
        'latency': -5
    }
    
    content_lower = content.lower()
    for kw, bonus in keywords.items():
        if kw in content_lower:
            score += bonus
            
    score = max(10, min(95, score))
    
    # Generate AI Diagnosis based on keywords/score
    if 'hallucination' in content_lower:
        diagnosis = "Hallucination Spike: Model generating unverified facts."
    elif 'outdated' in content_lower or 'cutoff' in content_lower:
        diagnosis = "Temporal Inconsistency: Model relying on pre-cutoff knowledge."
    elif score > 80:
        diagnosis = "Critical Semantic Decay: Core concepts are misaligned."
    elif score > 50:
        diagnosis = "Moderate Concept Drift: Subtle deviances in long context."
    else:
        diagnosis = "Stable Alignment: No significant drift detected."
        
    return score, diagnosis

@drift_bp.route('/api/drift/check', methods=['POST'])
def check_drift_on_demand():
    data = request.json
    if not data or 'content' not in data or 'model_name' not in data:
        return jsonify({"error": "Model name and content are required"}), 400
        
    user_email = data.get('user_email', 'anonymous')
    score, diagnosis = calculate_drift(data['content'])
    
    new_check = DriftCheck(
        user_email=user_email,
        model_name=data['model_name'],
        content=data['content'],
        score=score,
        diagnosis=diagnosis,
        date=datetime.now().strftime("%Y-%m-%d %H:%M")
    )
    db.session.add(new_check)
    db.session.commit()
    
    return jsonify(new_check.to_dict()), 201

@drift_bp.route('/api/user/history', methods=['GET'])
def get_user_history():
    user_email = request.args.get('email')
    if not user_email:
        return jsonify([])
    checks = DriftCheck.query.filter_by(user_email=user_email).order_by(DriftCheck.id.desc()).all()
    return jsonify([c.to_dict() for c in checks])

@drift_bp.route('/api/updates', methods=['GET'])
def get_updates():
    updates = Update.query.all()
    return jsonify([u.to_dict() for u in updates])

@drift_bp.route('/api/updates', methods=['POST'])
def create_update():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    drift, diagnosis = calculate_drift(data.get('content', ''))
    
    new_update = Update(
        title=data.get('title'),
        category=data.get('category'),
        author=data.get('author'),
        date=data.get('date'),
        content=data.get('content'),
        upvotes=data.get('upvotes', 0),
        tags=json.dumps(data.get('tags', [])),
        drift_score=drift,
        diagnosis=diagnosis
    )
    db.session.add(new_update)
    db.session.commit()
    return jsonify(new_update.to_dict()), 201

@drift_bp.route('/api/updates/<int:update_id>/vote', methods=['PUT'])
def vote_update(update_id):
    update = Update.query.get_or_404(update_id)
    data = request.json
    user_email = data.get('user_email')
    
    # Update vote count item
    if data and 'upvotes' in data:
        update.upvotes = data['upvotes']
    else:
        update.upvotes += 1
        
    # Record persistent vote if user is logged in
    if user_email:
        existing_vote = Vote.query.filter_by(user_email=user_email, update_id=update_id).first()
        if existing_vote:
            if data.get('remove', False):
                db.session.delete(existing_vote)
        else:
            new_vote = Vote(user_email=user_email, update_id=update_id)
            db.session.add(new_vote)
            
    db.session.commit()
    return jsonify(update.to_dict())

@drift_bp.route('/api/user/votes', methods=['GET'])
def get_user_votes():
    user_email = request.args.get('email')
    if not user_email:
        return jsonify([])
    votes = Vote.query.filter_by(user_email=user_email).all()
    return jsonify([v.update_id for v in votes])

@drift_bp.route('/api/analytics/summary', methods=['GET'])
def get_analytics_summary():
    updates = Update.query.all()
    models = [u.title.split(' ')[0] for u in updates]
    
    # Calculate avg drift
    total_drift = sum([u.drift_score for u in updates]) if updates else 0
    avg_drift = total_drift / len(updates) if updates else 0
    
    # Simple Projection logic: 
    # If the last 3 updates have increasing drift, projection is higher.
    recent_updates = Update.query.order_by(Update.id.desc()).limit(3).all()
    recent_avg = sum([r.drift_score for r in recent_updates]) / len(recent_updates) if recent_updates else avg_drift
    slope = (recent_avg - avg_drift) * 0.5
    
    projections = []
    for i in range(1, 8):
        projected_val = min(99, max(10, recent_avg + (slope * i) + random.randint(-2, 2)))
        projections.append(round(projected_val, 1))
        
    return jsonify({
        "avg_drift": round(avg_drift, 1),
        "critical_count": len([u for u in updates if u.drift_score > 80]),
        "total_updates": len(updates),
        "projections": projections,
        "health_score": round(100 - avg_drift, 1)
    })
