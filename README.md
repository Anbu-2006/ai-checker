# ⚡ NeuralBench (Agon Agent 1) — Universal AI Benchmarker

> **Privacy-First, Real-Time Local & Cloud LLM Performance Benchmarking Engine**
> *Benchmark latency, time-to-first-token (TTFT), tokens/sec, and token costs across Local LLMs (Ollama) and Cloud Providers (OpenAI, Anthropic, Groq) in a unified cyberpunk monitoring cockpit.*

[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript-61DAFB?style=flat&logo=react)](frontend/)
[![Vite](https://img.shields.io/badge/Bundler-Vite%207-646CFF?style=flat&logo=vite)](frontend/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC?style=flat&logo=tailwind-css)](frontend/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=flat&logo=node.js)](backend/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Anbu--2006%2Fai--checker-181717?style=flat&logo=github)](https://github.com/Anbu-2006/ai-checker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌟 Why NeuralBench?

While global leaderboards (like LMSYS Chatbot Arena or Artificial Analysis) provide aggregated crowd scores, **NeuralBench** provides **machine-accurate performance telemetry directly on your local hardware and active network connection**:

1. **🔒 100% Privacy-First (Zero Cloud Storage)**:
   - Your API keys and benchmark payloads are never stored on a remote server.
   - All state, keys, prompt templates, and historical results remain in your browser's localized `localStorage`.
2. **⚡ Hybrid Local + Cloud Concurrency**:
   - Simultaneously stream the exact same prompt to a local model via Ollama (`http://localhost:11434`) and commercial foundation models (GPT-4o, Claude 3.5 Sonnet, Llama 3 70B via Groq).
3. **⏱️ Precision Latency & TTFT Measurement**:
   - Built-in stateless Express proxy eliminates browser CORS obstacles and captures true socket-level Time-To-First-Token (TTFT) and total stream duration.
4. **🔍 Intelligent Provider Auto-Detection**:
   - Paste any API key or local endpoint URL. NeuralBench automatically identifies the provider (OpenAI `sk-...`, Anthropic `sk-ant-...`, Groq `gsk_...`, or Ollama), verifies connectivity, and fetches active model registries in one click.
5. **📊 Deep Telemetry & Cost Accounting**:
   - Real-time Recharts visualizations showing throughput (tokens/sec), response latency, token consumption, and per-query operational expense calculations.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       REACT 19 FRONTEND COCKPIT                             │
│                                                                             │
│   ┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────┐   │
│   │   Model Setup &     │   │  Prompt Studio &    │   │  Recharts &     │   │
│   │   Auto-Detection    │   │  Parallel Runner    │   │  Latency Graphs │   │
│   └──────────┬──────────┘   └──────────┬──────────┘   └────────┬────────┘   │
│              │                         │                       │            │
│              └─────────────────────────┼───────────────────────┘            │
│                                        │ Browser LocalStorage (Zero Leak)   │
└────────────────────────────────────────┼────────────────────────────────────┘
                                         │ HTTP REST / Stream
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     STATELESS NODE.JS / EXPRESS ENGINE                      │
│                                                                             │
│   ┌────────────────────────────────┐   ┌────────────────────────────────┐   │
│   │       /api/detect              │   │       /api/benchmarks          │   │
│   │  • Auto-detects key format     │   │  • Socket-level TTFT metering  │   │
│   │  • Queries Ollama /tags        │   │  • Multi-stream fanout proxy   │   │
│   └───────────────┬────────────────┘   └───────────────┬────────────────┘   │
│                   │                                    │                    │
│                   └─────────────────┬──────────────────┘                    │
│                                     │ Bypass CORS / Secure Transport        │
└─────────────────────────────────────┼───────────────────────────────────────┘
                                      │
              ┌───────────────────────┴───────────────────────┐
              ▼                                               ▼
   ┌───────────────────────┐                       ┌───────────────────────┐
   │  Local Inference Host │                       │   Cloud Model APIs    │
   │  • Ollama (11434)     │                       │  • OpenAI (GPT-4o)    │
   │  • LM Studio (1234)   │                       │  • Anthropic (Claude) │
   │  • Local vLLM         │                       │  • Groq (Llama 3 70B) │
   └───────────────────────┘                       └───────────────────────┘
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- *(Optional)* [Ollama](https://ollama.com/) running locally for on-device benchmarks.

### 1. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/Anbu-2006/ai-checker.git
cd ai-checker

# Install root, backend, and frontend dependencies in one command
npm run install:all
```

### 2. Development Mode
Run both the frontend and backend in separate terminals:

**Backend (API & Proxy):**
```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
```

**Frontend (Vite Dev Server):**
```bash
cd frontend
npm run dev
# Dashboard launches at http://localhost:5173
```

### 3. Production Monorepo Build & Serve
To build and serve the full application as a single unified container:
```bash
# From repository root
npm run build
npm run start
```
The full application (Dashboard + API) will be live at: `http://localhost:5000`

---

## 📊 Benchmarking Metrics

| Metric | Description | Importance |
| :--- | :--- | :--- |
| **TTFT (ms)** | Time to First Token | Critical for interactive agent and chat responsiveness |
| **Throughput (tok/s)** | Generated tokens per second | Essential for high-volume summarization and code generation |
| **Total Latency (s)** | Full request lifecycle duration | Measures end-to-end user wait time |
| **Estimated Cost ($)** | Model pricing multiplied by token consumption | Cost-benefit comparison across model sizes |

---

## 📁 Repository Structure

```
ai-checker/
├── backend/                       # Stateless proxy & TTFT metering engine
│   ├── src/
│   │   ├── routes/benchmarkRoutes.ts  # Benchmark runner endpoints
│   │   └── index.ts               # Express server & static frontend host
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                      # React 19 SPA dashboard
│   ├── src/
│   │   ├── components/            # Sidebar, Header, BenchmarkCard, etc.
│   │   ├── pages/                 # Dashboard, ModelSetup, Comparison, History
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── package.json                   # Root monorepo orchestration script
├── LICENSE                        # MIT License
└── README.md                      # Project documentation
```

---

## 👤 Author & Maintainer
- **Anbu** ([@Anbu-2006](https://github.com/Anbu-2006))
- GitHub Repository: [https://github.com/Anbu-2006/ai-checker](https://github.com/Anbu-2006/ai-checker)

---

## 🛡️ License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
