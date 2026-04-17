from flask_sqlalchemy import SQLAlchemy
import json

db = SQLAlchemy()

class Update(db.Model):
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
            "drift": self.drift_score,
            "diagnosis": self.diagnosis
        }

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), default='healthy')
    version = db.Column(db.String(50))
    last_updated = db.Column(db.String(50))
    drift_score = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "status": self.status,
            "version": self.version,
            "last_updated": self.last_updated,
            "drift_score": self.drift_score
        }

class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(100), nullable=False)
    update_id = db.Column(db.Integer, db.ForeignKey('update.id'), nullable=False)

class DriftCheck(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(100), nullable=False)
    model_name = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    reference_content = db.Column(db.Text, nullable=True)
    score = db.Column(db.Integer, nullable=False)
    diagnosis = db.Column(db.String(255), nullable=False)
    date = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "user_email": self.user_email,
            "model_name": self.model_name,
            "content": self.content,
            "reference_content": self.reference_content,
            "score": self.score,
            "diagnosis": self.diagnosis,
            "date": self.date
        }

class AIModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    health = db.Column(db.String(50), default='good')
    version = db.Column(db.String(50), default='1.0')
    tokens = db.Column(db.String(100), default='Unknown')
    drift = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "health": self.health,
            "version": self.version,
            "tokens": self.tokens,
            "drift": self.drift
        }
