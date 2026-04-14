from flask_sqlalchemy import SQLAlchemy
import json

db = SQLAlchemy()

class ChangeLog(db.Model):
    """Stores changelogs, tickets, and updates that serve as the source of truth."""
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(50), nullable=False)
    content = db.Column(db.Text, nullable=False)
    upvotes = db.Column(db.Integer, default=0)
    tags = db.Column(db.Text)  # Stored as JSON string
    drift_score = db.Column(db.Integer)
    diagnosis = db.Column(db.String(255))

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "category": self.category,
            "author": self.author,
            "date": self.date,
            "content": self.content,
            "upvotes": self.upvotes,
            "tags": json.loads(self.tags) if self.tags else [],
            "drift_score": self.drift_score,
            "diagnosis": self.diagnosis
        }

class KnowledgeBase(db.Model):
    """Stores knowledge base / document repository entries."""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), default='current')
    doc_count = db.Column(db.Integer, default=0)
    last_checked = db.Column(db.String(50))
    avg_drift = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "status": self.status,
            "doc_count": self.doc_count,
            "last_checked": self.last_checked,
            "avg_drift": self.avg_drift
        }

class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(100), nullable=False)
    update_id = db.Column(db.Integer, db.ForeignKey('change_log.id'), nullable=False)

class DocDriftCheck(db.Model):
    """Stores the result of comparing a document against an update/changelog."""
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(100), nullable=False)
    doc_title = db.Column(db.String(255), nullable=False)
    doc_content = db.Column(db.Text, nullable=False)
    update_content = db.Column(db.Text, nullable=False)
    score = db.Column(db.Integer, nullable=False)
    diagnosis = db.Column(db.String(500), nullable=False)
    flagged_sections = db.Column(db.Text)  # JSON list of flagged items
    date = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "user_email": self.user_email,
            "doc_title": self.doc_title,
            "doc_content": self.doc_content,
            "update_content": self.update_content,
            "score": self.score,
            "diagnosis": self.diagnosis,
            "flagged_sections": json.loads(self.flagged_sections) if self.flagged_sections else [],
            "date": self.date
        }
