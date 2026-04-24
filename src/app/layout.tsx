import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexusIQ — Universal AI Analytics Platform",
  description:
    "AI analytics platform for finance, healthcare, retail, and operations. Spark, Kafka, SageMaker, RAG, and explainable AI in one production-grade stack.",
  keywords: [
    "AI analytics",
    "MLOps",
    "Spark",
    "Hadoop",
    "SageMaker",
    "RAG",
    "explainable AI",
    "production ML",
  ],
  authors: [{ name: "Harsha Andra" }],
  openGraph: {
    title: "NexusIQ — Universal AI Analytics Platform",
    description:
      "Production-grade AI/ML platform covering ingestion, training, GenAI, and observability.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
