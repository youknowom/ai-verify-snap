# AI Verify Snap Architecture

## Overview
AI Verify Snap is a three-tier microservice architecture designed to detect AI-generated and tampered images.

### Services
1. **Frontend** (Next.js 16 + React 19)
   - Handles UI, NextAuth authentication, payment flow UI.
2. **Backend** (Spring Boot 3 + Java 17)
   - Handles user persistence, Stripe webhook handling, database interactions.
3. **ML Service** (Python 3.10 + FastAPI)
   - Runs inference using a custom ResNet18 + ELA fusion model.
   - Falls back to HuggingFace SigLIP if the custom checkpoint is missing.
   - Requires CUDA/GPU for optimal performance.

## Security 
- **CORS**: Strictly enforced via environment variables (`CORS_ALLOWED_ORIGINS`).
- **Secrets**: Handled via `.env`. Services crash on startup if critical secrets (like `SERP_API_KEY` or `STRIPE_SECRET_KEY`) are missing.
- **File Validation**: Strict magic byte verification and payload size limitation in the ML service.
