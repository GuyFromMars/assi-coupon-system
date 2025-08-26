import { NextResponse } from 'next/server';
import { getNlp } from '@/lib/nlp/nlp';

export async function POST(req) {
  try {
    const { text } = await req.json();
    const nlp = await getNlp();
    const result = await nlp.process('en', text);

    return NextResponse.json({
      intent: result.intent,
      score: result.score,
      reply: result.answer || "Sorry, I didn’t catch that.",
    });
  } catch (err) {
    console.error("NLP API error:", err);
    return NextResponse.json({ error: "NLP processing failed" }, { status: 500 });
  }
}
