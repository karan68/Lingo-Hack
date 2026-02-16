import { buildExplanationPrompt } from "./promptBuilder.js";

const LLM_MODEL = "llama-3.3-70b-versatile";

/**
 * Generate human-readable explanation of cultural adaptation changes
 * USES AI: YES (Groq / Llama 3.3 70B)
 * WHY: Needs natural language generation + cultural reasoning
 */
export async function generateExplanation(llm, data) {
  const {
    originalHeadline,
    originalCTA,
    originalBody,
    translatedHeadline,
    translatedCTA,
    translatedBody,
    adaptedHeadline,
    adaptedCTA,
    adaptedBody,
    targetLocale,
    culturalRules,
  } = data;

  const systemPrompt = buildExplanationPrompt(targetLocale, culturalRules);

  const userMessage = `
ORIGINAL CAMPAIGN (en-US):
- Headline: "${originalHeadline}"
- CTA: "${originalCTA}"
- Body: "${originalBody}"

DIRECT TRANSLATION (${targetLocale}):
- Headline: "${translatedHeadline}"
- CTA: "${translatedCTA}"
- Body: "${translatedBody}"

CULTURALLY ADAPTED (${targetLocale}):
- Headline: "${adaptedHeadline}"
- CTA: "${adaptedCTA}"
- Body: "${adaptedBody}"

Explain the differences between the direct translation and the cultural adaptation. Why is the culturally adapted version better for ${targetLocale}?

Respond with JSON only.`;

  try {
    const response = await llm.chat.completions.create({
      model: LLM_MODEL,
      temperature: 0.3,
      max_tokens: 1000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    });

    const text = response.choices[0].message.content;
    const jsonStr = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Explanation generation failed:", err.message);
    return {
      explanation: `This campaign was adapted for ${culturalRules.name} (${targetLocale}) market, adjusting tone from ${culturalRules.communicationStyle} and incorporating local cultural values: ${culturalRules.values.slice(0, 3).join(", ")}.`,
      keyChanges: [],
      marketingImpact: "Cultural adaptation improves campaign relevance and consumer engagement.",
    };
  }
}
