import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Message = { role: "assistant" | "user"; content: string };
type SpecialistId = "mira" | "atlas" | "nova";

type ProviderResponse = {
  output_text?: unknown;
  output?: Array<{
    content?: Array<{ type?: string; text?: string }>;
  }>;
};

const specialistInstructions: Record<SpecialistId, string> = {
  mira:
    "You are Mira, a calm, kind companion. Listen first. Reflect feelings without claiming certainty, offer one gentle and practical next step, and ask at most one open question. Never diagnose, present yourself as a therapist, or pressure someone to be positive.",
  atlas:
    "You are Atlas, a thoughtful technology guide. Explain technology clearly, distinguish facts from uncertainty, and suggest practical ways to explore. Be curious, grounded, and never imply that technology can replace human care.",
  nova:
    "You are Nova, a supportive creative companion. Help people turn a large or fuzzy idea into one small, doable next action. Keep encouragement genuine, not overblown, and leave room for the user to choose.",
};

const sharedInstructions = `You are an AI companion on TwentyThirdCentury, a hopeful technology and community website. Be warm, concise, and respectful. You are not a therapist, doctor, crisis counselor, or emergency service; do not diagnose, prescribe, or claim professional credentials. Do not make promises that everything will be fine. If a person describes distress, acknowledge it and encourage support from a trusted person or qualified professional. If they may be in immediate danger, encourage contacting local emergency services or a crisis line and asking a trusted person to stay with them. Do not ask for identifying information. Keep replies under 130 words. A small, realistic next step is better than a lecture.`;

const crisisPattern = /\b(?:suicid(?:e|al)|kill myself|end (?:my|it all)|end my life|want to die|hurt myself|self[- ]?harm|not safe|feel unsafe|don't feel safe|do not feel safe|can't keep myself safe|cannot keep myself safe|can't go on|cannot go on|don't want to be alive|do not want to be alive|wish i (?:were|was) dead)\b/i;
const crisisReply =
  "I’m really glad you told me. You deserve support from a real person right now. If you may hurt yourself or aren’t safe, call your local emergency number now. In the U.S. or Canada, call or text 988; elsewhere, find a local crisis line at findahelpline.com. If you can, move near someone you trust and tell them plainly that you need them to stay with you. This chat isn’t monitored for emergencies.";

function previewReply(specialist: SpecialistId, message: string) {
  const lower = message.toLowerCase();
  if (specialist === "mira") {
    if (/overwhelm|too much|stress|anxious|heavy|hard day|exhausted/.test(lower)) {
      return "That sounds like a lot to hold at once. You don’t have to figure the whole thing out this minute. Would one small thing for the next ten minutes feel possible — a drink of water, a little fresh air, or texting someone you trust?";
    }
    return "Thank you for sharing that with me. You don’t have to have the perfect words or a complete plan. What feels most important to make a little room for right now?";
  }
  if (specialist === "atlas") {
    return "Let’s make it practical. Start with what you want to do, rather than which tool is trending. What are you hoping this technology could help you with? I can map a few options and their trade-offs.";
  }
  return "A small beginning is still a beginning. Try shrinking the idea until it fits into one gentle step you could take today. What’s the tiniest version that still feels interesting to you?";
}

function extractText(data: ProviderResponse) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }
  const parts = data.output?.flatMap((item) => item.content ?? []) ?? [];
  return parts
    .filter((part) => part.type === "output_text" && typeof part.text === "string")
    .map((part) => part.text?.trim() ?? "")
    .filter(Boolean)
    .join("\n")
    .trim();
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Please send a valid message." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Please send a valid message." }, { status: 400 });
  }

  const body = payload as { specialist?: unknown; messages?: unknown };
  const specialist = body.specialist;
  if (specialist !== "mira" && specialist !== "atlas" && specialist !== "nova") {
    return NextResponse.json({ error: "Choose one of the available companions." }, { status: 400 });
  }
  if (!Array.isArray(body.messages) || body.messages.length < 1 || body.messages.length > 20) {
    return NextResponse.json({ error: "The conversation is too long to send." }, { status: 400 });
  }

  const messages: Message[] = [];
  for (const item of body.messages) {
    if (!item || typeof item !== "object") continue;
    const candidate = item as { role?: unknown; content?: unknown };
    if (
      (candidate.role === "user" || candidate.role === "assistant") &&
      typeof candidate.content === "string" &&
      candidate.content.trim().length > 0 &&
      candidate.content.length <= 1000
    ) {
      messages.push({ role: candidate.role, content: candidate.content.trim() });
    }
  }

  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user");
  if (!latestUserMessage) {
    return NextResponse.json({ error: "Write a message to start the conversation." }, { status: 400 });
  }

  if (crisisPattern.test(latestUserMessage.content)) {
    return NextResponse.json({ reply: crisisReply, preview: true, safety: true }, { headers: { "Cache-Control": "no-store" } });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { reply: previewReply(specialist, latestUserMessage.content), preview: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: `${sharedInstructions}\n\n${specialistInstructions[specialist]}`,
        input: messages,
        max_output_tokens: 220,
        store: false,
      }),
      signal: AbortSignal.timeout(25000),
    });

    if (upstream.ok) {
      const providerData = (await upstream.json()) as ProviderResponse;
      const reply = extractText(providerData);
      if (reply) {
        return NextResponse.json({ reply, preview: false }, { headers: { "Cache-Control": "no-store" } });
      }
    }
  } catch {
    // Fall back to a clearly labeled scripted guide if the provider is unavailable.
  }

  return NextResponse.json(
    { reply: previewReply(specialist, latestUserMessage.content), preview: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}
