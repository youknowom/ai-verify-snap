# Deployment Guide

## Prerequisites
- Docker & Docker Compose
- A PostgreSQL database (or Neon/Supabase)
- Stripe API Keys
- Google OAuth Client ID & Secret
- SerpAPI Key

## Environment Setup
Copy `.env.example` to `.env` in the root directory and populate all variables.

## Running with Docker Compose (Local / VPS)
The entire stack can be launched using Docker Compose.
```bash
docker-compose up --build -d
```
The services will be exposed on:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- ML Service: `http://localhost:8000`

## Production Deployment (PaaS)
We recommend separating the services for high availability:
1. **Frontend**: Deploy on **Vercel**. Set `NEXT_PUBLIC_API_URL` to point to your backend.
2. **Backend**: Deploy on **Render**, **Railway**, or **AWS App Runner** using the provided `Dockerfile`. Set `ML_SERVICE_URL` to point to your Python service, and `DB_URL` to your managed Postgres DB.
3. **ML Service**: Deploy on **Render**, **Railway**, or **AWS ECS** using the provided `Dockerfile`. Ensure `SERP_API_KEY` is provided.
