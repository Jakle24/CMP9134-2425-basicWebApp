# syntax=docker/dockerfile:1

FROM python:3.10-slim AS base

# Set environment variables for Python
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Builder stage: install dependencies in a venv
FROM base AS builder

# Install build dependencies (if needed)
RUN apt-get update --no-install-recommends -y && \
    apt-get install --no-install-recommends -y gcc && \
    rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python -m venv /app/.venv

# Copy requirements and install dependencies
COPY requirements.txt ./
ENV PIP_CACHE_DIR=/root/.cache/pip
RUN --mount=type=cache,target=$PIP_CACHE_DIR \
    /app/.venv/bin/pip install --upgrade pip && \
    /app/.venv/bin/pip install -r requirements.txt

# Copy application code
COPY . .

# Final stage: minimal runtime image
FROM base AS final

# Create a non-root user
RUN useradd -m appuser
USER appuser

WORKDIR /app

# Copy virtual environment from builder
COPY --from=builder /app/.venv /app/.venv
# Copy application code from builder
COPY --from=builder /app .

ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 5000

CMD ["python", "main.py"]
