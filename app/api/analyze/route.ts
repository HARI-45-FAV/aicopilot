import { NextResponse } from "next/server";

const N8N_WEBHOOK = "https://hari4545.app.n8n.cloud/webhook/analyze";

// Final output format for common-people friendly result
interface CoPilotResult {
  verdict?: string;               // 🟢 SAFE | 🟡 OK SOMETIMES | 🔴 AVOID
  quick_reason?: string;          // 1-line plain explanation
  why_it_matters?: string[];      // bullet points
  who_should_be_careful?: {       // group-based guidance
    kids?: string;
    diabetics?: string;
    fitness?: string;
    elderly?: string;
  };
  risk_meter?: string;            // 🟢🟢🟢⚪⚪ style signal
  better_swaps?: string[];        // alternative suggestions
  honesty_note?: string;          // 🤔 trust-building line
  raw_debug?: string;             // only if JSON fails
}

// GPT/n8n nested response structure
interface N8nNested {
  output?: {
    content?: {
      text?: string;
    }[];
  }[];
}

// Type guard (removes `any`)
function isNested(obj: unknown): obj is N8nNested {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "output" in obj &&
    Array.isArray((obj as { output: unknown }).output)
  );
}

export async function POST(req: Request): Promise<NextResponse<CoPilotResult>> {
  try {
    const body = (await req.json()) as { ingredients: string };
    console.log("📤 Sending to n8n:", body);

    const res = await fetch(N8N_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    console.log("📩 Raw response from n8n:", text);

    // STEP 1: Remove markdown fences if model responded with ```json
    let cleaned = text.replace(/```json|```/g, "").trim();

    // STEP 2: First JSON parse
    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({
        verdict: "⚪ NO RESULT",
        quick_reason: "AI sent unreadable output",
        raw_debug: cleaned,
      });
    }

    // STEP 3: Handle nested OpenAI format
    if (isNested(parsed)) {
      const nested = parsed.output?.[0]?.content?.[0]?.text ?? "";
      if (nested.startsWith("{")) cleaned = nested;
    }

    // STEP 4: Final parse to CoPilotResult
    const final = JSON.parse(cleaned) as CoPilotResult;

    return NextResponse.json(final);
  }

  catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    const fallback: CoPilotResult = {
      verdict: "⚪ NO VERDICT",
      quick_reason: "AI output broken or network issue",
      who_should_be_careful: {
        kids: "❔ No info",
        diabetics: "❔ No info",
        elderly: "❔ No info",
        fitness: "❔ No info",
      },
      honesty_note: "⚠️ Internal error, please try again.",
      raw_debug: message,
    };

    return NextResponse.json(fallback, { status: 500 });
  }
}
