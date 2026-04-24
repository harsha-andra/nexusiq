"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "chat" | "pipeline" | "xai">("dashboard");
  const [demoInput, setDemoInput] = useState("");
  const [demoMsgs, setDemoMsgs] = useState<Array<{ role: "user" | "ai"; text: string; sources?: string }>>([
    { role: "user", text: "Why did retail forecast accuracy drop on Tuesday?" },
    {
      role: "ai",
      text: "Tuesday's accuracy dropped 3.2% vs baseline. Root cause: promotional event data from 847 stores arrived 6 hours late in the Kafka topic, causing Spark to compute stale lag features. Auto-retrain triggered at 03:14 UTC — accuracy recovered by 07:00.",
      sources: "sources: pipeline_log_04-22 · drift_report_retail_v3 · kafka_lag_monitor",
    },
  ]);
  const [demoTyping, setDemoTyping] = useState(false);
  const sparkRef = useRef<HTMLDivElement>(null);
  const [sparkStarted, setSparkStarted] = useState(false);

  useEffect(() => {
    if (!sparkRef.current || sparkStarted) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setSparkStarted(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(sparkRef.current);
    return () => obs.disconnect();
  }, [sparkStarted]);

  const handleDemoSend = () => {
    if (!demoInput.trim()) return;
    const q = demoInput.trim();
    setDemoMsgs((m) => [...m, { role: "user", text: q }]);
    setDemoInput("");
    setDemoTyping(true);
    setTimeout(() => {
      setDemoMsgs((m) => [
        ...m,
        {
          role: "ai",
          text: "This is a live demo preview. To get real answers connected to your actual data pipelines, click 'Start building' to configure NexusIQ with your data sources.",
          sources: "tip: use Start Building for a real configured RAG connection",
        },
      ]);
      setDemoTyping(false);
    }, 1600);
  };

  return (
    <>
      <style jsx>{styles}</style>
      <nav className="nav">
        <div className="logo">
          Nexus<em>IQ</em>
        </div>
        <div className="nav-links">
          <button className="nl active">Platform</button>
          <button className="nl">Solutions</button>
          <button className="nl">Docs</button>
          <button className="nl">Pricing</button>
        </div>
        <div className="nav-r">
          <div className="status-strip">
            <div className="status-dot" />
            All systems operational
          </div>
          <button className="btn-sm btn-outline">Sign in</button>
          <Link href="/build" className="btn-sm btn-purple">
            Start building
          </Link>
        </div>
      </nav>

      <section className="hero">
        <div className="badge">
          <span className="badge-dot" />
          v2.0 — Spark 3.5 · Hadoop 3.4 · ml-intern integration
        </div>
        <h1>
          AI analytics for
          <br />
          <span className="accent">every domain</span>, <span className="dim">every team</span>
        </h1>
        <p className="hero-sub">
          NexusIQ unifies data pipelines, ML models, GenAI, and observability into one production-grade platform.
          Finance, healthcare, retail, and ops teams get the intelligence they need without managing ten separate tools.
        </p>
        <div className="hero-ctas">
          <Link href="/build" className="btn-hero-p">
            Start building free →
          </Link>
          <button
            className="btn-hero-g"
            onClick={() => document.getElementById("demo-section")?.scrollIntoView({ behavior: "smooth" })}
          >
            See live demo
          </button>
        </div>
        <div className="stats">
          <div>
            <div className="stat-n">2.4B+</div>
            <div className="stat-l">records/day</div>
          </div>
          <div>
            <div className="stat-n">99.97%</div>
            <div className="stat-l">uptime SLA</div>
          </div>
          <div>
            <div className="stat-n">&lt;200ms</div>
            <div className="stat-l">inference p99</div>
          </div>
          <div>
            <div className="stat-n">6 clouds</div>
            <div className="stat-l">AWS·Azure·GCP+</div>
          </div>
          <div>
            <div className="stat-n">4 domains</div>
            <div className="stat-l">multi-vertical</div>
          </div>
        </div>
      </section>

      <section className="product-demo" id="demo-section">
        <div className="demo-tabs">
          {(["dashboard", "chat", "pipeline", "xai"] as const).map((t) => (
            <button
              key={t}
              className={`dt ${activeTab === t ? "active" : ""}`}
              onClick={() => setActiveTab(t)}
            >
              {t === "dashboard" && "Dashboard"}
              {t === "chat" && "AI analyst chat"}
              {t === "pipeline" && "ML pipeline"}
              {t === "xai" && "Explainability"}
            </button>
          ))}
        </div>

        <div className="demo-screen">
          {activeTab === "dashboard" && (
            <div className="demo-panel">
              <div className="demo-topbar">
                <span className="wdot" style={{ background: "#f56060" }} />
                <span className="wdot" style={{ background: "#f5a623" }} />
                <span className="wdot" style={{ background: "#3dd68c" }} />
                <span className="demo-bar-title">nexusiq — analytics workspace · finance domain</span>
              </div>
              <div className="dash-grid">
                <div className="mcard">
                  <div className="mc-l">model accuracy</div>
                  <div className="mc-v">94.7%</div>
                  <div className="mc-d up">▲ +1.2% vs last week</div>
                </div>
                <div className="mcard">
                  <div className="mc-l">predictions today</div>
                  <div className="mc-v">1.24M</div>
                  <div className="mc-d up">▲ +18% vs yesterday</div>
                </div>
                <div className="mcard">
                  <div className="mc-l">drift score</div>
                  <div className="mc-v">0.03</div>
                  <div className="mc-d up">● stable · no retrain</div>
                </div>
                <div className="mcard">
                  <div className="mc-l">spark jobs</div>
                  <div className="mc-v">12 / 12</div>
                  <div className="mc-d up">▲ all green</div>
                </div>
              </div>
              <div className="dash-row2">
                <div className="chart-box">
                  <div className="chart-lbl">prediction volume — 7 days</div>
                  <div className="bars">
                    {[42, 55, 49, 68, 62, 88, 74].map((h, i) => (
                      <div key={i} className={`bar ${h >= 85 ? "hi" : ""}`} style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                <div className="chart-box">
                  <div className="chart-lbl">active domains</div>
                  <div className="domains">
                    {[
                      { n: "finance", p: 38, c: "var(--purple)" },
                      { n: "healthcare", p: 27, c: "var(--green)" },
                      { n: "retail", p: 21, c: "var(--amber)" },
                      { n: "ops", p: 14, c: "var(--blue)" },
                    ].map((d) => (
                      <div key={d.n} className="dom-row">
                        <span className="dom-dot" style={{ background: d.c }} />
                        <span className="dom-name">{d.n}</span>
                        <div className="dom-bar-bg">
                          <div className="dom-bar-fill" style={{ width: `${d.p}%`, background: d.c }} />
                        </div>
                        <span className="dom-pct">{d.p}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "chat" && (
            <div className="demo-panel">
              <div className="demo-topbar">
                <span className="wdot" style={{ background: "#f56060" }} />
                <span className="wdot" style={{ background: "#f5a623" }} />
                <span className="wdot" style={{ background: "#3dd68c" }} />
                <span className="demo-bar-title">nexusiq ai analyst · rag · pinecone + azure openai</span>
              </div>
              <div className="chat-area">
                {demoMsgs.map((m, i) => (
                  <div key={i} className={`msg ${m.role}`}>
                    {m.text}
                    {m.sources && <div className="src">{m.sources}</div>}
                  </div>
                ))}
                {demoTyping && (
                  <div className="msg ai">
                    <div className="typing-ind">
                      <span /><span /><span />
                    </div>
                  </div>
                )}
              </div>
              <div className="chat-input-row">
                <input
                  className="chat-in"
                  placeholder="Ask anything about your data..."
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleDemoSend()}
                />
                <button className="chat-send" onClick={handleDemoSend}>
                  Ask
                </button>
              </div>
            </div>
          )}

          {activeTab === "pipeline" && (
            <div className="demo-panel">
              <div className="demo-topbar">
                <span className="wdot" style={{ background: "#f56060" }} />
                <span className="wdot" style={{ background: "#f5a623" }} />
                <span className="wdot" style={{ background: "#3dd68c" }} />
                <span className="demo-bar-title">airflow dag · ml_pipeline_retail_v3 · emr cluster</span>
              </div>
              <div className="pipe-view">
                <div className="pipe-header">
                  dag run: 2025-04-24 03:00 UTC · duration: 4m 32s · status: success
                </div>
                {[
                  { s: "done", n: "data_ingestion", d: "S3 → Kafka → Spark Streaming", t: "0m 48s" },
                  { s: "done", n: "hdfs_batch_etl", d: "PySpark · 2.41B rows · EMR 24 nodes", t: "1m 12s" },
                  { s: "done", n: "feature_engineering", d: "Feast store · 147 features", t: "0m 54s" },
                  { s: "done", n: "model_training", d: "SageMaker · XGBoost · GPU ml.p3.2xl", t: "1m 08s" },
                  { s: "done", n: "mlflow_eval", d: "AUC 0.947 · champion 0.931 · +1.7% lift", t: "0m 11s" },
                  { s: "run", n: "auto_deploy", d: "EKS · blue/green · 10% canary live", t: "running..." },
                ].map((r, i) => (
                  <div key={i} className="pipe-row">
                    <span className={`pipe-status s-${r.s}`} />
                    <span className="pipe-name">{r.n}</span>
                    <span className="pipe-detail">{r.d}</span>
                    <span className="pipe-time">{r.t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "xai" && (
            <div className="demo-panel">
              <div className="demo-topbar">
                <span className="wdot" style={{ background: "#f56060" }} />
                <span className="wdot" style={{ background: "#f5a623" }} />
                <span className="wdot" style={{ background: "#3dd68c" }} />
                <span className="demo-bar-title">nexusiq xai · shap explanation · prediction_id: txn_8841cc</span>
              </div>
              <div className="xai-view">
                <div className="xai-title">prediction explanation — what drove this decision?</div>
                <div className="xai-pred">
                  <div className="xai-label">Credit risk: HIGH RISK — deny loan application</div>
                  <div className="xai-conf">confidence 91.3%</div>
                </div>
                <div className="xai-note">SHAP feature contributions — positive = pushes toward HIGH RISK</div>
                {[
                  { n: "debt_ratio", w: 82, v: "+0.41", dir: "pos" },
                  { n: "missed_payments", w: 64, v: "+0.32", dir: "pos" },
                  { n: "credit_age", w: 45, v: "−0.22", dir: "neg" },
                  { n: "income_stability", w: 30, v: "−0.15", dir: "neg" },
                  { n: "txn_velocity", w: 22, v: "+0.11", dir: "pos" },
                ].map((f, i) => (
                  <div key={i} className="feat-row">
                    <span className="feat-name">{f.n}</span>
                    <div className="feat-bar-bg">
                      <div
                        className={f.dir === "pos" ? "feat-bar-pos" : "feat-bar-neg"}
                        style={{ width: `${f.w}%` }}
                      />
                    </div>
                    <span className="feat-val" style={{ color: f.dir === "pos" ? "var(--purple2)" : "var(--red)" }}>
                      {f.v}
                    </span>
                  </div>
                ))}
                <div className="xai-audit">
                  audit trail: model_v3 · run_id a4f2c · logged to MLflow · exportable PDF
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="cap-section">
        <div className="cap-inner">
          <div>
            <div className="cap-tag">Continuous ML + big data</div>
            <h2 className="cap-title">Models that train themselves. Pipelines that never sleep.</h2>
            <p className="cap-body">
              End-to-end ML from raw data to deployed model — fully automated. Spark on EMR processes petabytes. Airflow
              orchestrates. MLflow tracks everything. SageMaker deploys the winner.
            </p>
            <ul className="cap-bullets">
              <li><span className="bul" />Apache Spark 3.5 + Hadoop HDFS on AWS EMR — petabyte-scale PySpark ETL</li>
              <li><span className="bul" />Airflow DAGs orchestrate ingestion → features → training → eval → deploy</li>
              <li><span className="bul" />Evidently AI drift detection triggers automatic SageMaker retraining</li>
              <li><span className="bul" />ml-intern (HuggingFace) automates paper reading, model search, experiments</li>
            </ul>
            <Link href="/build" className="link-btn">→ build this pipeline now</Link>
          </div>
          <div className="anim-box" ref={sparkRef}>
            <div className="demo-topbar">
              <span className="wdot" style={{ background: "#f56060" }} />
              <span className="wdot" style={{ background: "#f5a623" }} />
              <span className="wdot" style={{ background: "#3dd68c" }} />
              <span className="demo-bar-title">pyspark_etl.py · emr cluster</span>
            </div>
            <div className="spark-body">
              {[
                { t: "$ spark-submit --master yarn etl_job.py", c: "text3" },
                { t: "INFO SparkContext: Spark 3.5.0 · YARN mode", c: "blue" },
                { t: "INFO Reading HDFS: s3a://nexusiq-lake/raw/", c: "text3" },
                { t: "INFO 24 executors · 96 cores · 384GB RAM", c: "blue" },
                { t: "INFO Stage[1]: Parsing 2.4B rows, 180 partitions", c: "text2" },
                { t: "INFO Stage[2]: PySpark feature transforms (14 cols)", c: "amber" },
                { t: "INFO Stage[3]: Writing Delta Lake → S3", c: "text2" },
                { t: "SUCCESS 2.41B rows written · 4m 32s", c: "green" },
                { t: "SUCCESS Features pushed → Feast online store", c: "green" },
              ].map((line, i) => (
                <div
                  key={i}
                  className="spark-line"
                  style={{
                    color: `var(--${line.c})`,
                    opacity: sparkStarted ? 1 : 0,
                    transition: `opacity 0.3s ease ${i * 0.35}s`,
                  }}
                >
                  {line.t}
                </div>
              ))}
              <div className="spark-progress">
                <div
                  className="spark-fill"
                  style={{
                    width: sparkStarted ? "100%" : "0%",
                    transition: "width 3.5s linear",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="missing-section">
        <div className="cap-tag center">What the market is missing</div>
        <h2 className="ms-title">
          Three capabilities no platform does well.
          <br />
          NexusIQ ships all three.
        </h2>
        <p className="ms-sub">
          We studied 40+ ML platforms. These three gaps show up everywhere. We built them in from day one.
        </p>
        <div className="missing-grid">
          <div className="mg-card xai-c">
            <div className="mg-tag">Explainable AI</div>
            <h3 className="mg-title">Why did the model decide that?</h3>
            <p className="mg-desc">
              Every prediction comes with a SHAP explanation, audit trail, and human-readable reason. Required for
              finance, healthcare, and legal compliance. Most platforms treat it as an afterthought.
            </p>
            <div className="mg-demo">
              <span className="hl">prediction:</span> DENY loan · conf 91.3%
              <br />
              <span className="hl">top driver:</span> debt_ratio <span className="hl4">+0.41 SHAP</span>
              <br />
              <span className="hl">audit:</span> model_v3 · <span className="hl2">logged + exportable</span>
            </div>
          </div>
          <div className="mg-card ab-c">
            <div className="mg-tag">Live A/B model testing</div>
            <h3 className="mg-title">Split traffic. Pick the winner. Automatically.</h3>
            <p className="mg-desc">
              Route live traffic between Champion and Challenger models in real time. NexusIQ measures statistical
              significance and auto-promotes the winner — no engineer needed for rollout decisions.
            </p>
            <div className="mg-demo">
              <span className="hl2">champion</span> model_v3 · 70% traffic · AUC 0.931
              <br />
              <span className="hl3">challenger</span> model_v4 · 30% traffic · AUC 0.947
              <br />
              <span className="hl4">significance:</span> p=0.003 · <span className="hl2">promoting v4...</span>
            </div>
          </div>
          <div className="mg-card nl-c">
            <div className="mg-tag">NL → Spark / SQL</div>
            <h3 className="mg-title">Write queries in plain English.</h3>
            <p className="mg-desc">
              Type a question. NexusIQ generates the PySpark or SQL, runs it on your data lake, and returns results. No
              data engineer needed for ad-hoc analysis.
            </p>
            <div className="mg-demo">
              <span className="hl3">you:</span> "top 10 stores by revenue growth last 90 days"
              <br />
              <span className="hl">nexusiq:</span> <span className="hl4">SELECT store_id, ...</span>{" "}
              <span className="hl2">→ running on Spark</span>
              <br />
              <span className="hl2">result:</span> 10 rows · 0.8s · 2.4B rows scanned
            </div>
          </div>
        </div>
      </section>

      <section className="int-section">
        <div className="int-lbl">// full stack — every tool a senior ai/ml engineer uses</div>
        <div className="tech-row">
          {[
            "apache spark 3.5", "hadoop hdfs", "aws sagemaker", "azure openai", "kubernetes eks",
            "apache kafka", "mlflow", "apache airflow", "langchain", "pinecone",
            "power bi embedded", "grafana", "terraform", "github actions", "feast",
            "evidently ai", "gcp bigquery", "vertex ai", "docker", "delta lake",
            "aws emr", "redis", "postgresql", "langsmith", "huggingface",
            "ml-intern", "redshift", "shap",
          ].map((t) => (
            <span key={t} className="tp">
              {t}
            </span>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cap-tag center">get started</div>
        <h2 className="cta-title">
          Build the platform.
          <br />
          Ship the models.
        </h2>
        <p className="cta-sub">
          Chat with NexusIQ's AI configurator — describe what you need, get a full repo scaffold in minutes.
        </p>
        <div className="cta-btns">
          <Link href="/build" className="btn-hero-p">
            Open build configurator →
          </Link>
          <button
            className="btn-hero-g"
            onClick={() => document.getElementById("demo-section")?.scrollIntoView({ behavior: "smooth" })}
          >
            View architecture
          </button>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-logo">
          Nexus<em>IQ</em>
        </div>
        <div className="footer-links">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Docs</span>
          <a href="https://github.com/harsha-andra" target="_blank" rel="noreferrer">GitHub</a>
          <span>Status</span>
          <span>Security</span>
        </div>
        <div className="footer-copy">© 2025 NexusIQ · built by Harsha Andra</div>
      </footer>
    </>
  );
}

const styles = `
.nav{display:flex;align-items:center;justify-content:space-between;padding:0 28px;height:52px;border-bottom:1px solid var(--border);background:rgba(10,10,15,0.95);position:sticky;top:0;z-index:200;backdrop-filter:blur(8px)}
.logo{font-size:17px;font-weight:600;letter-spacing:-0.5px;cursor:pointer}
.logo em{color:var(--purple);font-style:normal}
.nav-links{display:flex;gap:2px}
.nl{font-size:13px;padding:5px 11px;border-radius:6px;color:var(--text2);cursor:pointer;background:none;border:none;font-family:var(--font)}
.nl:hover{background:var(--bg3);color:var(--text)}
.nl.active{color:var(--text);background:var(--bg3)}
.nav-r{display:flex;gap:8px;align-items:center}
.status-strip{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--text3);font-family:var(--mono);margin-right:6px}
.status-dot{width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green);animation:pulse 2s infinite}
.btn-sm{font-size:12px;padding:6px 14px;border-radius:6px;cursor:pointer;font-family:var(--font);font-weight:500;text-decoration:none;display:inline-block}
.btn-outline{background:transparent;border:1px solid var(--border2);color:var(--text2)}
.btn-outline:hover{border-color:var(--purple);color:var(--purple)}
.btn-purple{background:var(--purple);border:none;color:#fff}
.btn-purple:hover{background:var(--purple2);color:var(--bg)}

.hero{padding:70px 28px 48px;text-align:center;max-width:820px;margin:0 auto}
.badge{display:inline-flex;align-items:center;gap:7px;font-size:11px;padding:4px 14px;border-radius:99px;background:var(--purple4);color:var(--purple2);border:1px solid var(--purple3);margin-bottom:24px;font-family:var(--mono)}
.badge-dot{width:6px;height:6px;border-radius:50%;background:var(--purple);animation:pulse 2s infinite}
h1{font-size:44px;font-weight:600;line-height:1.1;letter-spacing:-2px;margin-bottom:18px}
.accent{color:var(--purple)}
.dim{color:var(--text2)}
.hero-sub{font-size:15px;color:var(--text2);line-height:1.75;max-width:560px;margin:0 auto 36px}
.hero-ctas{display:flex;gap:12px;justify-content:center;margin-bottom:56px;flex-wrap:wrap}
.btn-hero-p{font-size:14px;padding:11px 28px;border-radius:8px;background:var(--purple);border:none;color:#fff;cursor:pointer;font-weight:600;font-family:var(--font);transition:all 0.2s;text-decoration:none;display:inline-block}
.btn-hero-p:hover{background:var(--purple2);color:var(--bg);transform:translateY(-1px)}
.btn-hero-g{font-size:14px;padding:11px 24px;border-radius:8px;background:transparent;border:1px solid var(--border2);color:var(--text2);cursor:pointer;font-family:var(--font);transition:all 0.2s}
.btn-hero-g:hover{border-color:var(--purple);color:var(--purple)}
.stats{display:flex;justify-content:center;gap:52px;padding:24px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:56px;flex-wrap:wrap}
.stat-n{font-size:22px;font-weight:600;color:var(--text)}
.stat-l{font-size:11px;color:var(--text3);margin-top:3px;font-family:var(--mono)}

.product-demo{max-width:880px;margin:0 auto 64px;padding:0 28px}
.demo-tabs{display:flex;gap:4px;border-bottom:1px solid var(--border)}
.dt{font-size:12px;padding:8px 16px;cursor:pointer;color:var(--text3);border:none;border-bottom:2px solid transparent;margin-bottom:-1px;transition:all 0.15s;background:none;font-family:var(--font)}
.dt:hover{color:var(--text2)}
.dt.active{color:var(--purple);border-bottom-color:var(--purple)}
.demo-screen{border:1px solid var(--border);border-top:none;border-radius:0 0 12px 12px;overflow:hidden;background:var(--bg2);min-height:320px}
.demo-panel{animation:fadeIn 0.4s ease}
.demo-topbar{display:flex;align-items:center;gap:6px;padding:10px 14px;border-bottom:1px solid var(--border);background:var(--bg3)}
.wdot{width:9px;height:9px;border-radius:50%}
.demo-bar-title{font-size:11px;color:var(--text3);margin-left:8px;font-family:var(--mono)}

.dash-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:14px}
.mcard{background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:12px}
.mc-l{font-size:10px;color:var(--text3);font-family:var(--mono);margin-bottom:4px}
.mc-v{font-size:19px;font-weight:600}
.mc-d{font-size:10px;margin-top:3px}
.up{color:var(--green)}
.dash-row2{display:grid;grid-template-columns:2fr 1fr;gap:10px;padding:0 14px 14px}
.chart-box{background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:12px}
.chart-lbl{font-size:10px;color:var(--text3);font-family:var(--mono);margin-bottom:10px}
.bars{display:flex;align-items:flex-end;gap:5px;height:72px}
.bar{flex:1;border-radius:3px 3px 0 0;background:var(--purple3);transition:background 0.2s}
.bar:hover{background:var(--purple)}
.bar.hi{background:var(--purple)}
.domains{display:flex;flex-direction:column;gap:7px;padding-top:4px}
.dom-row{display:flex;align-items:center;gap:8px;font-size:11px}
.dom-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.dom-name{flex:1;color:var(--text2)}
.dom-pct{color:var(--text);font-family:var(--mono)}
.dom-bar-bg{flex:2;height:3px;background:var(--bg4);border-radius:2px}
.dom-bar-fill{height:100%;border-radius:2px}

.chat-area{height:220px;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px}
.msg{max-width:82%;padding:9px 12px;border-radius:10px;font-size:12px;line-height:1.55}
.msg.user{background:var(--purple3);color:var(--purple2);align-self:flex-end;border-radius:10px 10px 3px 10px}
.msg.ai{background:var(--bg3);border:1px solid var(--border);color:var(--text2);align-self:flex-start;border-radius:10px 10px 10px 3px}
.msg .src{font-size:9px;color:var(--text3);margin-top:5px;font-family:var(--mono)}
.chat-input-row{display:flex;gap:8px;padding:10px 14px;border-top:1px solid var(--border)}
.chat-in{flex:1;background:var(--bg3);border:1px solid var(--border);border-radius:6px;padding:8px 12px;font-size:12px;color:var(--text);font-family:var(--font)}
.chat-in:focus{outline:none;border-color:var(--purple)}
.chat-send{padding:8px 16px;background:var(--purple);border:none;border-radius:6px;color:#fff;font-size:12px;cursor:pointer;font-family:var(--font);font-weight:500}
.chat-send:hover{background:var(--purple2);color:var(--bg)}
.typing-ind{display:inline-flex;gap:3px;padding:2px 0}
.typing-ind span{width:5px;height:5px;border-radius:50%;background:var(--text3);animation:blink 1.2s infinite}
.typing-ind span:nth-child(2){animation-delay:.2s}
.typing-ind span:nth-child(3){animation-delay:.4s}

.pipe-view{padding:14px;font-family:var(--mono)}
.pipe-header{font-size:10px;color:var(--text3);margin-bottom:12px}
.pipe-row{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:6px;background:var(--bg3);border:1px solid var(--border);margin-bottom:6px;font-size:11px}
.pipe-status{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.s-done{background:var(--green)}
.s-run{background:var(--amber);animation:pulse 1s infinite}
.s-wait{background:var(--border2)}
.pipe-name{flex:1;color:var(--text)}
.pipe-detail{color:var(--text3);font-size:10px}
.pipe-time{color:var(--text3);font-size:10px}

.xai-view{padding:14px}
.xai-title{font-size:11px;color:var(--text3);font-family:var(--mono);margin-bottom:12px}
.xai-pred{display:flex;align-items:center;gap:10px;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:10px 12px;margin-bottom:10px}
.xai-label{font-size:12px;font-weight:500;flex:1}
.xai-conf{font-size:11px;font-family:var(--mono);color:var(--green)}
.xai-note{font-size:10px;color:var(--text3);font-family:var(--mono);margin-bottom:8px}
.xai-audit{font-size:10px;color:var(--text3);font-family:var(--mono);margin-top:8px}
.feat-row{display:flex;align-items:center;gap:10px;margin-bottom:6px;font-size:11px}
.feat-name{width:100px;color:var(--text2);flex-shrink:0;font-family:var(--mono);font-size:10px}
.feat-bar-bg{flex:1;height:6px;background:var(--bg3);border-radius:3px}
.feat-bar-pos{height:100%;border-radius:3px;background:var(--purple)}
.feat-bar-neg{height:100%;border-radius:3px;background:var(--red)}
.feat-val{width:36px;text-align:right;color:var(--text2);font-family:var(--mono);font-size:10px}

.cap-section{padding:64px 28px;border-top:1px solid var(--border)}
.cap-inner{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;max-width:880px;margin:0 auto}
.cap-tag{font-size:10px;font-weight:600;color:var(--purple);text-transform:uppercase;letter-spacing:1.5px;font-family:var(--mono);margin-bottom:10px}
.center{text-align:center}
.cap-title{font-size:22px;font-weight:600;letter-spacing:-0.5px;margin-bottom:12px;line-height:1.3}
.cap-body{font-size:13px;color:var(--text2);line-height:1.75;margin-bottom:18px}
.cap-bullets{list-style:none;display:flex;flex-direction:column;gap:8px;margin-bottom:20px}
.cap-bullets li{font-size:12px;color:var(--text2);display:flex;gap:10px;line-height:1.5}
.bul{width:16px;height:16px;border-radius:50%;background:var(--purple4);border:1px solid var(--purple3);flex-shrink:0;margin-top:1px;position:relative}
.bul::after{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:4px;height:4px;border-radius:50%;background:var(--purple)}
.link-btn{font-size:12px;color:var(--purple);cursor:pointer;font-family:var(--mono);text-decoration:none}
.link-btn:hover{color:var(--purple2);text-decoration:underline}
.anim-box{border:1px solid var(--border);border-radius:10px;overflow:hidden;background:var(--bg2)}
.spark-body{padding:14px;font-family:var(--mono);font-size:11px;display:flex;flex-direction:column;gap:4px}
.spark-line{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.spark-progress{margin-top:8px;height:4px;background:var(--bg4);border-radius:2px}
.spark-fill{height:100%;background:var(--purple);border-radius:2px;width:0%}

.missing-section{padding:64px 28px;border-top:1px solid var(--border);text-align:center}
.ms-title{font-size:26px;font-weight:600;letter-spacing:-0.5px;margin-bottom:10px}
.ms-sub{font-size:14px;color:var(--text2);max-width:520px;margin:0 auto 40px;line-height:1.7}
.missing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;max-width:880px;margin:0 auto}
.mg-card{padding:20px;border:1px solid var(--border);border-radius:10px;text-align:left;background:var(--bg2);position:relative;overflow:hidden}
.mg-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px}
.mg-card.xai-c::before{background:var(--purple)}
.mg-card.ab-c::before{background:var(--green)}
.mg-card.nl-c::before{background:var(--blue)}
.mg-tag{font-size:9px;font-family:var(--mono);font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;padding:3px 8px;border-radius:99px;display:inline-block}
.mg-card.xai-c .mg-tag{background:var(--purple4);color:var(--purple2)}
.mg-card.ab-c .mg-tag{background:var(--green2);color:var(--green)}
.mg-card.nl-c .mg-tag{background:#1a2e4a;color:var(--blue)}
.mg-title{font-size:14px;font-weight:600;margin-bottom:6px}
.mg-desc{font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px}
.mg-demo{background:var(--bg3);border:1px solid var(--border);border-radius:6px;padding:10px;font-size:11px;font-family:var(--mono);color:var(--text2);line-height:1.7}
.hl{color:var(--purple)}
.hl2{color:var(--green)}
.hl3{color:var(--blue)}
.hl4{color:var(--amber)}

.int-section{padding:40px 28px;border-top:1px solid var(--border);text-align:center}
.int-lbl{font-size:11px;color:var(--text3);font-family:var(--mono);margin-bottom:16px}
.tech-row{display:flex;flex-wrap:wrap;gap:7px;justify-content:center}
.tp{font-size:11px;padding:4px 11px;border:1px solid var(--border);border-radius:99px;color:var(--text3);background:var(--bg2);font-family:var(--mono)}
.tp:hover{border-color:var(--purple3);color:var(--purple2)}

.cta-section{padding:72px 28px;text-align:center;border-top:1px solid var(--border)}
.cta-title{font-size:32px;font-weight:600;letter-spacing:-1px;margin-bottom:14px}
.cta-sub{font-size:14px;color:var(--text2);margin-bottom:32px}
.cta-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}

.footer{padding:24px 28px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px}
.footer-logo{font-size:14px;font-weight:600}
.footer-logo em{color:var(--purple);font-style:normal}
.footer-links{display:flex;gap:18px;font-size:11px;color:var(--text3);font-family:var(--mono)}
.footer-links span,.footer-links a{cursor:pointer}
.footer-links span:hover,.footer-links a:hover{color:var(--text)}
.footer-copy{font-size:10px;color:var(--text3);font-family:var(--mono)}

@media (max-width: 768px) {
  h1{font-size:32px}
  .stats{gap:28px}
  .cap-inner{grid-template-columns:1fr}
  .missing-grid{grid-template-columns:1fr}
  .nav-links{display:none}
  .status-strip{display:none}
  .dash-grid{grid-template-columns:repeat(2,1fr)}
}
`;
