# StockFlow Deployment Instructions

## Overview
StockFlow is a fully containerized full-stack application.

## Local Development (Docker Compose)
To run the entire stack locally:
```bash
# Rename .env.example to .env
cp .env.example .env

# Build and start services
docker compose up --build
```
This will start:
- Frontend at http://localhost:3000
- Backend API at http://localhost:8000
- PostgreSQL database at port 5432

## Production Deployment

### Backend (Render / Railway / Fly.io)
1. **Database**: Provision a managed PostgreSQL instance and obtain the `DATABASE_URL`.
2. **Environment Variables**:
   - `DATABASE_URL`: `postgresql://user:password@host:port/dbname`
   - `SECRET_KEY`: A strong random string for JWT signing
   - `ALGORITHM`: `HS256`
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: `1440`
3. **Deployment**:
   - Connect your GitHub repository to Render/Railway.
   - Choose the `backend` directory.
   - Set the build command (if not using Docker): `pip install -r requirements.txt`
   - Set the start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Alternatively, deploy the provided `backend/Dockerfile`.

### Frontend (Vercel / Netlify)
1. **Environment Variables**:
   - `VITE_API_URL`: The deployed URL of your backend API (e.g., `https://stockflow-api.onrender.com`)
2. **Deployment**:
   - Connect your GitHub repository to Vercel/Netlify.
   - Root directory: `frontend`
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
