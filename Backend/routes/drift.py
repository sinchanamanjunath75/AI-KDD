from flask import Blueprint, request, jsonify
from models.models import db, ChangeLog, Vote, DocDriftCheck
import json
import re
import os
from datetime import datetime
import google.generativeai as genai

drift_bp = Blueprint('drift', __name__)

def calculate_doc_drift(doc_content, update_content):
    """
    Compare existing documentation against a new update/changelog/ticket using Gemini AI.
    Identifies outdated sections and calculates a drift score.
    """
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        return _fallback_calculate_doc_drift(doc_content, update_content, "Error: GEMINI_API_KEY not configured in backend.")

    try:
        genai.configure(api_key=gemini_api_key)
        # Using gemini-1.5-flash as it's fast and effective for JSON tasks
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = f"""
You are an expert Documentation Intelligence Engine. Your task is to analyze an existing document against a new changelog or ticket and identify "Documentation Drift" (i.e., parts of the documentation that are now outdated, deprecated, or incorrect due to the new update).

Compare the following two texts:
--- EXISTING DOCUMENTATION ---
{doc_content}
--- NEW CHANGELOG / TICKET ---
{update_content}

Analyze the changes and output a JSON response with EXACTLY the following structure. Do not output markdown, only the JSON.

{{
  "score": (integer 0-100), // 0 means perfectly up-to-date, 100 means completely obsolete.
  "diagnosis": (string), // A 1-2 sentence high-level summary of the drift status (e.g., "Critical Drift: API endpoints migrated and old versions deprecated.")
  "flagged_sections": [ // List of specific issues found. Empty array if no issues.
    {{
      "type": (string), // e.g., "Version Mismatch", "Deprecated API", "Missing Configuration"
      "severity": (string), // "high", "medium", or "low"
      "detail": (string) // E.g., "The changelog mentions OAuth 2.0 but the docs still use Basic Auth."
    }}
  ]
}}
"""
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
            )
        )
        
        # Parse the JSON response
        result = json.loads(response.text)
        
        # Ensure score is within bounds
        score = max(0, min(100, int(result.get("score", 0))))
        diagnosis = result.get("diagnosis", "Unknown drift status.")
        flagged = result.get("flagged_sections", [])
        
        return score, diagnosis, flagged

    except Exception as e:
        print(f"Gemini API Error: {e}")
        return _fallback_calculate_doc_drift(doc_content, update_content, f"Gemini API failed: {str(e)[:100]}")

def _fallback_calculate_doc_drift(doc_content, update_content, error_msg):
    """Basic fallback algorithm if AI fails or key is missing."""
    score = 50
    diagnosis = f"Fallback Analysis: {error_msg}"
    flagged = [{
        "type": "AI Engine Unavailable",
        "severity": "medium",
        "detail": "Could not connect to Gemini API. Using basic algorithmic fallback."
    }]
    return score, diagnosis, flagged

@drift_bp.route('/api/drift/check', methods=['POST'])
def check_drift():
    """Compare existing documentation against a new update/changelog."""
    data = request.json
    if not data or 'doc_content' not in data or 'update_content' not in data:
        return jsonify({"error": "Both doc_content and update_content are required"}), 400
    
    user_email = data.get('user_email', 'anonymous')
    doc_title = data.get('doc_title', 'Untitled Document')
    
    score, diagnosis, flagged = calculate_doc_drift(data['doc_content'], data['update_content'])
    
    new_check = DocDriftCheck(
        user_email=user_email,
        doc_title=doc_title,
        doc_content=data['doc_content'],
        update_content=data['update_content'],
        score=score,
        diagnosis=diagnosis,
        flagged_sections=json.dumps(flagged),
        date=datetime.now().strftime("%Y-%m-%d %H:%M")
    )
    db.session.add(new_check)
    db.session.commit()
    
    return jsonify(new_check.to_dict()), 201


@drift_bp.route('/api/user/history', methods=['GET'])
def get_user_history():
    """Get a user's past documentation drift checks."""
    user_email = request.args.get('email')
    if not user_email:
        return jsonify([])
    checks = DocDriftCheck.query.filter_by(user_email=user_email).order_by(DocDriftCheck.id.desc()).all()
    return jsonify([c.to_dict() for c in checks])


@drift_bp.route('/api/updates', methods=['GET'])
def get_updates():
    """Get all changelogs/tickets/updates."""
    updates = ChangeLog.query.all()
    return jsonify([u.to_dict() for u in updates])


@drift_bp.route('/api/updates', methods=['POST'])
def create_update():
    """Create a new changelog/ticket entry."""
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    # Calculate impact score based on changelog content
    dummy_doc = "This is a placeholder document."
    drift_score, diagnosis, _ = calculate_doc_drift(dummy_doc, data.get('content', ''))
    
    new_update = ChangeLog(
        title=data.get('title'),
        category=data.get('category'),
        author=data.get('author'),
        date=data.get('date'),
        content=data.get('content'),
        upvotes=data.get('upvotes', 0),
        tags=json.dumps(data.get('tags', [])),
        drift_score=drift_score,
        diagnosis=diagnosis
    )
    db.session.add(new_update)
    db.session.commit()
    return jsonify(new_update.to_dict()), 201


@drift_bp.route('/api/updates/<int:update_id>/vote', methods=['PUT'])
def vote_update(update_id):
    """Vote on a changelog entry."""
    update = ChangeLog.query.get_or_404(update_id)
    data = request.json
    user_email = data.get('user_email')
    
    if data and 'upvotes' in data:
        update.upvotes = data['upvotes']
    else:
        update.upvotes += 1
        
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
    """Get aggregate documentation health statistics."""
    checks = DocDriftCheck.query.all()
    changelogs = ChangeLog.query.all()
    
    total_drift = sum([c.score for c in checks]) if checks else 0
    avg_drift = total_drift / len(checks) if checks else 0
    
    # Projection based on recent checks
    recent_checks = DocDriftCheck.query.order_by(DocDriftCheck.id.desc()).limit(5).all()
    recent_avg = sum([r.score for r in recent_checks]) / len(recent_checks) if recent_checks else avg_drift
    
    return jsonify({
        "avg_drift": round(avg_drift, 1),
        "critical_count": len([c for c in checks if c.score > 70]),
        "total_checks": len(checks),
        "total_changelogs": len(changelogs),
        "health_score": round(100 - avg_drift, 1),
        "recent_avg": round(recent_avg, 1)
    })
