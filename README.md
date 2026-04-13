# DRIFT.AI — Adaptive Neural Drift Intelligence

DRIFT.AI is a high-performance, specialized monitoring platform designed for real-time **Neural Drift Detection** in Large Language Models (LLMs). It transforms model output analysis from a manual task into a data-driven intelligence workflow, enabling users to track semantic decay, hallucination spikes, and temporal inconsistencies with precision.

## 🚀 Key Features

- **On-Demand Drift Checker**: Interactive interface for submitting model traces for instant health analysis.
- **Historical Trend Analytics**: Dynamic time-series visualization using **Recharts** to track model reliability.
- **Cloud-Persistence Layer**: Production-ready **Supabase (PostgreSQL)** integration for secure, global data storage.
- **Personal Intel Cockpit**: Responsive User Profile with full analysis history and CSV/JSON report exporting.
- **Premium Glassmorphism UI**: State-of-the-art dark-noir aesthetics optimized for performance and accessibility.
- **Autonomous Backend**: Python Flask API with standardized REST endpoints and automated database orchestration.

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph Frontend [React Intelligence Layer]
        A[Dashboard] -->|Vite/React| B[Model Checker]
        A -->|Recharts| C[History Analytics]
        D[User Profile] -->|CSV Engine| E[Intel Report]
    end

    subgraph Backend [Python Analysis Engine]
        F[Flask API] -->|SQLAlchemy| G[(Supabase Cloud DB)]
        F -->|Logic| H[Drift Calculation Engine]
    end

    A <-->|REST / JSON| F
```

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Recharts, Vanilla CSS (Design Tokens).
- **Backend**: Python 3.10+, Flask, SQLAlchemy, Flask-CORS.
- **Database**: Supabase PostgreSQL.
- **Visuals**: Three.js (3D Globe), CSS Grid/Flexbox (Responsive Architecture).

## 🌍 Getting Started

### 1. Unified Mission Launch
The platform is hardened for Windows environments. Use the unified bootstrapper:
```powershell
./run_all.ps1
```

### 2. Manual Configuration
Ensure your `.env` in the `Backend/` directory is configured with your Supabase credentials:
```env
DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres
```

### 3. Verification
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend Health**: [http://localhost:5000/api/](http://localhost:5000/api/)

## 📜 Intellectual History & Compliance
DRIFT.AI uses standardized semantic evaluation metrics to simulate drift detection. The platform is designed for enterprise scalability and can be integrated with real-world LLM APIs (OpenAI, Anthropic, Gemini) for live production monitoring.

---
© 2026 DRIFT.AI Intelligence Systems — Advanced Neural Monitoring Solutions
