import { getCulturalRules } from "../config/culturalRules.js";
import {
  imageToText,
  imageClassification,
} from "@huggingface/inference";

/**
 * Image Analyzer using Open-Source Models via Hugging Face Inference API
 *
 * USES AI: YES (Hugging Face open-source models)
 * WHY: Visual understanding needed for cultural appropriateness checking
 *
 * Models used:
 * - Salesforce/blip-image-captioning-large (image-to-text description)
 * - google/vit-base-patch16-224 (classification)
 * - Then rule-based cultural analysis on the description
 *
 * ADVANTAGE over paid APIs:
 * - Open-source models (BLIP, ViT)
 * - Free tier available
 * - No vendor lock-in
 * - Transparent model behavior
 */

function getAccessToken() {
  return process.env.HF_API_KEY || null;
}

/**
 * Analyze an image for cultural appropriateness
 *
 * Pipeline:
 * 1. Generate image caption using BLIP (open-source)
 * 2. Classify image content
 * 3. Run rule-based cultural checks on description
 * 4. Score cultural appropriateness
 */
export async function analyzeImageForCulturalIssues(imageBuffer, targetLocale) {
  const culturalRules = getCulturalRules(targetLocale);

  // Step 1: Get image description using BLIP
  const caption = await generateImageCaption(imageBuffer);

  // Step 2: Classify image for content categories
  const classifications = await classifyImageContent(imageBuffer);

  // Step 3: Rule-based cultural analysis on description + classifications
  const culturalIssues = analyzeCaptionForCulturalIssues(
    caption,
    classifications,
    culturalRules,
    targetLocale
  );

  return {
    locale: targetLocale,
    localeName: culturalRules.name,
    caption,
    classifications,
    appropriate: culturalIssues.length === 0,
    severity:
      culturalIssues.length === 0
        ? "low"
        : culturalIssues.some((i) => i.severity === "high")
        ? "high"
        : "medium",
    issues: culturalIssues,
    suggestions: culturalIssues
      .filter((i) => i.suggestion)
      .map((i) => i.suggestion),
    score: calculateImageScore(culturalIssues),
    modelInfo: {
      captioning: "Salesforce/blip-image-captioning-large",
      classification: "google/vit-base-patch16-224",
      type: "Open-source (Hugging Face)",
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generate image caption using BLIP model
 */
async function generateImageCaption(imageBuffer) {
  const accessToken = getAccessToken();
  if (!accessToken) {
    return "Image analysis unavailable (no HF API key)";
  }

  try {
    const blob = new Blob([imageBuffer], { type: "image/jpeg" });
    const result = await imageToText({
      model: "Salesforce/blip-image-captioning-large",
      data: blob,
      accessToken,
    });

    return result.generated_text || "No caption generated";
  } catch (err) {
    console.error("Image captioning failed:", err.message);
    return "Caption generation failed";
  }
}

/**
 * Classify image content using ViT
 */
async function classifyImageContent(imageBuffer) {
  const accessToken = getAccessToken();
  if (!accessToken) return [];

  try {
    const blob = new Blob([imageBuffer], { type: "image/jpeg" });
    const results = await imageClassification({
      model: "google/vit-base-patch16-224",
      data: blob,
      accessToken,
    });

    return results.slice(0, 5).map((r) => ({
      label: r.label,
      confidence: Math.round(r.score * 100),
    }));
  } catch (err) {
    console.error("Image classification failed:", err.message);
    return [];
  }
}

/**
 * Analyze caption and classifications for cultural issues
 */
function analyzeCaptionForCulturalIssues(
  caption,
  classifications,
  culturalRules,
  locale
) {
  const issues = [];
  const lowerCaption = caption.toLowerCase();
  const classLabels = classifications.map((c) => c.label.toLowerCase());
  const allText = [lowerCaption, ...classLabels].join(" ");

  // Check food taboos
  for (const food of culturalRules.foodTaboos || []) {
    if (allText.includes(food.toLowerCase())) {
      issues.push({
        type: "food_taboo",
        severity: "high",
        element: food,
        message: `Image appears to contain ${food}, which is taboo in ${culturalRules.name}`,
        suggestion: `Remove or replace imagery containing ${food}. Use culturally appropriate alternatives.`,
      });
    }
  }

  // Check for alcohol
  const alcoholTerms = ["wine", "beer", "alcohol", "cocktail", "champagne", "whiskey", "vodka", "bottle of wine", "glass of wine"];
  if (culturalRules.foodTaboos?.includes("alcohol")) {
    for (const term of alcoholTerms) {
      if (allText.includes(term)) {
        issues.push({
          type: "alcohol",
          severity: "high",
          element: term,
          message: `Image appears to contain alcohol (${term}), which is prohibited in ${culturalRules.name} marketing`,
          suggestion: "Replace with non-alcoholic beverages or remove beverage imagery entirely.",
        });
        break;
      }
    }
  }

  // Check dress code issues
  const revealingTerms = ["bikini", "swimsuit", "underwear", "lingerie", "shirtless", "bare", "nude", "revealing"];
  if (culturalRules.dressCodes?.toLowerCase().includes("modest")) {
    for (const term of revealingTerms) {
      if (allText.includes(term)) {
        issues.push({
          type: "modesty",
          severity: "high",
          element: term,
          message: `Image may contain revealing clothing (${term}), which conflicts with ${culturalRules.name} modesty standards`,
          suggestion: `Use imagery with modest clothing appropriate for ${culturalRules.name} culture.`,
        });
        break;
      }
    }
  }

  // Check for religious sensitivity
  const religiousTerms = ["church", "cross", "bible", "mosque", "temple", "buddha", "prayer", "worship"];
  for (const term of religiousTerms) {
    if (allText.includes(term)) {
      issues.push({
        type: "religious_sensitivity",
        severity: "medium",
        element: term,
        message: `Image contains religious element (${term}) — verify appropriateness for ${culturalRules.name}`,
        suggestion: `Review if religious imagery is appropriate or could be offensive in ${culturalRules.name} context.`,
      });
      break;
    }
  }

  // Check for animal sensitivities
  const animalIssues = {
    "hi-IN": ["cow", "beef", "cattle"],
    "ar-SA": ["pig", "pork", "dog"],
    "zh-CN": ["dog"],
  };

  if (animalIssues[locale]) {
    for (const animal of animalIssues[locale]) {
      if (allText.includes(animal)) {
        issues.push({
          type: "animal_sensitivity",
          severity: "medium",
          element: animal,
          message: `Image may contain ${animal} which has cultural sensitivity in ${culturalRules.name}`,
          suggestion: `Consider removing or replacing ${animal} imagery for ${culturalRules.name} market.`,
        });
      }
    }
  }

  // Check gestures (from classification labels)
  const gestureIssues = ["thumbs up", "ok sign", "pointing", "peace sign"];
  for (const gesture of gestureIssues) {
    if (allText.includes(gesture)) {
      issues.push({
        type: "gesture",
        severity: "low",
        element: gesture,
        message: `Image may contain "${gesture}" gesture — verify cultural appropriateness in ${culturalRules.name}`,
        suggestion: `Some hand gestures have different meanings across cultures. Verify "${gesture}" is appropriate.`,
      });
    }
  }

  return issues;
}

/**
 * Calculate image cultural appropriateness score (0-100)
 */
function calculateImageScore(issues) {
  if (issues.length === 0) return 100;

  let score = 100;
  for (const issue of issues) {
    switch (issue.severity) {
      case "high":
        score -= 30;
        break;
      case "medium":
        score -= 15;
        break;
      case "low":
        score -= 5;
        break;
    }
  }

  return Math.max(0, score);
}

/**
 * Analyze image for multiple target locales
 */
export async function analyzeImageForMultipleLocales(imageBuffer, targetLocales) {
  const results = [];

  for (const locale of targetLocales) {
    try {
      const analysis = await analyzeImageForCulturalIssues(imageBuffer, locale);
      results.push(analysis);
    } catch (err) {
      console.error(`Image analysis failed for ${locale}:`, err.message);
      results.push({
        locale,
        error: err.message,
        appropriate: true,
        severity: "unknown",
        issues: [],
        score: 50,
      });
    }
  }

  return results;
}
