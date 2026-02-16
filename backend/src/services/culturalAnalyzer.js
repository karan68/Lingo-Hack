import { getCulturalRules, getHolidayMapping } from "../config/culturalRules.js";

/**
 * Analyze campaign text for cultural elements using rule-based detection.
 * No AI required — fast, deterministic, and cost-free.
 */

// Simple sentiment and emotion analysis (English, extendable)
function analyzeSentimentAndEmotion(text) {
  // Very basic: look for positive/negative words and some emotion keywords
  const positiveWords = ["good", "great", "excellent", "happy", "love", "amazing", "win", "success", "joy", "excited", "best", "positive", "enjoy"];
  const negativeWords = ["bad", "poor", "sad", "hate", "angry", "fail", "loss", "worst", "negative", "problem", "fear", "worry", "concern"];
  const emotionMap = {
    joy: ["happy", "joy", "delight", "excited", "love", "enjoy"],
    anger: ["angry", "mad", "furious", "rage", "hate"],
    sadness: ["sad", "cry", "tears", "unhappy", "loss"],
    fear: ["fear", "scared", "afraid", "worry", "concern"],
    surprise: ["surprise", "amazed", "shocked", "astonished"],
    trust: ["trust", "secure", "safe", "confident"],
    anticipation: ["anticipate", "expect", "hope", "await"],
    disgust: ["disgust", "gross", "nasty", "repulsed"]
  };
  const lower = text.toLowerCase();
  let score = 0;
  let detectedEmotions = [];
  for (const w of positiveWords) if (lower.includes(w)) score++;
  for (const w of negativeWords) if (lower.includes(w)) score--;
  for (const [emotion, words] of Object.entries(emotionMap)) {
    if (words.some((w) => lower.includes(w))) detectedEmotions.push(emotion);
  }
  let sentiment = "neutral";
  if (score > 0) sentiment = "positive";
  else if (score < 0) sentiment = "negative";
  return {
    sentiment,
    emotions: detectedEmotions.length > 0 ? detectedEmotions : ["neutral"]
  };
}

export function analyzeTextForCulturalElements(text, targetLocales) {
  const sentimentEmotion = analyzeSentimentAndEmotion(text);
  const results = {
    idioms: detectIdioms(text),
    holidays: detectHolidays(text),
    colors: extractColorReferences(text),
    numbers: detectSensitiveNumbers(text, targetLocales),
    toneIndicators: detectToneIndicators(text),
    urgencyLevel: detectUrgencyLevel(text),
    culturalConflicts: [],
    sentiment: sentimentEmotion.sentiment,
    emotions: sentimentEmotion.emotions,
  };

  // Check each target locale for conflicts
  for (const locale of targetLocales) {
    try {
      const rules = getCulturalRules(locale);
      const conflicts = detectConflicts(text, rules, locale);
      results.culturalConflicts.push(...conflicts);
    } catch (e) {
      // Skip if no rules for locale
    }
  }

  return results;
}

/**
 * Detect common English idioms that don't translate well
 */
