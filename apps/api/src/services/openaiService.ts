import { openai } from "../lib/openai.js";

export async function chatJson(userContent: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    temperature: 0.2,
    messages: [
      { role: "system", content: "You are a friendly math tutor for kids. Keep answers short (1–2 sentences)." },
      { role: "user", content: userContent },
    ],
  });
  return completion.choices?.[0]?.message?.content ?? "{}";
}
