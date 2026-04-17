from app import app
from models.models import db, AIModel, Update
import json

def seed():
    with app.app_context():
        # Clear existing
        db.drop_all()
        db.create_all()

        # Add Models
        models = [
            AIModel(name="GPT-4o", health="excellent", version="May 2024", tokens="128k", drift=12),
            AIModel(name="Claude 3.5 Sonnet", health="excellent", version="June 2024", tokens="200k", drift=8),
            AIModel(name="Gemini 1.5 Pro", health="good", version="April 2024", tokens="1M", drift=15),
            AIModel(name="GPT-3.5 Turbo", health="legacy", version="2022", tokens="16k", drift=85),
        ]
        db.session.add_all(models)

        # Add Updates (Signals) that should trigger drift in DEFAULT_DOCUMENTS
        updates = [
            Update(
                title="OAuth2 Migration Mandatory",
                category="Security",
                author="Security Team",
                date="2026-04-10",
                content="We are migrating from legacy auth to oauth2. All legacy auth connections will be deprecated next month.",
                tags=json.dumps(["auth", "migration"]),
                drift_score=88,
                diagnosis="Critical: Legacy auth is being removed."
            ),
            Update(
                title="Python 3.12 Support",
                category="Runtime",
                author="DevOps",
                date="2026-04-12",
                content="Production environment is being upgraded from python 3.10 to python 3.12. Please update your local runners.",
                tags=json.dumps(["python", "upgrade"]),
                drift_score=45,
                diagnosis="Warning: Runtime version mismatch."
            ),
            Update(
                title="V2 Endpoint Release",
                category="API",
                author="Backend Eng",
                date="2026-04-15",
                content="The old endpoint is now legacy. Please use the v2 endpoint for all new integrations.",
                tags=json.dumps(["api", "v2"]),
                drift_score=92,
                diagnosis="High: Endpoint deprecation."
            ),
            Update(
                title="Infrastructure Automation",
                category="DevOps",
                author="Platform Team",
                date="2026-04-16",
                content="Manual deployment is replaced by our new ci/cd pipeline. Documentation must be updated.",
                tags=json.dumps(["automation", "ci/cd"]),
                drift_score=70,
                diagnosis="Process change: Manual steps removed."
            )
        ]
        db.session.add_all(updates)
        db.session.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    seed()
