# # Build stage
# FROM python:3.10-slim AS builder

# WORKDIR /app
# COPY requirements.txt .

# # Install dependencies into a virtualenv for easy copying
# RUN python -m venv /opt/venv
# ENV PATH="/opt/venv/bin:$PATH"

# # Upgrade pip first
# RUN python -m pip install --upgrade pip setuptools wheel

# # # Install dependencies
# # RUN python -m pip install --no-cache-dir -r requirements.txt

# RUN python -m pip install --upgrade pip setuptools wheel && \
#     python -m pip install --no-cache-dir -r requirements.txt

# # Run stage
# FROM python:3.10-slim

# WORKDIR /app

# # Install system dependencies (libmagic for python-magic)
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     libmagic1 curl \
#     && rm -rf /var/lib/apt/lists/*

# # Copy virtualenv from builder
# COPY --from=builder /opt/venv /opt/venv
# ENV PATH="/opt/venv/bin:$PATH"

# # Create a non-root user
# RUN addgroup --system appgroup && adduser --system --group appuser
# RUN chown -R appuser:appgroup /app

# COPY --chown=appuser:appgroup . .

# USER appuser

# ENV PORT=8000
# EXPOSE 8000

# HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
#     CMD curl -f http://localhost:8000/ || exit 1

# CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]



# Build stage
FROM python:3.10-slim AS builder

WORKDIR /app
COPY requirements.txt .

# Install dependencies into a virtualenv for easy copying
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

RUN python -m pip install --upgrade pip setuptools wheel && \
    python -m pip install --no-cache-dir -r requirements.txt

# Pre-download ResNet18 pretrained weights so they are baked into the image.
# This avoids a network call (and potential permission issues) at runtime.
ENV TORCH_HOME=/tmp/torch
RUN python -c "from torchvision import models; models.resnet18(weights=models.ResNet18_Weights.DEFAULT)"

# Run stage
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies (libmagic for python-magic)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libmagic1 curl \
    && rm -rf /var/lib/apt/lists/*

# Copy virtualenv from builder
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Create a non-root user with HOME set to /tmp so that
# os.path.expanduser("~") returns a writable directory.
# Without --home, adduser --system defaults to /nonexistent which causes
# "Permission denied: /nonexistent" when torch/transformers try to cache.
RUN addgroup --system appgroup && \
    adduser --system --group --home /tmp appuser
RUN chown -R appuser:appgroup /app

COPY --chown=appuser:appgroup . .

# --- Writable cache directories for non-root user ---
ENV HOME=/tmp
ENV TORCH_HOME=/tmp/torch
ENV HF_HOME=/tmp/huggingface
ENV TRANSFORMERS_CACHE=/tmp/huggingface
ENV HUGGINGFACE_HUB_CACHE=/tmp/huggingface

# Copy pre-downloaded ResNet18 weights from builder stage
COPY --from=builder --chown=appuser:appgroup /tmp/torch /tmp/torch

RUN mkdir -p /tmp/huggingface && \
    chown -R appuser:appgroup /tmp/huggingface /tmp/torch

USER appuser

ENV PORT=8000
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8000/ || exit 1

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]