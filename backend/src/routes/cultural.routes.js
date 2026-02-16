import express from "express";
import multer from "multer";
import {
  getSupportedLocales,
  getCulturalRules,
  getAllHolidayMappings,
} from "../config/culturalRules.js";
import { analyzeColorScheme } from "../services/colorAnalyzer.js";
import { optimizeCTA, analyzeCTAEffectiveness } from "../services/ctaOptimizer.js";
import {
  analyzeImageForCulturalIssues,
  analyzeImageForMultipleLocales,
} from "../services/imageAnalyzer.js";

const router = express.Router();

// Multer for image uploads (in-memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

/**
 * GET /api/cultural/locales
 * Get all supported locales
 */
router.get("/locales", (req, res) => {
  const locales = getSupportedLocales();
  res.json({ success: true, locales });
});

/**
 * GET /api/cultural/rules/:locale
 * Get cultural rules for a specific locale
 */
router.get("/rules/:locale", (req, res) => {
  try {
    const rules = getCulturalRules(req.params.locale);
    res.json({ success: true, locale: req.params.locale, rules });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/cultural/holidays
 * Get all holiday mappings
 */
router.get("/holidays", (req, res) => {
  const mappings = getAllHolidayMappings();
  res.json({ success: true, mappings });
});

/**
 * POST /api/cultural/analyze-colors
 * Analyze color scheme for cultural appropriateness
 */
router.post("/analyze-colors", (req, res) => {
  try {
    const { colors, targetLocale, sourceLocale } = req.body;

    if (!colors || !Array.isArray(colors) || !targetLocale) {
      return res.status(400).json({
        success: false,
        error: "colors array and targetLocale required",
      });
    }

    const analysis = analyzeColorScheme(colors, targetLocale, sourceLocale);
    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/cultural/optimize-cta
 * Get CTA optimization recommendation
 */
router.post("/optimize-cta", (req, res) => {
  try {
    const { cta, targetLocale } = req.body;

    if (!cta || !targetLocale) {
      return res.status(400).json({
        success: false,
        error: "cta and targetLocale required",
      });
    }

    const optimization = optimizeCTA(cta, targetLocale);
    const effectiveness = analyzeCTAEffectiveness(cta, targetLocale);

    res.json({
      success: true,
      optimization,
      effectiveness,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/cultural/analyze-image
 * Analyze uploaded image for cultural appropriateness (open-source models)
 */
router.post("/analyze-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Image file required",
      });
    }

    const targetLocales = req.body.targetLocales
      ? JSON.parse(req.body.targetLocales)
      : [req.body.targetLocale || "zh-CN"];

    const results = await analyzeImageForMultipleLocales(
      req.file.buffer,
      targetLocales
    );

    res.json({
      success: true,
      imageAnalysis: results,
    });
  } catch (error) {
    console.error("Image analysis error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
