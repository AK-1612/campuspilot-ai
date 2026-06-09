# CampusPilot AI

Agentic AI-powered accessible campus navigation — LLM agent, QR indoor positioning, 5 disability profiles, offline-first PWA. Built for Capgemini Build-a-thon 2026.

## Team & Roles
- **Anshul** — LangChain agent, tools, memory, prompts, golden queries, eval scripts
- **Dhruv** — FastAPI app, routers, Neo4j connection, database schema/seed, Architecture Decision Records (ADRs)
- **Rishabh** — pytest unit + integration tests, polished README
- **Hrishikesh** — React PWA (Vite + TypeScript), cost models, rollout plan, demo videos
- **Atharva** — Primary documentation, competitive analysis, citations, WCAG

## Links
- **Live Demo (Frontend):** [TBD]
- **API Base URL:** [TBD]
- **Demo Video:** [TBD - Link to video or /demo folder]
- **Documentation:** [/docs](./docs)

## Tech Stack
![Generative AI](https://img.shields.io/badge/Generative_AI-121011?style=flat&logo=openai&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-121011?style=flat&logo=langchain&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-121011?style=flat&logo=groq&logoColor=white)
![Neo4j](https://img.shields.io/badge/Neo4j-121011?style=flat&logo=neo4j&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-121011?style=flat&logo=fastapi&logoColor=white)
![React PWA](https://img.shields.io/badge/React_PWA-121011?style=flat&logo=react&logoColor=white)

## AI Agent Architecture (Backend)
The backend utilizes an **Agentic Flow** driven by Llama 3.3 70B via Groq and LangChain. 
- **Tools**: The agent dynamically calls tools (`route_query`, `qr_lookup`, `profile_detect`, `flag_obstacle`) to calculate routes inside the Neo4j graph.
- **Memory**: It maintains contextual state across conversations (e.g. your last scanned QR code, active disability profile).
- **Intents**: Queries are pre-classified (navigation vs. emergency) to ensure lightning-fast responses and strict fallbacks.

## Setup Instructions

### Prerequisites
- Node.js (for frontend)
- Python 3.9+ (for backend)
- Neo4j Database

### Environment Variables
1. Copy `.env.example` to `.env`
2. Fill in the required values (e.g., `GROQ_API_KEY`). **DO NOT commit your `.env` file.**

### How to run Backend
```bash
# 1. Move into the backend directory
cd backend

# 2. Install the required Python packages
pip3 install -r requirements.txt

# 3. Start the FastAPI server (coming soon)
# uvicorn main:app --reload
```

### How to run Frontend
```bash
cd frontend
npm install
npm run dev
```
