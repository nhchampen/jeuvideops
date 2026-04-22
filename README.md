# 🎮 Retro Games CI/CD Platform

[![CI](https://github.com/nhchampen/jeuvideops/actions/workflows/ci.yml/badge.svg)](https://github.com/nhchampen/jeuvideops/actions/workflows/ci.yml)
[![CD](https://github.com/nhchampen/jeuvideops/actions/workflows/cd.yml/badge.svg)](https://github.com/nhchampen/jeuvideops/actions/workflows/cd.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue?logo=github)](https://nhchampen.github.io/jeuvideops/)

A complete **CI/CD pipeline** for two retro JavaScript games, built with **GitHub Actions**, **DevSecOps** best practices, and automated deployment to **GitHub Pages** and **Docker Hub (GHCR)**.

---

## 📖 Overview

This project is part of a School project to improve the competitiveness and reliability of a retro game studio. It implements a modern DevOps pipeline that:

- Automates testing (unit + functional) and linting
- Scans for secrets and vulnerable dependencies
- Builds a lightweight Docker image
- Deploys the latest stable version to GitHub Pages
- Performs a post‑deployment smoke test

The two games included are from the **js13kGames 2021** competition (theme: *Space*).

---

## 📁 Repository Structure
```
.
├── .github/workflows/
│ ├── ci.yml # Continuous Integration (tests, lint, security)
│ ├── cd.yml # Continuous Deployment (Docker build, GitHub Pages)
│ └── reusable-game-check.yml # Reusable workflow for game‑specific checks
├── games/
│ ├── spaceword/ # First game (SpaceWord)
│ │ ├── js/
│ │ ├── tests/
│ │ └── index.html
│ └── two-ships-passing-in-the-night/ # Second game
│ ├── src/
│ ├── tests/
│ └── index.html
├── index.html # Landing page that embeds both games
├── Dockerfile # Nginx‑based static server
├── nginx.conf # Nginx configuration (optional)
├── jest.config.js # Centralized Jest configuration
├── babel.config.js # Babel configuration for ES6+ support
└── package.json # Root dependencies (Jest, ESLint, Babel)
```

---

## ⚙️ CI/CD Pipeline

### 🔄 Continuous Integration (`ci.yml`)

On every push and pull request to `main`:

| Job | Description |
|-----|-------------|
| **Secret Scan** | Uses **Gitleaks** to detect accidentally committed secrets |
| **Lint** | Enforces **Google JavaScript Style Guide** with ESLint and annotates PRs |
| **Security Audit** | Runs `npm audit` and checks for high‑severity vulnerabilities |
| **Test SpaceWord** | Reusable workflow that runs unit + functional tests for SpaceWord |
| **Test Two Ships** | Same for Two Ships Passing In The Night |

### 📦 Continuous Deployment (`cd.yml`)

Triggered only on pushes to `main` (or manually):

| Job | Description |
|-----|-------------|
| **Docker Build & Push** | Builds a minimal Nginx image and pushes it to **GitHub Container Registry (GHCR)** |
| **Deploy to GitHub Pages** | Publishes the static landing page and games |
| **Smoke Test** | Verifies that the live URL returns HTTP 200 and contains expected content |

---

## 🧪 Testing Strategy

Each game includes:

- **Provided unit tests** from the original competition
- **5+ additional unit tests** written for uncovered logic
- **3 functional tests** simulating real user interactions (game start, typing, collisions)

Tests are run with **Jest** and **jsdom** to emulate a browser environment.

---

## 🔐 DevSecOps Practices

- **Shift‑left security**: Gitleaks and `npm audit` run on every commit
- **No hardcoded secrets**: All credentials are stored as **GitHub Secrets**
- **Dependency scanning**: `npm audit` report uploaded as an artifact
- **Immutable deployments**: Docker images are tagged with commit SHA for traceability

---

## 🚀 Local Development

### Prerequisites

- Node.js ≥ 20
- Docker (optional, for container testing)

### Run Tests

# Install dependencies
```
npm install
```
# Run all tests (unit + functional)
```
npm test
```
# Run only unit tests for a specific game
```
npx jest --projects games/spaceword --testPathPattern=utils.test.js
```
Build and Run Docker Image
```
docker build -t retro-games .
docker run -p 8080:80 retro-games
```
Then open http://localhost:8080.

## 🛠️ Technologies Used
CI/CD: GitHub Actions

Container: Docker, Nginx Alpine

Testing: Jest, jsdom, Babel

Linting: ESLint (Google config)

Security: Gitleaks, npm audit

Deployment: GitHub Pages, GHCR

## 👥 Authors
[Nohan](https://github.com/nhchampen) and [Tomas](https://github.com/tomasilva14)

Original games by participants of the js13kGames 2021 competition.

## 📄 License
This project is licensed under the ISC License – see the LICENSE file for details.
ddd