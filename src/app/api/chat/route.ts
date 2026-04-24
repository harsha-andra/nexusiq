import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 30;

const SYSTEM_PROMPT = `You are the NexusIQ project configurator — an AI assistant that helps users design and scaffold a full-stack AI/ML production system called NexusIQ.

Your job: have a natural, friendly conversation to understand what the user wants to build. After each user message, do TWO things:
1. Respond conversationally (2-4 sentences max, no bullet walls)
2. At the END of your response, output a JSON block wrapped exactly like this (on its own lines):
|||CONFIG|||{"name":"...","domain":"...","team":"...","cloud":"...","orchestration":"...","data_lake":"...","framework":"...","tracking":"...","serving":"...","rag":"...","xai":"...","ab_testing":"...","nl_to_spark":"...","compliance":"...","phase":"requirements|config|generate","ready":"gathering info|almost ready|ready to scaffold"}|||END|||

Use the value "—" (em-dash) for any config field the user has NOT provided or that you can't reasonably infer yet. Once you have enough info (domain, cloud, key features chosen), set phase to "config". When fully ready to generate, set phase to "generate" and ready to "ready to scaffold".

When phase becomes "generate", end your message with: "Ready! Type 'generate' to create your full repo scaffold."

Keep responses SHORT and conversational. Extract config from context — if they say "I work in healthcare", set domain to "healthcare". If they say "we use AWS", set cloud to "aws". Infer intelligently:
- orchestration defaults to "airflow" unless they specify otherwise
- tracking defaults to "mlflow"
- serving defaults to "sagemaker" for aws, "vertex" for gcp
- framework defaults to "xgboost + pytorch"
- data_lake defaults to "spark + hadoop on emr" for aws

Ask short, single questions. Never ask more than 2 things at once.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          text:
            "⚠️ ANTHROPIC_API_KEY is not set. Add it to your Vercel project settings under Environment Variables, then redeploy.\n\n|||CONFIG|||{\"phase\":\"requirements\",\"ready\":\"api key missing\"}|||END|||",
        },
        { status: 200 }
      );
    }

    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const text =
      response.content[0].type === "text"
        ? response.content[0].text
        : "Sorry, no response generated.";

    return NextResponse.json({ text });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        text: `Error calling Claude API: ${msg}. Check your ANTHROPIC_API_KEY in Vercel environment variables.\n\n|||CONFIG|||{"phase":"requirements","ready":"error"}|||END|||`,
      },
      { status: 200 }
    );
  }
}
