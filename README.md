# BrainBuddy Flask Backend

A minimal, production-ready Flask backend for your BrainBuddy project with:

- User auth (register, login, logout, session)
- REST APIs
- File uploads (PDF, images)
- Contact form storage
- SQLite by default (switchable to MySQL/PostgreSQL via `SQLALCHEMY_DATABASE_URI`)
- CORS for frontend integration

## Quick Start

```bash
# 1) Create virtual env (recommended)
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 2) Install dependencies
pip install -r requirements.txt

# 3) Setup environment
cp .env.example .env
# Edit .env as needed (SECRET_KEY, DB URI, CORS_ORIGINS, etc.)

# 4) Initialize DB
flask --app app.py db init
flask --app app.py db migrate -m "init"
flask --app app.py db upgrade

# 5) Run
flask --app app.py run  # or: python app.py
```

## Endpoints (JSON)

Auth (session-based, uses cookies):
- `POST /auth/register` `{name, email, password}`
- `POST /auth/login` `{email, password}`
- `POST /auth/logout`
- `GET /auth/me`

Health:
- `GET /api/health`

Contact:
- `POST /api/contact` `{name, email, subject?, message}`

Reports (requires login):
- `POST /api/reports` (multipart/form-data) fields: `title`, `description?`, `file`
- `GET /api/reports`
- `GET /api/reports/<id>`
- `GET /api/reports/<id>/download`
- `DELETE /api/reports/<id>`

## Frontend Integration (fetch)

Make sure your frontend sends credentials if you’re on a different origin.

```js
// Login
fetch("http://localhost:5000/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ email, password })
});

// Upload report
const form = new FormData();
form.append("title", title);
form.append("description", description);
form.append("file", fileInput.files[0]);

fetch("http://localhost:5000/api/reports", {
  method: "POST",
  body: form,
  credentials: "include"
});
```

## Switching to MySQL/PostgreSQL

Edit `SQLALCHEMY_DATABASE_URI` in `.env`. Examples:
- MySQL: `mysql+pymysql://user:pass@localhost/brainbuddy`
- PostgreSQL: `postgresql+psycopg2://user:pass@localhost/brainbuddy`

Install the appropriate driver (e.g., `pymysql`, `psycopg2-binary`).

## Notes
- Allowed upload types: pdf, png, jpg, jpeg, gif, webp (configure in `api/routes.py`).
- Max upload size: set via `MAX_CONTENT_LENGTH_MB` in `.env`.
- CORS is enabled. Adjust `CORS_ORIGINS` for production.
