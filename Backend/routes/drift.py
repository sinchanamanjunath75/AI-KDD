from flask import Blueprint, request, jsonify
from models.models import db, ChangeLog, Vote, DocDriftCheck
import json
<<<<<<< HEAD
import random
import re
=======
import re
import os
>>>>>>> 93b2a3ad1d7cfa9a1a76a252987dac2a41eb744f
from datetime import datetime
import google.generativeai as genai

drift_bp = Blueprint('drift', __name__)

<<<<<<< HEAD
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
=======
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
>>>>>>> 93b2a3ad1d7cfa9a1a76a252987dac2a41eb744f

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
