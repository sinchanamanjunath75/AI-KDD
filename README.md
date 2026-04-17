# DRIFT.AI — Documentation Drift Intelligence

DRIFT.AI is a platform that continuously checks for outdated or inconsistent documentation. By comparing existing documents with new tickets, change logs, and updates, the AI flags sections that no longer match reality and suggests updates — helping organizations maintain accurate and trustworthy knowledge bases over time.

## 🚀 Key Features

- **On-Demand Doc Scanner**: Submit existing documentation alongside a new update/ticket to instantly detect drift.
- **Flagged Sections**: AI identifies specific issues like version mismatches, deprecated references, API changes, and stale configurations.
- **Historical Trend Analytics**: Track documentation staleness over time with dynamic **Recharts** visualizations.
- **Cloud-Persistence Layer**: Production-ready **Supabase (PostgreSQL)** integration for secure, global data storage.
- **Scan History & Export**: Full scan history with CSV/JSON report exporting from your profile.
- **Premium Glassmorphism UI**: State-of-the-art dark-noir aesthetics optimized for performance and accessibility.

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph Frontend [React Intelligence Layer]
        A[Dashboard] -->|Vite/React| B[Doc Scanner]
        A -->|Recharts| C[Drift Timeline]
        D[User Profile] -->|CSV Engine| E[Drift Report]
    end

    subgraph Backend [Python Analysis Engine]
        F[Flask API] -->|SQLAlchemy| G[(Supabase Cloud DB)]
        F -->|Logic| H[Document Comparison Engine]
    end

    A <-->|REST / JSON| F
```

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Recharts, Vanilla CSS (Design Tokens).
- **Backend**: Python 3.10+, Flask, SQLAlchemy, Flask-CORS.
- **Database**: Supabase PostgreSQL (or local SQLite).
- **Visuals**: SVG Animations, CSS Grid/Flexbox (Responsive Architecture).

## 🌍 Getting Started

### 1. Backend Setup
```bash
cd Backend
pip3 install -r requirements.txt
python3 app.py
```

### 2. Frontend Setup
```bash
cd drift-ai
npm install
npm run dev
```

### 3. Database Configuration (Optional)
For cloud persistence, create a `.env` in the `Backend/` directory:
```env
DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres
```

### 4. Verification
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend Health**: [http://localhost:5000/](http://localhost:5000/)

## 📥 Input Format

### Primary Input — `POST /api/drift/check`

```json
{
  "doc_title": "API Authentication Guide v2.1",
  "doc_content": "To authenticate, use the /api/v1/auth endpoint with your API key...",
  "update_content": "TICKET-4521: Migrated authentication to OAuth 2.0. Deprecated /api/v1/auth.",
  "user_email": "user@example.com"
}
```

| Field | Required | Description |
|---|---|---|
| `doc_title` | Optional | Name of the document being checked |
| `doc_content` | ✅ Yes | The existing documentation text |
| `update_content` | ✅ Yes | The new changelog, ticket, or update to compare against |
| `user_email` | Optional | For linking results to user history |

### Response

```json
{
  "score": 72,
  "diagnosis": "Moderate Drift: Several sections are stale and should be updated soon.",
  "flagged_sections": [
    { "type": "Version Mismatch", "severity": "high", "detail": "New versions detected..." },
    { "type": "Outdated API Reference", "severity": "high", "detail": "Documentation references endpoints that may be removed..." }
  ]
}
```

---
© 2026 DRIFT.AI — Documentation Intelligence Platform
