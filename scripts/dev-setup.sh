#!/usr/bin/env bash
set -e

echo "Setting up frontend..."
cd frontend && npm install && cd ..

echo "Setting up backend..."
cd backend && python3 -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt && cd ..

echo "Setting up AI service..."
cd ai && python3 -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt && cd ..

echo "Done. See docs/DEVELOPMENT_FLOW.md for next steps."
