import { getCulturalRules } from "../config/culturalRules.js";

/**
 * CTA Optimizer - Rule-based CTA recommendations
 * USES AI: NO (for deterministic recommendations)
 * AI-based custom CTA generation is handled by the adaptation engine
 */

// Pre-defined CTA mappings for common phrases
const ctaMappings = {
  "Buy Now": {
    "zh-CN": "立即了解 (Learn Now)",
    "ja-JP": "詳しく見る (See Details)",
    "ko-KR": "지금 확인하기 (Check Now)",
    "de-DE": "Jetzt entdecken (Discover Now)",
    "fr-FR": "Découvrir (Discover)",
    "es-MX": "Descubre más (Discover More)",
    "ar-SA": "اكتشف المزيد (Discover More)",
    "hi-IN": "अभी देखें (View Now)",
  },
  "Shop Now": {
    "zh-CN": "立即选购 (Browse & Select)",
    "ja-JP": "商品を見る (View Products)",
    "ko-KR": "쇼핑하기 (Shop)",
    "de-DE": "Jetzt shoppen (Shop Now)",
    "fr-FR": "Faire du shopping (Go Shopping)",
    "es-MX": "Comprar ahora (Shop Now)",
    "ar-SA": "تسوق الآن (Shop Now)",
    "hi-IN": "अभी शॉपिंग करें (Shop Now)",
  },
  "Sign Up": {
    "zh-CN": "免费注册 (Register Free)",
    "ja-JP": "無料登録 (Free Registration)",
    "ko-KR": "가입하기 (Sign Up)",
    "de-DE": "Kostenlos registrieren (Register Free)",
    "fr-FR": "S'inscrire (Sign Up)",
    "es-MX": "Registrarse (Register)",
    "ar-SA": "سجل الآن (Register Now)",
    "hi-IN": "अभी साइन अप करें (Sign Up Now)",
  },
  "Get Started": {
    "zh-CN": "开始使用 (Start Using)",
    "ja-JP": "始めましょう (Let's Begin)",
    "ko-KR": "시작하기 (Get Started)",
    "de-DE": "Jetzt starten (Start Now)",
    "fr-FR": "Commencer (Begin)",
    "es-MX": "Comenzar ahora (Start Now)",
    "ar-SA": "ابدأ الآن (Start Now)",
    "hi-IN": "अभी शुरू करें (Start Now)",
  },
  "Learn More": {
    "zh-CN": "了解更多 (Learn More)",
    "ja-JP": "詳細はこちら (Details Here)",
    "ko-KR": "자세히 보기 (See Details)",
    "de-DE": "Mehr erfahren (Learn More)",
    "fr-FR": "En savoir plus (Learn More)",
    "es-MX": "Conoce más (Learn More)",
    "ar-SA": "اعرف المزيد (Learn More)",
    "hi-IN": "और जानें (Learn More)",
  },
  "Try Free": {
    "zh-CN": "免费试用 (Free Trial)",
    "ja-JP": "無料でお試し (Try Free)",
    "ko-KR": "무료 체험 (Free Trial)",
    "de-DE": "Kostenlos testen (Test Free)",
    "fr-FR": "Essayer gratuitement (Try Free)",
    "es-MX": "Prueba gratis (Try Free)",
    "ar-SA": "جرب مجاناً (Try Free)",
    "hi-IN": "मुफ़्त में आज़माएं (Try Free)",
  },
  "Don't Miss Out": {
    "zh-CN": "精彩不容错过 (Wonderful Not to Be Missed)",
    "ja-JP": "この機会をお見逃しなく (Don't Miss This Opportunity)",
    "ko-KR": "놓치지 마세요 (Don't Miss It - polite)",
    "de-DE": "Nicht verpassen (Don't Miss)",
    "fr-FR": "Ne manquez pas (Don't Miss)",
    "es-MX": "No te lo pierdas (Don't Miss It)",
    "ar-SA": "لا تفوت الفرصة (Don't Miss the Opportunity)",
    "hi-IN": "मौका मत चूकिए (Don't Miss the Chance)",
  },
};

/**
 * Get optimized CTA for target locale
 */
export function optimizeCTA(originalCTA, targetLocale) {
  // Normalize the CTA
  const normalized = originalCTA.replace(/[!.]+$/, "").trim();

  // Check exact match
  if (ctaMappings[normalized]?.[targetLocale]) {
    return {
      original: originalCTA,
      recommended: ctaMappings[normalized][targetLocale],
      source: "pre-defined mapping",
      confidence: 0.95,
    };
  }

  // Check partial match
  for (const [key, mappings] of Object.entries(ctaMappings)) {
    if (
      normalized.toLowerCase().includes(key.toLowerCase()) &&
      mappings[targetLocale]
    ) {
      return {
        original: originalCTA,
        recommended: mappings[targetLocale],
        source: "partial match",
        confidence: 0.7,
      };
    }
  }

  // No match — suggest using AI adaptation
  const rules = getCulturalRules(targetLocale);
  return {
    original: originalCTA,
    recommended: null,
    source: "no match",
    confidence: 0,
    guideline: `For ${rules.name}, use a ${rules.ctaTone} tone. Effective examples: ${rules.effectiveCTAs.slice(0, 3).join(", ")}`,
    effectiveExamples: rules.effectiveCTAs,
  };
}

/**
 * Analyze CTA effectiveness for a locale
 */
export function analyzeCTAEffectiveness(cta, targetLocale) {
  const rules = getCulturalRules(targetLocale);
  let score = 50; // Default neutral score
  const feedback = [];

  // Check if CTA uses imperative/command form
  if (/^(buy|shop|get|grab|hurry|act|order|claim)/i.test(cta)) {
    if (["soft", "respectful", "elegant"].includes(rules.ctaTone)) {
      score -= 20;
      feedback.push({
        issue: "Command-form CTA",
        impact: "negative",
        suggestion: `${rules.name} consumers prefer invitational language over commands`,
      });
    } else {
      score += 10;
      feedback.push({
        issue: "Action-oriented CTA",
        impact: "positive",
        suggestion: "Direct CTAs work well in this market",
      });
    }
  }

  // Check for exclamation marks
  if (cta.includes("!")) {
    if (["soft", "respectful", "elegant"].includes(rules.ctaTone)) {
      score -= 10;
      feedback.push({
        issue: "Exclamation mark",
        impact: "negative",
        suggestion: `Remove exclamation marks for ${rules.name} market — perceived as too pushy`,
      });
    }
  }

  // Check for urgency words
  if (/limited|hurry|fast|now|quick|last/i.test(cta)) {
    if (rules.ctaTone === "soft") {
      score -= 15;
      feedback.push({
        issue: "Urgency language",
        impact: "negative",
        suggestion: `Avoid urgency pressure in ${rules.name} — focus on quality and discovery`,
      });
    }
  }

  return {
    cta,
    locale: targetLocale,
    effectivenessScore: Math.max(0, Math.min(100, score)),
    feedback,
    recommendedTone: rules.ctaTone,
    bestPractices: rules.ctaGuidelines,
  };
}
