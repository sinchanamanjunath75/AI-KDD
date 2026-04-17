from flask import Blueprint, request, jsonify
from models.models import db, Update, Vote, DriftCheck
import json
import random
import re
from datetime import datetime

drift_bp = Blueprint('drift', __name__)

CHANGE_TERMS = {"deprecated", "removed", "renamed", "migrated", "changed", "updated", "replaced"}
TERM_REPLACEMENTS = {
    "gpt-3.5": "gpt-4o",
    "legacy auth": "oauth2",
    "manual deployment": "ci/cd pipeline",
    "python 3.10": "python 3.12",
    "old endpoint": "v2 endpoint"
}

def calculate_drift(content):
    """
    Simulates advanced AI analysis of knowledge drift using semantic markers 
    and heuristic evaluation of content stale-ness.
    """
    content_lower = content.lower()
    score = random.randint(15, 45) # Base noise
    
    # Semantic Drift Indicators
    indicators = [
        (r"gpt-3\.5|legacy|deprecated|old version", 25, "Found references to deprecated infrastructure."),
        (r"manual deployment|handover|ftp|zip upload", 15, "Content suggests outdated deployment practices."),
        (r"cutoff|pre-2022|old data", 20, "Temporal inconsistency: Model relies on pre-cutoff knowledge."),
        (r"hallucination|incorrect|false|unverified", 30, "Low-level semantic decay: Model is generating unverified facts."),
        (r"python 3\.[0-9]\s|java 8|node 12", 15, "Runtime version mismatch: Content references EOL software."),
        (r"slow|latency|bottleneck", 5, "Performance degradation reported."),
        (r"drift|alignment|decay", 10, "Explicit drift markers detected in trace.")
    ]
    
    findings = []
    for pattern, weight, diagnosis in indicators:
        if re.search(pattern, content_lower):
            score += weight
            findings.append(diagnosis)
            
    score = max(5, min(98, score))
    
    # Generate Sophisticated Diagnosis
    if score > 85:
        primary = "CRITICAL NEURAL DRIFT: Core concepts have undergone significant semantic shift."
    elif score > 60:
        primary = "MODERATE CONCEPT DECAY: Knowledge base is beginning to diverge from source truth."
    elif score > 35:
        primary = "MINOR ALIGNMENT VARIANCE: Subtle inaccuracies detected in long-context retrieval."
    else:
        primary = "OPTIMAL SYNC: Model response remains tightly aligned with latest documentation."
        
    final_diagnosis = f"{primary} {' | '.join(findings[:2])}" if findings else primary
    return score, final_diagnosis

def _normalize_text(text):
    return (text or "").lower()

def _extract_tokens(text):
    return set(re.findall(r"[a-zA-Z0-9\-]{4,}", _normalize_text(text)))

def _build_signal_text(signal):
    return f"{signal.get('title', '')} {signal.get('content', '')}"

def _analyze_document_consistency(doc, signals):
    doc_text = _normalize_text(doc.get("content", ""))
    doc_tokens = _extract_tokens(doc_text)
    doc_section = doc.get("section", "General")
    matched_signals = []
    evidence = []
    gaps = []
    risk = 0

    for signal in signals:
        signal_text = _normalize_text(_build_signal_text(signal))
        signal_tokens = _extract_tokens(signal_text)
        overlap = doc_tokens.intersection(signal_tokens)

        # Relevant if it overlaps, or if the signal clearly indicates a change event.
        signal_has_change_term = any(term in signal_text for term in CHANGE_TERMS)
        if len(overlap) >= 2 or signal_has_change_term:
            matched_signals.append(signal)

            if signal_has_change_term and len(overlap) >= 1:
                risk += 16
                evidence.append(
                    f"Change signal \"{signal.get('title', 'Untitled update')}\" overlaps with section \"{doc_section}\"."
                )

            for deprecated_term, replacement_term in TERM_REPLACEMENTS.items():
                if deprecated_term in doc_text and replacement_term in signal_text:
                    risk += 28
                    gaps.append(
                        f"Document still references \"{deprecated_term}\" while updates mention \"{replacement_term}\"."
                    )

    if not matched_signals:
        return None

    # Additional heuristics for stale content.
    if "todo" in doc_text or "tbd" in doc_text:
        risk += 10
        gaps.append("Section contains placeholders (TODO/TBD), which can indicate incomplete documentation.")

    risk = max(0, min(100, risk))
    is_flagged = risk >= 35 or len(gaps) > 0

    if not is_flagged:
        return None

    top_signal_titles = [s.get("title", "Untitled update") for s in matched_signals[:2]]
    recommendation = (
        f"Review section \"{doc_section}\" against recent changes ({', '.join(top_signal_titles)}). "
        "Update terminology, version references, and process steps to match current behavior."
    )

    return {
        "document_id": doc.get("id"),
        "document_title": doc.get("title", "Untitled document"),
        "section": doc_section,
        "risk_score": risk,
        "evidence": evidence[:3],
        "gaps": gaps[:3],
        "matched_signals": [
            {
                "id": s.get("id"),
                "type": s.get("type", "update"),
                "title": s.get("title", "Untitled update"),
                "date": s.get("date")
            }
            for s in matched_signals[:5]
        ],
        "suggested_update": recommendation
    }

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

@drift_bp.route('/api/docs/consistency-check', methods=['POST'])
def docs_consistency_check():
    data = request.json or {}
    documents = data.get("documents", [])
    signals = data.get("signals", [])

    if not isinstance(documents, list) or not isinstance(signals, list):
        return jsonify({"error": "documents and signals must both be arrays"}), 400

    if len(documents) == 0:
        return jsonify({
            "summary": {
                "total_documents": 0,
                "signals_compared": len(signals),
                "flagged_documents": 0,
                "average_risk": 0
            },
            "flagged": []
        })

    flagged = []
    for doc in documents:
        if not isinstance(doc, dict):
            continue
        result = _analyze_document_consistency(doc, signals)
        if result:
            flagged.append(result)

    average_risk = round(sum(item["risk_score"] for item in flagged) / len(flagged), 1) if flagged else 0
    return jsonify({
        "summary": {
            "total_documents": len(documents),
            "signals_compared": len(signals),
            "flagged_documents": len(flagged),
            "average_risk": average_risk
        },
        "flagged": sorted(flagged, key=lambda x: x["risk_score"], reverse=True)
    })
