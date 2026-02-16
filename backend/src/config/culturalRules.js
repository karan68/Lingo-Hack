import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataPath = join(__dirname, "..", "data", "culturalRules.json");
const culturalData = JSON.parse(readFileSync(dataPath, "utf-8"));

/**
 * Get cultural rules for a specific locale
 */
export function getCulturalRules(locale) {
  const rules = culturalData.locales[locale];
  if (!rules) {
    // Fallback: try base language code
    const baseLocale = Object.keys(culturalData.locales).find((k) =>
      k.startsWith(locale.split("-")[0])
    );
    if (baseLocale) return culturalData.locales[baseLocale];
    throw new Error(`No cultural rules found for locale: ${locale}`);
  }
  return rules;
}

/**
 * Get all supported locales
 */
export function getSupportedLocales() {
  return Object.entries(culturalData.locales).map(([code, data]) => ({
    code,
    name: data.name,
  }));
}

/**
 * Get holiday mapping for a specific source holiday
 */
export function getHolidayMapping(sourceHoliday, targetLocale) {
  const mappings = culturalData.holidayMappings[sourceHoliday];
  if (!mappings) return null;
  return mappings[targetLocale] || null;
}

/**
 * Get all holiday mappings
 */
export function getAllHolidayMappings() {
  return culturalData.holidayMappings;
}

/**
 * Get color meaning for a specific locale
 */
export function getColorMeaning(hexColor, locale) {
  const rules = getCulturalRules(locale);
  const upperHex = hexColor.toUpperCase();
  return rules.colorMeanings?.[upperHex] || null;
}

/**
 * Get all color meanings for a locale
 */
export function getColorMeanings(locale) {
  const rules = getCulturalRules(locale);
  return rules.colorMeanings || {};
}
