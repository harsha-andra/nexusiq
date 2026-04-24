"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Msg = { role: "user" | "assistant"; content: string };
type Config = {
  name: string;
  domain: string;
  team: string;
  cloud: string;
  orchestration: string;
  data_lake: string;
  framework: string;
  tracking: string;
  serving: string;
  rag: string;
  xai: string;
  ab_testing: string;
  nl_to_spark: string;
  compliance: string;
  phase: "requirements" | "config" | "generate";
  ready: string;
};

const EMPTY_CONFIG: Config = {
  name: "—",
  domain: "—",
  team: "—",
  cloud: "—",
  orchestration: "—",
  data_lake: "—",
  framework: "—",
  tracking: "—",
  serving: "—",
  rag: "—",
  xai: "—",
  ab_testing: "—",
  nl_to_spark: "—",
  compliance: "—",
  phase: "requirements",
  ready: "gathering info",
};

export default function BuildPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<Config>(EMPTY_CONFIG);
  const [showScaffold, setShowScaffold] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hey! 👋 I'm the NexusIQ configurator. I'll help you design and scaffold your full AI/ML platform — Spark, Kafka, MLflow, CI/CD, GenAI, the whole stack.\n\nWhat are you building? Tell me about your use case — domain, data, team size, whatever's top of mind.",
      },
    ]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const val = input.trim();
    if (!val || loading) return;
    setInput("");

    if (val.toLowerCase() === "generate" || val.toLowerCase().includes("generate scaffold")) {
      setMessages((m) => [...m, { role: "user", content: val }]);
      setTimeout(() => setShowScaffold(true), 400);
      return;
    }

    const newMsgs: Msg[] = [...messages, { role: "user", content: val }];
    setMessages(newMsgs);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMsgs }),
      });
      const data = await res.json();
      const raw: string = data.text || "Sorry, something went wrong.";

      const cfgMatch = raw.match(/\|\|\|CONFIG\|\|\|([\s\S]*?)\|\|\|END\|\|\|/);
      if (cfgMatch) {
        try {
          const parsed = JSON.parse(cfgMatch[1]);
          setConfig((prev) => {
            const next = { ...prev };
            (Object.keys(parsed) as Array<keyof Config>).forEach((k) => {
              if (parsed[k] && parsed[k] !== "—") (next[k] as string) = parsed[k];
            });
            return next;
          });
        } catch {}
      }
      const clean = raw.replace(/\|\|\|CONFIG\|\|\|[\s\S]*?\|\|\|END\|\|\|/g, "").trim();
      setMessages((m) => [...m, { role: "assistant", content: clean }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Having trouble connecting. Make sure ANTHROPIC_API_KEY is set in Vercel environment variables." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const phaseIndex = { requirements: 0, config: 1, generate: 2 }[config.phase];

  return (
    <>
      <style jsx>{buildStyles}</style>
      <nav className="bnav">
        <Link href="/" className="blogo">
          Nexus<em>IQ</em>
        </Link>
        <div className="bnav-title">Project configurator</div>
        <Link href="/" className="bnav-back">
          ← back to home
        </Link>
      </nav>

      <div className="build-view">
        <aside className="build-sidebar">
          <div className="bs-header">
            <div className="bs-title">Live config</div>
            <div className="bs-sub">// updates as you chat</div>
          </div>
          <div className="config-panel">
            <ConfigSection label="Project" items={[
              ["name", config.name], ["domain", config.domain], ["team_size", config.team],
            ]} />
            <ConfigSection label="Infrastructure" items={[
              ["cloud", config.cloud], ["orchestration", config.orchestration], ["data_lake", config.data_lake],
            ]} />
            <ConfigSection label="ML Stack" items={[
              ["framework", config.framework], ["tracking", config.tracking], ["serving", config.serving],
            ]} />
            <ConfigSection label="Features" items={[
              ["genai_rag", config.rag], ["xai", config.xai], ["ab_testing", config.ab_testing],
              ["nl_to_spark", config.nl_to_spark], ["compliance", config.compliance],
            ]} />
            <ConfigSection label="Status" items={[
              ["phase", config.phase], ["ready", config.ready],
            ]} />
          </div>
        </aside>

        <main className="build-main">
          <header className="build-header">
            <div>
              <div className="bh-title">Chat with NexusIQ</div>
              <div className="bh-sub">// powered by claude · describe your needs · get a full scaffold</div>
            </div>
            <div className="phase-pills">
              {["requirements", "config", "generate"].map((p, i) => (
                <div key={p} className={`phase-pill ${i === phaseIndex ? "active" : ""} ${i < phaseIndex ? "done" : ""}`}>
                  {p}
                </div>
              ))}
            </div>
          </header>

          <div className="chat-messages" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`cm ${m.role === "user" ? "user-msg" : ""}`}>
                <div className={`cm-avatar ${m.role === "user" ? "user-av" : "ai-av"}`}>
                  {m.role === "user" ? "HA" : "NQ"}
                </div>
                <div className={`cm-bubble ${m.role === "user" ? "user-bubble" : "ai-bubble"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="cm">
                <div className="cm-avatar ai-av">NQ</div>
                <div className="cm-bubble ai-bubble">
                  <span className="typing"><span /><span /><span /></span>
                  <span className="loading-text">thinking...</span>
                </div>
              </div>
            )}
            {showScaffold && <ScaffoldPreview config={config} />}
          </div>

          <div className="build-input-area">
            <textarea
              className="build-input"
              placeholder="Describe your project, domain, team, data sources..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              disabled={loading}
              rows={1}
            />
            <button className="build-send" onClick={send} disabled={loading || !input.trim()}>
              Send
            </button>
          </div>
        </main>
      </div>
    </>
  );
}

function ConfigSection({ label, items }: { label: string; items: [string, string][] }) {
  return (
    <div className="config-section">
      <div className="cs-label">{label}</div>
      {items.map(([k, v]) => (
        <div key={k} className="config-item">
          <span className="ci-key">{k}</span>
          <span className={`ci-val ${v === "—" ? "empty" : ""}`}>{v}</span>
        </div>
      ))}
    </div>
  );
}

function ScaffoldPreview({ config }: { config: Config }) {
  const domain = config.domain !== "—" ? config.domain : "multi-domain";
  const cloud = config.cloud !== "—" ? config.cloud : "aws";
  return (
    <div className="cm">
      <div className="cm-avatar ai-av">NQ</div>
      <div className="cm-bubble ai-bubble scaffold-bubble">
        <div className="scaffold-intro">
          🎉 Generating your NexusIQ scaffold for <strong>{domain}</strong> on <strong>{cloud}</strong>...
        </div>
        <pre className="scaffold">
{`nexusiq/
├── frontend/                # Next.js 14 + TypeScript
├── backend/                 # FastAPI microservices
│   ├── ingestion/           # Kafka producer
│   ├── inference/           # SageMaker + SHAP XAI
│   ├── rag/                 # LangChain + Pinecone
│   ├── analytics/           # Celery + Redis
│   └── notifications/       # SNS + SES
├── ml-pipeline/             # ML automation
│   ├── spark/               # PySpark ETL
│   ├── hadoop/              # HDFS + EMR
│   ├── airflow/             # DAG orchestration
│   ├── training/            # SageMaker jobs
│   └── ml_intern/           # HuggingFace ml-intern
├── infra/                   # Terraform IaC
│   ├── aws/                 # EKS, SageMaker, EMR
│   └── azure/               # OpenAI, Power BI
├── .github/workflows/       # CI/CD
├── docker-compose.yml
└── README.md`}
        </pre>
        <div className="scaffold-actions">
          <a
            href="https://github.com/harsha-andra/nexusiq"
            target="_blank"
            rel="noreferrer"
            className="scaffold-btn"
          >
            View on GitHub →
          </a>
        </div>
      </div>
    </div>
  );
}

const buildStyles = `
.bnav{display:flex;align-items:center;justify-content:space-between;padding:0 28px;height:52px;border-bottom:1px solid var(--border);background:var(--bg);position:sticky;top:0;z-index:200}
.blogo{font-size:17px;font-weight:600;color:var(--text);text-decoration:none}
.blogo em{color:var(--purple);font-style:normal}
.bnav-title{font-size:13px;color:var(--text2)}
.bnav-back{font-size:12px;color:var(--text3);text-decoration:none;font-family:var(--mono)}
.bnav-back:hover{color:var(--purple)}

.build-view{display:flex;height:calc(100vh - 52px);min-height:500px}
.build-sidebar{width:280px;border-right:1px solid var(--border);background:var(--bg2);display:flex;flex-direction:column;flex-shrink:0;overflow-y:auto}
.bs-header{padding:18px 20px;border-bottom:1px solid var(--border)}
.bs-title{font-size:13px;font-weight:600;margin-bottom:2px}
.bs-sub{font-size:11px;color:var(--text3);font-family:var(--mono)}
.config-panel{padding:14px 20px;flex:1}
.config-section{margin-bottom:18px}
.cs-label{font-size:10px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:1px;font-family:var(--mono);margin-bottom:8px}
.config-item{display:flex;align-items:center;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border);font-size:11px}
.ci-key{color:var(--text3);font-family:var(--mono)}
.ci-val{color:var(--purple2);font-family:var(--mono);text-align:right;max-width:140px;word-break:break-word}
.ci-val.empty{color:var(--text3);font-style:italic}

.build-main{flex:1;display:flex;flex-direction:column;overflow:hidden}
.build-header{padding:14px 22px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
.bh-title{font-size:13px;font-weight:600}
.bh-sub{font-size:11px;color:var(--text3);font-family:var(--mono)}
.phase-pills{display:flex;gap:6px}
.phase-pill{font-size:10px;padding:3px 10px;border-radius:99px;font-family:var(--mono);border:1px solid var(--border);color:var(--text3)}
.phase-pill.active{background:var(--purple4);border-color:var(--purple3);color:var(--purple2)}
.phase-pill.done{background:var(--green2);border-color:var(--green);color:var(--green)}

.chat-messages{flex:1;overflow-y:auto;padding:18px 22px;display:flex;flex-direction:column;gap:12px}
.cm{display:flex;gap:10px;animation:fadeIn 0.3s ease}
.cm.user-msg{flex-direction:row-reverse}
.cm-avatar{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;flex-shrink:0;margin-top:2px;font-family:var(--mono)}
.ai-av{background:var(--purple4);border:1px solid var(--purple3);color:var(--purple2)}
.user-av{background:var(--bg4);border:1px solid var(--border2);color:var(--text2)}
.cm-bubble{max-width:78%;padding:10px 14px;border-radius:10px;font-size:13px;line-height:1.65;white-space:pre-wrap}
.ai-bubble{background:var(--bg3);border:1px solid var(--border);color:var(--text2);border-radius:10px 10px 10px 3px}
.user-bubble{background:var(--purple3);color:var(--purple2);border-radius:10px 10px 3px 10px}
.typing{display:inline-flex;gap:3px;align-items:center;margin-right:8px}
.typing span{width:5px;height:5px;border-radius:50%;background:var(--text3);animation:blink 1.2s infinite}
.typing span:nth-child(2){animation-delay:.2s}
.typing span:nth-child(3){animation-delay:.4s}
.loading-text{font-size:11px;color:var(--text3);font-family:var(--mono)}

.build-input-area{padding:14px 22px;border-top:1px solid var(--border);display:flex;gap:10px;align-items:flex-end}
.build-input{flex:1;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:10px 14px;font-size:13px;color:var(--text);font-family:var(--font);resize:none;min-height:42px;max-height:120px;line-height:1.5}
.build-input:focus{outline:none;border-color:var(--purple)}
.build-input:disabled{opacity:0.6}
.build-send{padding:10px 20px;background:var(--purple);border:none;border-radius:8px;color:#fff;font-size:13px;cursor:pointer;font-family:var(--font);font-weight:600;flex-shrink:0}
.build-send:hover:not(:disabled){background:var(--purple2);color:var(--bg)}
.build-send:disabled{opacity:0.4;cursor:not-allowed}

.scaffold-bubble{max-width:90%}
.scaffold-intro{margin-bottom:10px;font-size:12px}
.scaffold{background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:12px;font-family:var(--mono);font-size:10px;color:var(--text2);line-height:1.7;overflow-x:auto;white-space:pre}
.scaffold-actions{margin-top:12px;display:flex;gap:8px}
.scaffold-btn{font-size:11px;padding:6px 12px;background:var(--purple);color:#fff;border:none;border-radius:6px;text-decoration:none;cursor:pointer;display:inline-block}
.scaffold-btn:hover{background:var(--purple2);color:var(--bg)}

@media (max-width: 768px) {
  .build-view{flex-direction:column;height:auto}
  .build-sidebar{width:100%;max-height:200px;border-right:none;border-bottom:1px solid var(--border)}
  .build-main{min-height:calc(100vh - 252px)}
  .phase-pills{display:none}
}
`;
