# NexusIQ — Universal AI Analytics Platform

Production-grade AI/ML platform landing page with a working Claude-powered project configurator.

**Live demo:** _(fill in your Vercel URL after deploying)_

## What this is

NexusIQ is a showcase project demonstrating full-stack AI/ML engineering skills:

- **Next.js 14** landing page with dark, production-quality UI
- **Animated product demos** — Dashboard, AI chat, ML pipeline, Explainability (SHAP/XAI)
- **Claude-powered AI configurator** at `/build` that collects user requirements and generates a project scaffold
- **Three unique features** the ML platform market is missing: Explainable AI, live A/B model testing, natural-language-to-Spark queries

## Stack

- Next.js 14 (App Router) + React 18 + TypeScript
- Anthropic Claude API (Sonnet 4.5)
- Vercel serverless functions
- Zero database — state lives in React + localStorage

## Run locally

```bash
npm install
cp .env.local.example .env.local
# Paste your ANTHROPIC_API_KEY into .env.local
npm run dev
# Open http://localhost:3000
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to https://vercel.com → "Add New Project" → import your repo
3. In Vercel's project settings → Environment Variables, add `ANTHROPIC_API_KEY`
4. Deploy. You get a free live URL like `nexusiq.vercel.app`.

## Architecture (what the full system looks like)

This Next.js app is the frontend for a much larger platform described in the AI configurator. The full stack includes:

- **Backend**: FastAPI microservices (ingestion, inference, RAG, analytics)
- **Data Pipeline**: Apache Kafka → Spark Streaming → Hadoop HDFS → Delta Lake
- **ML Pipeline**: Airflow DAGs → PySpark ETL on AWS EMR → SageMaker training → MLflow → blue/green deploy
- **GenAI**: LangChain + Pinecone + Azure OpenAI GPT-4o, with LangSmith tracing
- **Observability**: Prometheus + Grafana + Evidently AI for drift detection
- **Infrastructure**: Terraform (AWS + Azure), Kubernetes EKS, GitHub Actions CI/CD
- **Agentic AI**: HuggingFace ml-intern integration for automated model research

## Credits

Built by Harsha Andra. Demonstrates AI/ML engineering capabilities for senior-level roles.
