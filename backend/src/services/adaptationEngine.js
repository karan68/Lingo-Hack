import Groq from "groq-sdk";
import {
  buildCulturalAdaptationPrompt,
  buildCTAPrompt,
  buildBodyPrompt,
  buildAnalysisPrompt,
} from "./promptBuilder.js";
import { getCulturalRules } from "../config/culturalRules.js";
import { analyzeTextForCulturalElements } from "./culturalAnalyzer.js";
import { analyzeColorScheme } from "./colorAnalyzer.js";
import { generateExplanation } from "./explanationGenerator.js";

let groqClient = null;
let lingoDotDev = null;

const LLM_MODEL = "llama-3.3-70b-versatile";

/**
 * Initialize AI clients lazily
 */
async function getLLMClient() {
  if (!groqClient && process.env.GROQ_API_KEY) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
}

async function getLingoClient() {
  if (!lingoDotDev && process.env.LINGODOTDEV_API_KEY) {
    const { LingoDotDevEngine } = await import("lingo.dev/sdk");
    lingoDotDev = new LingoDotDevEngine({
      apiKey: process.env.LINGODOTDEV_API_KEY,
    });
  }
  return lingoDotDev;
}

/**
 * Full campaign adaptation pipeline for a single target locale
 *
 * Pipeline:
 * 1. Rule-based cultural analysis (no AI, instant)
 * 2. lingo.dev translation (AI - translation-optimized)
 * 3. Claude cultural adaptation (AI - reasoning + cultural refinement)
 * 4. Claude explanation generation (AI - transparency)
 */
