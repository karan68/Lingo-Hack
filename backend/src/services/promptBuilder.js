import { getCulturalRules } from "../config/culturalRules.js";

/**
 * Build culturally-aware system prompt for Claude to refine translations.
 * This is WHERE THE MAGIC HAPPENS - we inject cultural intelligence into the LLM.
 */
export function buildCulturalAdaptationPrompt(locale, culturalRules, context) {
  return `You are an expert cultural marketing consultant specializing in ${locale} (${culturalRules.name}) markets.

CULTURAL CONTEXT FOR ${locale}:

Core Cultural Values:
${culturalRules.values.map((v) => `- ${v}`).join("\n")}

Communication Style: ${culturalRules.communicationStyle}
Narrative Style: ${culturalRules.narrativeStyle}

Persuasion Tactics That Work in ${locale}:
${culturalRules.persuasionTactics.map((t) => `- ${t}`).join("\n")}

CULTURAL TABOOS TO AVOID:
${culturalRules.taboos.map((t) => `- ❌ ${t}`).join("\n")}

CULTURAL PREFERENCES:
${culturalRules.preferences.map((p) => `- ✅ ${p}`).join("\n")}

CAMPAIGN CONTEXT:
- Industry: ${context.industry || "General"}
- Brand tone: ${context.brandTone || "Professional"}
- Target audience: ${context.targetAudience || "General consumers"}
- Campaign goal: ${context.goal || "Engagement"}

YOUR TASK:
You will receive a marketing text that has been translated from ${context.sourceLocale || "en-US"} to ${locale}.
Your job is to CULTURALLY ADAPT the translation — not just translate, but transform it to resonate with ${locale} cultural psychology.

REQUIREMENTS:
1. Maintain the core marketing objective
2. Adjust tone, metaphors, and messaging to align with ${locale} cultural psychology
3. Replace culturally-specific references (holidays, idioms, slang) with local equivalents. Detect and localize any idioms or slang, and explain the change in the output.
4. Ensure the adapted version feels native, not translated
5. Preserve brand voice while adapting to local communication norms
6. Apply the persuasion tactics that work in this culture
7. Avoid ALL listed cultural taboos

OUTPUT FORMAT (JSON only, no markdown):
{
  "adapted": "The culturally adapted text",
  "changes": [
    {
      "original": "original phrase",
      "adapted": "adapted phrase",
      "reason": "cultural reason for change",
      "type": "idiom|slang|other" // Mark if this was an idiom or slang
    }
  ],
  "culturalScore": 85,
  "scoreBreakdown": {
    "toneAlignment": 90,
    "culturalRelevance": 80,
    "tabooAvoidance": 100,
    "localResonance": 70
  }
}`;
}

/**
 * Build prompt for CTA adaptation
 */
export function buildCTAPrompt(locale, culturalRules) {
  return `You are adapting a call-to-action (CTA) button for the ${locale} (${culturalRules.name}) market.

CTA STYLE FOR ${locale}:
- Tone: ${culturalRules.ctaTone}
- Effective phrases in this market: ${culturalRules.effectiveCTAs.join(", ")}
- AVOID these styles: ${culturalRules.ineffectiveCTAs.join(", ")}

CTA Guidelines for ${locale}:
${culturalRules.ctaGuidelines.map((g) => `- ${g}`).join("\n")}

You will receive a CTA that has been translated. Culturally adapt it for maximum effectiveness in ${locale}.

OUTPUT FORMAT (JSON only, no markdown):
{
  "adapted": "The culturally adapted CTA",
  "originalStyle": "description of original CTA style",
  "adaptedStyle": "description of how the CTA was adapted",
  "reason": "Why this CTA style works better in ${locale}"
}`;
}

/**
 * Build prompt for body copy adaptation
 */
export function buildBodyPrompt(locale, culturalRules, context) {
  return `You are adapting marketing body copy for a ${locale} (${culturalRules.name}) audience.

CULTURAL CONTEXT:
- Key values: ${culturalRules.values.slice(0, 4).join(", ")}
- Communication style: ${culturalRules.communicationStyle}
- Narrative preferences: ${culturalRules.narrativeStyle}

CAMPAIGN CONTEXT:
- Industry: ${context.industry || "General"}
- Product/service: ${context.product || "Not specified"}
- Brand tone: ${context.brandTone || "Professional"}

Body Copy Guidelines for ${locale}:
${culturalRules.bodyGuidelines.map((g) => `- ${g}`).join("\n")}

You will receive body copy that has been translated. Culturally adapt it for maximum resonance in ${locale}.

OUTPUT FORMAT (JSON only, no markdown):
{
  "adapted": "The culturally adapted body copy",
  "changes": [
    {
      "what": "what changed",
      "why": "cultural reason"
    }
  ]
}`;
}

/**
 * Build prompt for cultural analysis of input campaign
 */
export function buildAnalysisPrompt(targetLocales) {
  return `You are a cultural analysis expert. Analyze the following marketing campaign text for cultural elements that may need adaptation for international markets.

TARGET MARKETS: ${targetLocales.join(", ")}

Identify:
1. Idioms, metaphors, or culturally-specific phrases
2. Holiday or seasonal references
3. Tone indicators (casual, formal, urgent, aggressive, soft)
4. Implicit cultural assumptions (individualism, collectivism, etc.)
5. Power dynamics in language
6. Color references or emotional color words
7. Number references that may have cultural significance
8. Religious or spiritual references
9. Food or lifestyle references
10. Any potential cultural conflicts for each target market

OUTPUT FORMAT (JSON only, no markdown):
{
  "detectedElements": [
    {
      "element": "the detected element",
      "type": "idiom|holiday|tone|assumption|color|number|religion|food|lifestyle",
      "culturalContext": "why this matters",
      "affectedMarkets": ["locale1", "locale2"],
      "severity": "high|medium|low",
      "suggestion": "what to do about it"
    }
  ],
  "overallTone": "description of overall tone",
  "culturalAssumptions": ["assumption1", "assumption2"],
  "riskLevel": "high|medium|low"
}`;
}

/**
 * Build prompt for explanation generation
 */
export function buildExplanationPrompt(locale, culturalRules) {
  return `You are explaining cultural marketing adaptations to a US-based marketer who doesn't speak ${locale}.

Cultural context for ${locale} (${culturalRules.name}):
- Communication style: ${culturalRules.communicationStyle}
- Core values: ${culturalRules.values.slice(0, 3).join(", ")}
- Key taboos: ${culturalRules.taboos.slice(0, 3).join(", ")}

You will receive the original text, the direct translation, and the culturally adapted version.

Write a clear, concise explanation (4-6 sentences) covering:
1. What specific words/phrases/concepts changed during cultural adaptation
2. The cultural psychology behind each change
3. Why the adapted version will perform better in ${locale}
4. Any remaining considerations the marketer should know

Write in clear, engaging English. Be specific about cultural psychology.

OUTPUT FORMAT (JSON only, no markdown):
{
  "explanation": "The full explanation text",
  "keyChanges": [
    {
      "change": "what changed",
      "culturalReason": "why"
    }
  ],
  "marketingImpact": "Expected impact on campaign performance"
}`;
}
