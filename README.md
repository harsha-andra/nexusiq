# 🧠 NexusIQ — Universal AI Analytics Platform

A production-grade full-stack AI/ML platform showcase covering everything a senior AI/ML engineer ships in real systems: ingestion, big-data processing, continuous training, GenAI, explainability, and observability wrapped in a polished B2B SaaS experience.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![PySpark](https://img.shields.io/badge/PySpark-3.5-orange) ![Hadoop](https://img.shields.io/badge/Hadoop-3.3-yellow) ![Docker](https://img.shields.io/badge/Docker-Compose-blue) ![Terraform](https://img.shields.io/badge/Terraform-1.7-purple) ![Claude API](https://img.shields.io/badge/Claude-Sonnet%204.5-7c6ff7) ![License](https://img.shields.io/badge/license-MIT-green)

## 🌐 Live Demo

### **[👉 nexusiq-nine.vercel.app](https://nexusiq-nine.vercel.app)**

![NexusIQ Homepage](./Animation.gif)

**Try it live:** [Homepage](https://nexusiq-nine.vercel.app) · [AI Configurator](https://nexusiq-nine.vercel.app/build) · [Source Code](https://github.com/harsha-andra/nexusiq)

## 🎯 What This Project Is

NexusIQ is a **production-grade reference implementation** of a universal AI analytics platform. The frontend is live on Vercel. The full backend stack — every service, DAG, Spark job, Terraform module, and Dockerfile — is fully written and ready to deploy.

The repo demonstrates real-world AI/ML engineering across every layer:

- **Frontend** — Next.js 14 landing page deployed live, with a Claude-powered AI configurator
- **Microservices** — 5 FastAPI services (ingestion, inference with SHAP, RAG, analytics, notifications), each with Dockerfile + Prometheus metrics
- **Big-data ETL** — PySpark jobs running on Hadoop/HDFS or AWS EMR with Delta Lake
- **Streaming** — Apache Kafka producers + Spark Structured Streaming consumers
- **ML Platform** — Airflow DAG orchestrating Spark → SageMaker training → MLflow → blue/green deploy
- **GenAI** — LangChain + Pinecone + Azure OpenAI RAG service (streaming responses)
- **Infrastructure-as-Code** — Terraform with **Free Tier mode** (default $0) and production mode (full EKS/SageMaker/MSK)
- **CI/CD** — GitHub Actions: test → lint → build → push → optional manual AWS deploy

## 💡 Three Capabilities the Market is Missing

After studying 40+ ML platforms, NexusIQ ships three features that are consistently absent or poorly done elsewhere:

| Capability | What It Does |
|------------|--------------|
| **Explainable AI (XAI)** | Every prediction has a SHAP breakdown, audit trail, and exportable compliance report |
| **Live A/B Model Testing** | Route traffic between Champion and Challenger models with auto-promotion |
| **Natural Language → Spark/SQL** | Type a question in English, get PySpark/SQL that runs on your data lake |

## 🚀 Quick Deploy

Three options — pick what fits your budget today, scale up when ready.

### Option 1 — Local Docker (FREE, 10 min)
```bash
git clone https://github.com/harsha-andra/nexusiq.git
cd nexusiq
./scripts/setup_local.sh
# Visit http://localhost:8080 (Airflow), :5000 (MLflow), :8001 (API)
```

### Option 2 — AWS Free Tier (FREE for 12 months, 30 min)
```bash
cd infra/aws
terraform init
terraform apply -var-file=variables.tfvars
# Get your live EC2 URL from terraform output
```

### Option 3 — Production AWS (~$900/mo)
Edit `infra/aws/variables.tfvars`: `free_tier = false`. Then `terraform apply`.

**Full step-by-step instructions in [DEPLOY.md](./DEPLOY.md).**

##  Project Structure

```
├── src/                          # Next.js frontend (deployed to Vercel)
│   └── app/
│       ├── page.tsx              # Animated landing page
│       ├── build/page.tsx        # Claude-powered AI configurator
│       └── api/chat/route.ts     # Serverless AI endpoint
│
├── backend/                      # Python FastAPI microservices
│   ├── ingestion/                # Kafka producer, validation, Prometheus metrics
│   ├── inference/                # SageMaker wrapper + SHAP XAI + A/B routing
│   ├── rag/                      # LangChain + Pinecone streaming chat + NL→Spark
│   ├── analytics/                # Drift reports, pipeline status, Power BI tokens
│   └── notifications/            # SNS/SES/Slack alerting
│
├── ml-pipeline/                  # The actual ML stack
│   ├── spark/                    # PySpark ETL + Streaming jobs
│   ├── hadoop/                   # Hadoop/HDFS Dockerfile + configs
│   ├── airflow/                  # Master DAG orchestrating the full pipeline
│   ├── training/                 # SageMaker training launcher
│   └── ml_intern/                # HuggingFace ml-intern automation
│
├── infra/                        # Infrastructure-as-code
│   ├── aws/                      # Terraform — Free Tier OR Production mode
│   ├── azure/                    # Power BI Embedded + OpenAI configs
│   └── k8s/                      # Kubernetes deployments + HPA
│
├── monitoring/                   # Prometheus + Grafana + alerts
├── .github/workflows/            # CI/CD: ci.yml + deploy-aws.yml
├── scripts/                      # setup_local.sh, test_pipeline.sh, deploy_to_ec2.sh
├── docker-compose.yml            # Full local stack
└── DEPLOY.md                     # Step-by-step deployment guide
```

## 🔬 Architecture Layers (all implemented)

### 1 · Data & Streaming
- Apache Kafka producers in `backend/ingestion`
- Spark Structured Streaming consumers in `ml-pipeline/spark/streaming_job.py`
- Hadoop HDFS Docker container in `ml-pipeline/hadoop/`

### 2 · Batch ETL
- PySpark feature engineering with rolling windows in `ml-pipeline/spark/etl_job.py`
- Delta Lake output for ACID transactions
- Data quality checks before write

### 3 · ML Platform
- Airflow DAG (`ml_pipeline_dag.py`) with drift-triggered branching
- MLflow registration + model promotion
- SageMaker training launcher
- Auto blue/green deployment

### 4 · GenAI Layer
- LangChain LCEL chains for streaming RAG
- Pinecone vector store integration
- Azure OpenAI GPT-4o
- Natural-language-to-PySpark endpoint

### 5 · Inference & Explainability
- SHAP explainer for every prediction
- A/B test traffic routing (Champion vs Challenger)
- Audit trails with prediction-ID lookup
- Prometheus metrics on every call

### 6 · Infrastructure
- Terraform AWS module with **Free Tier toggle**
- Kubernetes manifests + HPA
- All services have Dockerfiles
- Multi-arch container images via buildx

### 7 · Observability
- Prometheus scraping every service
- Grafana dashboard provisioned automatically
- Evidently AI for model drift
- Slack alerts via notifications service

## 🛠️ Tech Stack

| Layer | Tools |
|-------|-------|
| **Frontend** | Next.js 14 · React 18 · TypeScript 5.5 · Vercel |
| **Backend** | FastAPI · Pydantic · Celery · Redis |
| **Streaming** | Apache Kafka · Spark Structured Streaming |
| **Batch ETL** | PySpark 3.5 · Hadoop HDFS · Delta Lake · AWS EMR |
| **ML Ops** | Airflow · MLflow · SageMaker · Feast · Evidently AI |
| **GenAI** | LangChain · Pinecone · Azure OpenAI · LangSmith |
| **Explainability** | SHAP · audit logging |
| **Infrastructure** | Terraform · Kubernetes (EKS) · Docker · Helm |
| **CI/CD** | GitHub Actions · ECR · Trivy scanning · Blue/green |
| **Monitoring** | Prometheus · Grafana · Evidently · Slack |
| **Multi-cloud** | AWS · Azure · GCP · HuggingFace |

## 👤 About the Author

**Harsha Andra** — AI/ML Engineer specializing in production GenAI systems.

- 🧪 Healthcare RAG chatbots (LangChain + Pinecone + Azure OpenAI)
- 📈 FMCG forecasting pipelines (Kafka + Airflow + XGBoost)
- 🤖 Autonomous AI systems (LangGraph + multi-agent orchestration)
- 💼 Currently seeking AI/ML Engineer and GenAI Engineer roles

**Contact:** [LinkedIn](https://linkedin.com/in/harsha-andra) · [Portfolio](https://harsha-andra.github.io) · [sonuandra@gmail.com](mailto:sonuandra@gmail.com)

## 📄 License

MIT — feel free to fork, learn from, or adapt.

---

**If NexusIQ helped you or inspired your own project, give it a ⭐ — it really helps!**
