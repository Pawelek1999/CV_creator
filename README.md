# CV Generator

A web application for generating a CV from JSON data: paste/edit your data,
the app renders a polished, formatted CV (two-column layout — dark blue
sidebar + white main column), automatically fits the content onto a single
A4 page, and exports it to PDF.

Intended workflow: paste a job posting plus your skills/experience database
into an AI chat → the AI tailors and generates JSON in the matching schema →
paste the JSON into the app → download a PDF ready to send.

## Features

- Edit your CV by pasting/editing JSON, with a live preview
- Save multiple CV versions through the backend (SQLite + FastAPI)
- Automatic single-page A4 fit (shrinks font size in the 11–9pt range, with
  a warning when the content still doesn't fit)
- PDF export (`window.print()` + `@media print` styles)

## Tech stack

| Layer      | Technology                                       |
| ---------- | ------------------------------------------------- |
| Frontend   | React, TypeScript, Tailwind CSS, Vite, React Router |
| Backend    | Python, FastAPI, SQLAlchemy, Alembic               |
| Database   | SQLite                                             |
| PDF        | `window.print()` + CSS `@media print`              |

## Running locally

### Backend

```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

The backend starts at `http://localhost:8000` (API docs at `/docs`).

### Frontend

```
cd frontend
npm install
copy .env.example .env
npm run dev
```

The frontend starts at `http://localhost:5173` and talks to the backend via
the address in `VITE_API_BASE_URL` (defaults to `http://localhost:8000`).

## Running with Docker

```
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000` (API docs at `/docs`)

The backend container runs `alembic upgrade head` on every startup, which
creates the SQLite database (and applies any pending migrations) if it
doesn't exist yet, or does nothing if it's already up to date. The database
file lives in the `backend_data` named volume, so data survives container
restarts and rebuilds — use `docker compose down -v` to wipe it.

## Project structure

```
backend/    FastAPI + SQLAlchemy, layers: routers → services → repositories → models
frontend/   React + Vite, CV components in src/components/cv/
Cv_content/ Example CV data template (cv-data.example.json)
```

The backend follows a layered architecture: `router` (HTTP handling) →
`service` (business logic) → `repository` (database queries) → `model`
(SQLAlchemy) / `schema` (Pydantic, validation).

## CV data schema

A full example JSON matching the schema lives in
[`Cv_content/cv-data.example.json`](Cv_content/cv-data.example.json) — the
same demo (with generic placeholder data) is bundled into the app as the
starting point when creating a new CV.

Top-level structure: `personalInfo`, `summary`, `experience[]`, `education[]`,
`certifications[]`, `skills[]`, `languages[]`, `interests[]`.

## Tests

```
cd backend
venv\Scripts\python.exe -m pytest -q
```
