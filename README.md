<div align="center">
  <h1 style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 3.5rem; font-weight: 800; letter-spacing: -0.05em; color: #E65100; margin-bottom: 20px;">
    AI Verify Snap
  </h1>

  <img src="./banner.png" alt="AI Verify Snap Banner" width="800" style="border-radius: 12px; margin-top: 10px;" />
</div>

<br />

## 🌟 Project Summary

**AI Verify Snap** is a state-of-the-art deepfake detection and digital forensics platform designed to verify the authenticity of digital media. As visual misinformation becomes increasingly sophisticated, this platform serves as a reliable tool to detect synthetic modifications, deepfakes, and manipulated imagery.

By analyzing forensic artifacts through **Error Level Analysis (ELA)** and advanced **Machine Learning** models, the platform identifies hidden pixel-level inconsistencies that are invisible to the naked eye. Users can securely upload images to run deep scans, view detailed visual analysis, and generate comprehensive, downloadable forensic reports.

Built with a focus on speed, accuracy, and a premium user experience, AI Verify Snap empowers individuals and organizations to trust their digital content in an era of AI-generated media.

---

## 🏗️ System Architecture

AI Verify Snap employs a modern, 3-tier microservice architecture:

```
                  ┌────────────────────────┐
                  │   Next.js Frontend     │ (Port 3000)
                  │ (React, Tailwind, Auth)│
                  └───────────┬────────────┘
                              │ HTTPS REST
                              ▼
                  ┌────────────────────────┐
                  │  Spring Boot Backend   │ (Port 8080)
                  │ (Java 17, JPA, WebFlux)│
                  └─────┬──────────────┬───┘
      PostgreSQL        │              │ HTTP Multipart
      (Neon/Local)      ▼              ▼
     ┌───────────┐    ┌───┴──────────┐┌┴──────────────────────┐
     │ Database  │    │ Google Auth  ││  FastAPI ML Service  │ (Port 8000)
     │   (DB)    │    │ (Third Party)││(PyTorch, ResNet+ELA) │
     └───────────┘    └──────────────┘└───────────────────────┘
```

1. **Frontend (Next.js 16)**: A client-facing SPA with a custom visual system built using Tailwind CSS and Radix UI. Leverages NextAuth.js (Google OAuth) for secure user authentication.
2. **Backend (Spring Boot 3.2.2)**: Orchestrates database transactions, maps results, syncs user sessions, and proxies media analysis requests to the ML service.
3. **ML Service (FastAPI)**: Runs dual-stream PyTorch inference (using ResNet18 and ELA CNN streams) with automated JET-colormap error heatmaps and SerpAPI Google Lens visual match fallbacks.

---

## 🚀 Quick Start (Docker Compose)

The easiest way to run the entire stack locally is by using Docker Compose.

### Prerequisites

Ensure you have [Docker](https://www.docker.com/) and Docker Compose installed.

### Setup Steps

1. **Configure Environment Variables**:
   Create a `.env` file in the root of the repository matching the parameters of the `.env.example` files:
   ```bash
   DB_PASSWORD=your_secure_password
   SERP_API_KEY=your_serpapi_key
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

2. **Start the Infrastructure**:
   Run the following command to build and launch all containers:
   ```bash
   docker-compose up --build
   ```

3. **Access the Application**:
   * **Frontend**: `http://localhost:3000`
   * **Backend REST API**: `http://localhost:8080`
   * **Swagger API Documentation**: `http://localhost:8080/swagger-ui.html`
   * **ML Service Layer**: `http://localhost:8000`

---

## 🛠️ Manual Services Setup

If you prefer to run services individually:

### 1. ML Detection Layer (Python)
```bash
cd ML_Service
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
* Runs on `http://localhost:8000`

### 2. Forensic API Gateway (Spring Boot)
Ensure you have JDK 17 and Maven 3.9+ installed:
```bash
cd backend
# Set your environment variables (DB_URL, DB_USERNAME, DB_PASSWORD)
mvn clean spring-boot:run -Dspring-boot.run.profiles=dev
```
* Runs on `http://localhost:8080`

### 3. Forensic Console (Next.js)
Ensure you have Node.js 20+ installed:
```bash
cd frontend
npm install
npm run dev
```
* Runs on `http://localhost:3000`

---

## 🛡️ Security Hardening & Best Practices

This repository follows production-grade security practices:
* **No Committed Secrets**: Environment variables are parameterized via `.env` files.
* **Bounded CORS**: Pre-flight checks restrict requests to authenticated clients.
* **Hibernate Safe Defaults**: Production profile (`application-prod.yml`) enforces `ddl-auto: validate` to prevent dynamic schema mutations.
* **Safe Deserialization**: Uses custom JSON-mapping exceptions instead of raw Stack trace leakage in response bodies.
