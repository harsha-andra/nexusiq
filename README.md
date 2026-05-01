# 🧠 NexusIQ — Universal AI Analytics Platform

**Production-grade end-to-end AI/ML platform** that unifies data pipelines, ML models, GenAI, and observability into one deployable stack built with the same architecture used at Netflix, JPMorgan, and Datadog.

![Python](https://img.shields.io/badge/Python-3.11-blue) ![PySpark](https://img.shields.io/badge/PySpark-3.5-orange) ![Hadoop](https://img.shields.io/badge/Hadoop-3.3-yellow) ![Kafka](https://img.shields.io/badge/Apache%20Kafka-3.6-black) ![Docker](https://img.shields.io/badge/Docker-24-2496ED) ![Kubernetes](https://img.shields.io/badge/Kubernetes-1.29-326CE5) ![AWS](https://img.shields.io/badge/AWS-EMR%20%7C%20SageMaker-FF9900) ![Terraform](https://img.shields.io/badge/Terraform-1.7-7B42BC) ![LangChain](https://img.shields.io/badge/LangChain-0.2-1C3C3C) ![HuggingFace](https://img.shields.io/badge/🤗-HuggingFace-yellow) ![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 What This Project Does

Most ML platforms answer *"can I train a model?"* — NexusIQ answers *"how do I run an entire production ML organization?"* It demonstrates the **full lifecycle** of a real AI/ML system: data ingestion through Kafka, big-data ETL with PySpark on Hadoop/HDFS, continuous training through Airflow + SageMaker + MLflow, RAG-powered GenAI through LangChain + Pinecone + Azure OpenAI, explainable predictions with SHAP, A/B model testing, and observability through Prometheus + Grafana — all wired into Docker, Kubernetes, GitHub Actions CI/CD, and Terraform-managed AWS infrastructure.

The frontend is **deployed live to the public** at [nexusiq-nine.vercel.app](https://nexusiq-nine.vercel.app). The full backend stack runs locally with one Docker Compose command and deploys to AWS Free Tier with one Terraform apply.

## 🖥️ Live Demo

### **🌐 [nexusiq-nine.vercel.app](https://nexusiq-nine.vercel.app)**

![NexusIQ Homepage Animation](./Animation.gif)



## 📊 Architecture Overview

NexusIQ is composed of **7 production layers**, each implemented in this repository:

| Layer | Components | Tools |
|-------|-----------|-------|
| **1 · Frontend** | Landing page, AI configurator, product demos | Next.js 14, React 18, TypeScript, Vercel |
| **2 · API Microservices** | Ingestion, Inference (SHAP XAI), RAG, Analytics, Notifications | FastAPI, Pydantic, Prometheus client |
| **3 · Streaming** | Real-time event ingestion + processing | Apache Kafka 3.6, Spark Structured Streaming |
| **4 · Big-Data ETL** | Petabyte-scale batch processing | PySpark 3.5, Hadoop HDFS, Delta Lake, AWS EMR |
| **5 · ML Platform** | DAG orchestration, training, registry, deploy | Airflow, MLflow, SageMaker, Feast, Evidently AI |
| **6 · GenAI Layer** | RAG, NL→Spark, autonomous research | LangChain, Pinecone, Azure OpenAI, HuggingFace ml-intern |
| **7 · Infrastructure** | Multi-cloud deployment, CI/CD, monitoring | Docker, Kubernetes, Terraform, GitHub Actions, Grafana |

## 🔬 Methodology — How Each Layer Works

### 1 · Data Ingestion
The `backend/ingestion` service exposes a REST API that validates incoming records (finance, healthcare, retail, ops domains), enriches them with batch IDs and timestamps, and produces them to Apache Kafka topics. Prometheus metrics track accept/reject rates and latency in real time.

### 2 · Streaming + Batch ETL with PySpark + Hadoop
Two PySpark applications run on either local Docker or AWS EMR:

- `streaming_job.py` reads from Kafka topics with `spark.readStream`, parses JSON, and writes to Delta Lake on S3 with checkpointing for exactly-once semantics
- `etl_job.py` performs batch feature engineering with rolling-window aggregations (7-day average, 30-day z-score, lag features) using PySpark window functions, then writes partitioned Delta Lake tables

The full Hadoop cluster (HDFS + YARN) runs in a Docker container at `ml-pipeline/hadoop/Dockerfile`, exposing the standard ports (9000, 9870, 8088).

### 3 · ML Training with SageMaker + MLflow
The Airflow DAG `nexusiq_ml_pipeline` runs daily at 02:00 UTC and:

1. Checks the drift score from Evidently AI; branches early if drift is below threshold
2. Spins up an EMR cluster, runs the Spark ETL, terminates the cluster
3. Submits a SageMaker XGBoost training job using the processed features
4. Registers the run in MLflow, comparing AUC against the current Champion
5. Auto-promotes the model to Production stage if it wins
6. Triggers a blue/green deploy to the SageMaker endpoint
7. Sends a Slack notification with the result

### 4 · GenAI with LangChain + Pinecone + Azure OpenAI
The `backend/rag` service runs LangChain LCEL chains that:

- Embed user queries with `text-embedding-3-large` via Azure OpenAI
- Retrieve top-5 relevant documents from Pinecone
- Stream responses through Azure OpenAI GPT-4o using server-sent events
- Trace every call in LangSmith for quality monitoring

A second endpoint, `/nl-to-spark`, takes a natural-language question and outputs runnable PySpark code targeting the data lake schema.

### 5 · Explainable AI with SHAP
Every prediction from `backend/inference` can include a SHAP explanation showing feature contributions toward the model's output. Each prediction gets a UUID and is cached for audit. The audit trail captures the model version, A/B variant, timestamp, and SHAP values — required for compliance in finance and healthcare.

### 6 · A/B Model Testing
Inference traffic routes between Champion and Challenger models based on a configurable split (default 70/30). The service tracks conversion metrics per variant and the architecture supports auto-promotion when statistical significance is achieved.

### 7 · Autonomous Research with HuggingFace ml-intern
The `ml-pipeline/ml_intern/integration.py` module wraps the [HuggingFace ml-intern](https://github.com/huggingface/ml-intern) CLI to automate three tasks: finding the best HuggingFace model for a domain, implementing techniques from arxiv papers, and fine-tuning models with LoRA tracked through MLflow.

## 📈 Key Implementation Metrics

| Component | Metric | Value |
|-----------|--------|-------|
| **Microservices** | Number of FastAPI services | 5 |
| **Microservices** | Average lines per service | ~150 |
| **Containers** | Total Dockerfiles | 7 |
| **Spark** | PySpark jobs | 2 (batch + streaming) |
| **Spark** | Window features computed | 14 per record |
| **Airflow** | DAG tasks | 8 (with branching) |
| **Inference** | Prediction latency (mock) | <50 ms p99 |
| **Inference** | A/B variants supported | Champion + Challenger |
| **GenAI** | RAG retrieval k | 5 documents |
| **Infrastructure** | Terraform resources | 12+ (VPC, EC2, S3, MSK, RDS, IAM) |
| **CI/CD** | GitHub Actions workflows | 2 (CI + AWS deploy) |
| **Monitoring** | Prometheus scrape targets | 4 services |

## 🚀 Quick Start

### Option A — Local Docker Compose ($0)

```bash
