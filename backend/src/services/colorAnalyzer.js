import { getColorMeanings } from "../config/culturalRules.js";

/**
 * Analyze color scheme for cultural appropriateness
 * USES AI: NO — deterministic rule-based mapping
 */
export function analyzeColorScheme(colors, targetLocale, sourceLocale = "en-US") {
  const targetMeanings = getColorMeanings(targetLocale);
  const sourceMeanings = getColorMeanings(sourceLocale);

  const analysis = colors.map((colorInput) => {
    const hex = normalizeColor(colorInput);
    const targetInfo = targetMeanings[hex];
    const sourceInfo = sourceMeanings[hex];

    if (!targetInfo) {
      return {
        color: hex,
        colorName: getColorName(hex),
        status: "unknown",
        message: `No cultural data for ${hex} in ${targetLocale}`,
        appropriate: true,
        suggestions: [],
      };
    }

    return {
      color: hex,
      colorName: getColorName(hex),
      sourceContext: sourceInfo
        ? {
            meaning: sourceInfo.meaning,
            marketingUse: sourceInfo.marketingUse,
          }
        : null,
      targetContext: {
        meaning: targetInfo.meaning,
        marketingUse: targetInfo.marketingUse,
      },
      appropriate: targetInfo.appropriate,
      status: targetInfo.appropriate ? "safe" : "warning",
      message: targetInfo.appropriate
        ? `${getColorName(hex)} means "${targetInfo.meaning}" in ${targetLocale} — appropriate for marketing`
        : `⚠️ ${getColorName(hex)} means "${targetInfo.meaning}" in ${targetLocale} — may cause issues`,
      suggestions: targetInfo.appropriate
        ? []
        : Object.entries(targetMeanings)
            .filter(([_, info]) => info.appropriate)
            .map(([altHex, info]) => ({
              color: altHex,
              meaning: info.meaning,
              reason: `Consider ${getColorName(altHex)} (${altHex}) which means "${info.meaning}" in ${targetLocale}`,
            }))
            .slice(0, 3),
    };
  });

  const overallScore = calculateColorScore(analysis);

  return {
    colors: analysis,
    overallScore,
    overallStatus:
      overallScore >= 80
        ? "excellent"
        : overallScore >= 50
        ? "needs_review"
        : "problematic",
    summary: generateColorSummary(analysis, targetLocale),
  };
}

/**
 * Normalize color input to uppercase hex
 */
function normalizeColor(input) {
  if (typeof input === "string") {
    // Already hex
    if (input.startsWith("#")) return input.toUpperCase();
    // Color name
    const hex = colorNameToHex(input);
    return hex || input.toUpperCase();
  }
  return String(input).toUpperCase();
}

/**
 * Map common color names to hex
 */
function colorNameToHex(name) {
  const map = {
    red: "#FF0000",
    black: "#000000",
    white: "#FFFFFF",
    gold: "#FFD700",
    golden: "#FFD700",
    blue: "#0000FF",
    green: "#00FF00",
    pink: "#FF69B4",
    purple: "#800080",
    orange: "#FFA500",
    yellow: "#FFFF00",
  };
  return map[name.toLowerCase()] || null;
}

/**
 * Get human-readable color name from hex
 */
function getColorName(hex) {
  const names = {
    "#FF0000": "Red",
    "#000000": "Black",
    "#FFFFFF": "White",
    "#FFD700": "Gold",
    "#0000FF": "Blue",
    "#00FF00": "Green",
    "#FF69B4": "Pink",
    "#800080": "Purple",
    "#FFA500": "Orange",
    "#FFFF00": "Yellow",
    "#008000": "Dark Green",
    "#FF6600": "Saffron",
  };
  return names[hex] || hex;
}

/**
 * Calculate overall color scheme appropriateness score (0-100)
 */
function calculateColorScore(colorAnalysis) {
  if (colorAnalysis.length === 0) return 100;

  const scores = colorAnalysis.map((c) => {
    if (c.status === "unknown") return 70;
    return c.appropriate ? 100 : 20;
  });

  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

/**
 * Generate human-readable color summary
 */
function generateColorSummary(colorAnalysis, locale) {
  const problems = colorAnalysis.filter((c) => !c.appropriate);
  if (problems.length === 0) {
    return `All colors in your campaign are culturally appropriate for ${locale}.`;
  }

  const problemList = problems
    .map((p) => `${p.colorName} (${p.targetContext.meaning})`)
    .join(", ");

  return `⚠️ ${problems.length} color(s) may cause issues in ${locale}: ${problemList}. Consider alternatives.`;
}