export async function adaptCampaign(campaign, targetLocale) {
  const sourceLocale = campaign.sourceLocale || "en-US";
  const culturalRules = getCulturalRules(targetLocale);
  const context = {
    industry: campaign.industry || "General",
    brandTone: campaign.brandTone || "Professional",
    targetAudience: campaign.targetAudience || "General consumers",
    goal: campaign.goal || "Engagement",
    sourceLocale,
    product: campaign.product || "",
    benefits: campaign.benefits || [],
  };

  // STEP 1: Rule-based cultural analysis (instant, no API cost)
  const fullText = [campaign.headline, campaign.cta, campaign.body]
    .filter(Boolean)
    .join(" ");
  const culturalAnalysis = analyzeTextForCulturalElements(fullText, [
    targetLocale,
  ]);

  // STEP 2: Color analysis (if colors provided)
  let colorAnalysis = null;
  if (campaign.colors && campaign.colors.length > 0) {
    colorAnalysis = analyzeColorScheme(
      campaign.colors,
      targetLocale,
      sourceLocale
    );
  }

  // STEP 3: Translate with lingo.dev
  const lingo = await getLingoClient();
  let translatedHeadline = campaign.headline;
  let translatedCTA = campaign.cta;
  let translatedBody = campaign.body;

  if (lingo) {
    try {
      const translatePromises = [];

      if (campaign.headline) {
        translatePromises.push(
          lingo
            .localizeText(campaign.headline, { sourceLocale, targetLocale })
            .then((r) => (translatedHeadline = r))
        );
      }
      if (campaign.cta) {
        translatePromises.push(
          lingo
            .localizeText(campaign.cta, { sourceLocale, targetLocale })
            .then((r) => (translatedCTA = r))
        );
      }
      if (campaign.body) {
        translatePromises.push(
          lingo
            .localizeText(campaign.body, { sourceLocale, targetLocale })
            .then((r) => (translatedBody = r))
        );
      }

      await Promise.all(translatePromises);
    } catch (err) {
      console.error("lingo.dev translation failed:", err.message);
      // Continue with original text — Claude can still adapt
    }
  }

  // STEP 4: Culturally adapt with LLM (Groq/Llama)
  const llm = await getLLMClient();
  let headlineResult = {
    adapted: translatedHeadline,
    changes: [],
    culturalScore: 70,
  };
  let ctaResult = {
    adapted: translatedCTA,
    changes: [],
    culturalScore: 70,
  };
  let bodyResult = {
    adapted: translatedBody,
    changes: [],
    culturalScore: 70,
  };

  if (llm) {
    try {
      const adaptPromises = [];

      // Adapt headline
      if (campaign.headline) {
        adaptPromises.push(
          culturallyAdapt(
            llm,
            campaign.headline,
            translatedHeadline,
            targetLocale,
            culturalRules,
            context,
            "headline"
          ).then((r) => (headlineResult = r))
        );
      }

      // Adapt CTA
      if (campaign.cta) {
        adaptPromises.push(
          culturallyAdapt(
            llm,
            campaign.cta,
            translatedCTA,
            targetLocale,
            culturalRules,
            context,
            "cta"
          ).then((r) => (ctaResult = r))
        );
      }

      // Adapt body
      if (campaign.body) {
        adaptPromises.push(
          culturallyAdapt(
            llm,
            campaign.body,
            translatedBody,
            targetLocale,
            culturalRules,
            context,
            "body"
          ).then((r) => (bodyResult = r))
        );
      }

      await Promise.all(adaptPromises);
    } catch (err) {
      console.error("LLM adaptation failed:", err.message);
      // Fall back to lingo.dev translations
    }
  }

  // STEP 5: Generate explanation
  let explanation = null;
  if (llm) {
    try {
      explanation = await generateExplanation(llm, {
        originalHeadline: campaign.headline,
        originalCTA: campaign.cta,
        originalBody: campaign.body,
        translatedHeadline,
        translatedCTA,
        translatedBody,
        adaptedHeadline: headlineResult.adapted,
        adaptedCTA: ctaResult.adapted,
        adaptedBody: bodyResult.adapted,
        targetLocale,
        culturalRules,
      });
    } catch (err) {
      console.error("Explanation generation failed:", err.message);
    }
  }

  // STEP 6: Calculate overall cultural confidence score
  const culturalScore = calculateOverallScore(
    headlineResult,
    ctaResult,
    bodyResult,
    colorAnalysis,
    culturalAnalysis
  );

  return {
    locale: targetLocale,
    localeName: culturalRules.name,
    original: {
      headline: campaign.headline,
      cta: campaign.cta,
      body: campaign.body,
    },
    translated: {
      headline: translatedHeadline,
      cta: translatedCTA,
      body: translatedBody,
    },
    adapted: {
      headline: headlineResult.adapted,
      cta: ctaResult.adapted,
      body: bodyResult.adapted,
    },
    changes: {
      headline: headlineResult.changes || [],
      cta: ctaResult.changes || [],
      body: bodyResult.changes || [],
    },
    culturalAnalysis,
    colorAnalysis,
    explanation,
    culturalScore,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Culturally adapt a translated piece of text using Claude
 */
async function culturallyAdapt(
  llm,
  originalText,
  translatedText,
  targetLocale,
  culturalRules,
  context,
  type
) {
  let systemPrompt;
  if (type === "cta") {
    systemPrompt = buildCTAPrompt(targetLocale, culturalRules);
  } else if (type === "body") {
    systemPrompt = buildBodyPrompt(targetLocale, culturalRules, context);
  } else {
    systemPrompt = buildCulturalAdaptationPrompt(
      targetLocale,
      culturalRules,
      context
    );
  }

  const userMessage = `ORIGINAL (${context.sourceLocale || "en-US"}): "${originalText}"
TRANSLATED (${targetLocale}): "${translatedText}"

Culturally adapt the translated version for maximum resonance in ${targetLocale}. Respond with JSON only.`;

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
    // Try to parse JSON, handle potential markdown wrapping
    const jsonStr = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(jsonStr);

    return {
      adapted: parsed.adapted || translatedText,
      changes: parsed.changes || parsed.keyChanges || [],
      culturalScore: parsed.culturalScore || 75,
      scoreBreakdown: parsed.scoreBreakdown || null,
    };
  } catch (err) {
    console.error(`Cultural adaptation failed for ${type}:`, err.message);
    return {
      adapted: translatedText,
      changes: [],
      culturalScore: 60,
    };
  }
}

/**
 * Analyze campaign for cultural elements (AI-enhanced analysis)
 */
export async function analyzeCampaignWithAI(campaign, targetLocales) {
  // First: rule-based analysis (instant)
  const fullText = [campaign.headline, campaign.cta, campaign.body]
    .filter(Boolean)
    .join(" ");
  const ruleBasedAnalysis = analyzeTextForCulturalElements(
    fullText,
    targetLocales
  );

  // Then: AI-enhanced analysis (if LLM available)
  let aiAnalysis = null;
  const llm = await getLLMClient();

  if (llm) {
    try {
      const systemPrompt = buildAnalysisPrompt(targetLocales);
      const response = await llm.chat.completions.create({
        model: LLM_MODEL,
        temperature: 0.3,
        max_tokens: 1500,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Analyze this marketing campaign:\n\nHeadline: "${campaign.headline}"\nCTA: "${campaign.cta}"\nBody: "${campaign.body}"`,
          },
        ],
      });

      const text = response.choices[0].message.content;
      const jsonStr = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      aiAnalysis = JSON.parse(jsonStr);
    } catch (err) {
      console.error("AI analysis failed:", err.message);
    }
  }

  return {
    ruleBasedAnalysis,
    aiAnalysis,
    combined: mergeAnalyses(ruleBasedAnalysis, aiAnalysis),
  };
}

/**
 * Merge rule-based and AI analyses
 */
function mergeAnalyses(ruleBased, aiAnalysis) {
  return {
    idioms: ruleBased.idioms,
    holidays: ruleBased.holidays,
    colors: ruleBased.colors,
    numbers: ruleBased.numbers,
    toneIndicators: ruleBased.toneIndicators,
    urgencyLevel: ruleBased.urgencyLevel,
    culturalConflicts: ruleBased.culturalConflicts,
    aiDetectedElements: aiAnalysis?.detectedElements || [],
    overallTone: aiAnalysis?.overallTone || "Not analyzed",
    culturalAssumptions: aiAnalysis?.culturalAssumptions || [],
    riskLevel: aiAnalysis?.riskLevel || calculateRiskLevel(ruleBased),
  };
}

/**
 * Calculate risk level from rule-based analysis
 */
function calculateRiskLevel(analysis) {
  const highSeverity = analysis.culturalConflicts.filter(
    (c) => c.severity === "high"
  ).length;
  const medSeverity = analysis.culturalConflicts.filter(
    (c) => c.severity === "medium"
  ).length;

  if (highSeverity > 0) return "high";
  if (medSeverity > 1 || analysis.urgencyLevel > 70) return "medium";
  return "low";
}

/**
 * Calculate overall cultural confidence score (0-100)
 */
function calculateOverallScore(
  headlineResult,
  ctaResult,
  bodyResult,
  colorAnalysis,
  culturalAnalysis
) {
  const scores = [];

  // Component scores
  if (headlineResult.culturalScore)
    scores.push({ name: "Headline", score: headlineResult.culturalScore, weight: 3 });
  if (ctaResult.culturalScore)
    scores.push({ name: "CTA", score: ctaResult.culturalScore, weight: 2 });
  if (bodyResult.culturalScore)
    scores.push({ name: "Body Copy", score: bodyResult.culturalScore, weight: 3 });

  // Color score
  if (colorAnalysis) {
    scores.push({ name: "Color Scheme", score: colorAnalysis.overallScore, weight: 1 });
  }

  // Conflict penalty
  const highConflicts = culturalAnalysis.culturalConflicts.filter(
    (c) => c.severity === "high"
  ).length;
  const conflictPenalty = highConflicts * 10;

  if (scores.length === 0) return 70; // Default

  const totalWeight = scores.reduce((sum, s) => sum + s.weight, 0);
  const weightedSum = scores.reduce(
    (sum, s) => sum + s.score * s.weight,
    0
  );
  const baseScore = weightedSum / totalWeight;

  return {
    overall: Math.max(0, Math.round(baseScore - conflictPenalty)),
    breakdown: scores.map(({ name, score }) => ({ name, score })),
    conflictPenalty,
  };
}