function detectIdioms(text) {
  const idiomPatterns = [
    { pattern: /break a leg/i, idiom: "break a leg", meaning: "Good luck", risk: "Literal translation sounds violent" },
    { pattern: /hit the ground running/i, idiom: "hit the ground running", meaning: "Start quickly", risk: "Metaphor doesn't exist in most languages" },
    { pattern: /piece of cake/i, idiom: "piece of cake", meaning: "Easy", risk: "Food-based idiom doesn't translate" },
    { pattern: /kill(ing)?\s*(it|the game)/i, idiom: "killing it", meaning: "Doing well", risk: "Violence metaphor can offend" },
    { pattern: /blow\s*out/i, idiom: "blowout", meaning: "Big sale", risk: "May translate literally to explosion" },
    { pattern: /don'?t\s+miss\s+out/i, idiom: "don't miss out", meaning: "Act now", risk: "FOMO-based, aggressive in collectivist cultures" },
    { pattern: /no\s+brainer/i, idiom: "no-brainer", meaning: "Easy decision", risk: "Can imply lack of intelligence needed" },
    { pattern: /bang\s+for\s+(your|the)\s+buck/i, idiom: "bang for your buck", meaning: "Good value", risk: "Doesn't translate literally" },
    { pattern: /best\s+thing\s+since\s+sliced\s+bread/i, idiom: "best thing since sliced bread", meaning: "Great innovation", risk: "Culturally specific to Western bread culture" },
    { pattern: /game\s*changer/i, idiom: "game changer", meaning: "Revolutionary", risk: "Sports metaphor, not universal" },
    { pattern: /level\s+up/i, idiom: "level up", meaning: "Improve", risk: "Gaming reference, may not resonate everywhere" },
    { pattern: /take\s+it\s+to\s+the\s+next\s+level/i, idiom: "take it to the next level", meaning: "Improve drastically", risk: "Overused, may feel hollow in direct cultures" },
  ];

  return idiomPatterns
    .filter((p) => p.pattern.test(text))
    .map(({ pattern, ...rest }) => rest);
}

/**
 * Detect holiday references in the text
 */
function detectHolidays(text) {
  const holidayPatterns = [
    { pattern: /black\s+friday/i, holiday: "Black Friday", region: "US" },
    { pattern: /cyber\s+monday/i, holiday: "Cyber Monday", region: "US" },
    { pattern: /christmas|xmas|x-mas/i, holiday: "Christmas", region: "Western" },
    { pattern: /thanksgiving/i, holiday: "Thanksgiving", region: "US" },
    { pattern: /halloween/i, holiday: "Halloween", region: "US/Western" },
    { pattern: /valentine'?s?\s*(day)?/i, holiday: "Valentine's Day", region: "Western" },
    { pattern: /easter/i, holiday: "Easter", region: "Western/Christian" },
    { pattern: /4th\s+of\s+july|july\s+4(th)?|independence\s+day/i, holiday: "4th of July", region: "US" },
    { pattern: /memorial\s+day/i, holiday: "Memorial Day", region: "US" },
    { pattern: /labor\s+day/i, holiday: "Labor Day", region: "US" },
    { pattern: /new\s+year/i, holiday: "New Year", region: "Global" },
    { pattern: /super\s+bowl/i, holiday: "Super Bowl", region: "US" },
    { pattern: /prime\s+day/i, holiday: "Prime Day", region: "US/Global" },
  ];

  return holidayPatterns
    .filter((p) => p.pattern.test(text))
    .map(({ pattern, ...rest }) => rest);
}

/**
 * Extract color references from text
 */
function extractColorReferences(text) {
  const colorWords = [
    { pattern: /\bred\b/i, color: "#FF0000", name: "red" },
    { pattern: /\bblack\b/i, color: "#000000", name: "black" },
    { pattern: /\bwhite\b/i, color: "#FFFFFF", name: "white" },
    { pattern: /\bgold(en)?\b/i, color: "#FFD700", name: "gold" },
    { pattern: /\bblue\b/i, color: "#0000FF", name: "blue" },
    { pattern: /\bgreen\b/i, color: "#00FF00", name: "green" },
    { pattern: /\bpink\b/i, color: "#FF69B4", name: "pink" },
    { pattern: /\bpurple\b/i, color: "#800080", name: "purple" },
    { pattern: /\borange\b/i, color: "#FFA500", name: "orange" },
  ];

  // Also detect hex codes
  const hexPattern = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/g;
  const hexMatches = [...text.matchAll(hexPattern)].map((m) => ({
    color: m[0].toUpperCase(),
    name: `hex ${m[0]}`,
  }));

  const wordMatches = colorWords
    .filter((c) => c.pattern.test(text))
    .map(({ pattern, ...rest }) => rest);

  return [...wordMatches, ...hexMatches];
}

/**
 * Detect numbers that may be culturally sensitive
 */
function detectSensitiveNumbers(text, targetLocales) {
  const numbers = [];
  const numberPattern = /\b(\d+)\b/g;
  let match;

  while ((match = numberPattern.exec(text)) !== null) {
    const num = parseInt(match[1]);
    for (const locale of targetLocales) {
      try {
        const rules = getCulturalRules(locale);
        if (rules.numberTaboos?.includes(num)) {
          numbers.push({
            number: num,
            locale,
            issue: `Number ${num} is considered unlucky/taboo in ${rules.name}`,
            severity: "medium",
          });
        }
      } catch (e) {
        // Skip
      }
    }
  }

  return numbers;
}

/**
 * Detect tone indicators in text
 */
function detectToneIndicators(text) {
  const indicators = [];

  // Exclamation marks = urgency/excitement
  const exclamationCount = (text.match(/!/g) || []).length;
  if (exclamationCount > 0) {
    indicators.push({
      type: "urgency",
      indicator: `${exclamationCount} exclamation mark(s)`,
      note: "May feel too aggressive in indirect cultures (Japan, China)",
    });
  }

  // ALL CAPS words
  const capsWords = text.match(/\b[A-Z]{2,}\b/g) || [];
  if (capsWords.length > 0) {
    indicators.push({
      type: "shouting",
      indicator: `ALL CAPS words: ${capsWords.join(", ")}`,
      note: "Perceived as shouting; inappropriate in polite/indirect cultures",
    });
  }

  // Imperative verbs at start
  const imperatives = /^(buy|shop|get|grab|hurry|act|order|save|claim|join|start|try|discover)\b/im;
  if (imperatives.test(text)) {
    indicators.push({
      type: "command",
      indicator: "Imperative/command tone detected",
      note: "Direct commands may offend in hierarchical or indirect cultures",
    });
  }

  // Scarcity/FOMO language
  const scarcity = /limited\s+(time|stock|offer|edition)|hurry|last\s+chance|while\s+supplies\s+last|only\s+\d+\s+left|don'?t\s+miss|act\s+now|before\s+it'?s?\s+too\s+late/i;
  if (scarcity.test(text)) {
    indicators.push({
      type: "scarcity",
      indicator: "FOMO/scarcity language detected",
      note: "Pressure tactics alienate Japanese, German, and some Asian consumers",
    });
  }

  return indicators;
}

/**
 * Calculate urgency level from 0 (calm) to 100 (hyper-urgent)
 */
function detectUrgencyLevel(text) {
  let score = 0;
  const exclamations = (text.match(/!/g) || []).length;
  score += Math.min(exclamations * 10, 30);

  if (/limited\s+time|act\s+now|hurry/i.test(text)) score += 20;
  if (/last\s+chance|don'?t\s+miss/i.test(text)) score += 15;
  if (/\b(NOW|TODAY|FAST|URGENT)\b/.test(text)) score += 15;
  if (/\d+%\s*off/i.test(text)) score += 10;
  if (/free|bonus|extra/i.test(text)) score += 5;

  return Math.min(score, 100);
}

/**
 * Detect cultural conflicts for a specific locale
 */
function detectConflicts(text, culturalRules, locale) {
  const conflicts = [];
  const lowerText = text.toLowerCase();

  // Check food taboos
  for (const food of culturalRules.foodTaboos || []) {
    if (lowerText.includes(food.toLowerCase())) {
      conflicts.push({
        locale,
        type: "food_taboo",
        element: food,
        severity: "high",
        message: `Reference to "${food}" is taboo in ${culturalRules.name}`,
      });
    }
  }

  // Check for taboo patterns
  for (const taboo of culturalRules.taboos || []) {
    const tabooWords = taboo.toLowerCase().split(/\s+/);
    const keyWord = tabooWords[tabooWords.length - 1];
    if (keyWord.length > 3 && lowerText.includes(keyWord)) {
      conflicts.push({
        locale,
        type: "cultural_taboo",
        element: taboo,
        severity: "medium",
        message: `Potential conflict with ${culturalRules.name} taboo: "${taboo}"`,
      });
    }
  }

  // Check tone vs culture
  const urgency = detectUrgencyLevel(text);
  if (
    urgency > 50 &&
    culturalRules.ctaTone &&
    ["soft", "respectful", "elegant"].includes(culturalRules.ctaTone)
  ) {
    conflicts.push({
      locale,
      type: "tone_mismatch",
      element: `Urgency level ${urgency}/100`,
      severity: "high",
      message: `High-urgency tone (${urgency}/100) conflicts with ${culturalRules.name}'s preferred "${culturalRules.ctaTone}" communication style`,
    });
  }

  return conflicts;
}
