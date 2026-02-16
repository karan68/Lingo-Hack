import express from "express";
import {
  adaptCampaign,
  analyzeCampaignWithAI,
} from "../services/adaptationEngine.js";

const router = express.Router();

/**
 * POST /api/campaign/analyze
 * Analyze campaign text for cultural elements before adaptation
 */
router.post("/analyze", async (req, res) => {
  try {
    const { campaign, targetLocales } = req.body;

    if (!campaign || !targetLocales || !Array.isArray(targetLocales)) {
      return res.status(400).json({
        success: false,
        error: "Invalid input: campaign object and targetLocales array required",
      });
    }

    const analysis = await analyzeCampaignWithAI(campaign, targetLocales);

    res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/campaign/adapt
 * Adapt campaign to a single target market with full cultural adaptation pipeline
 */
router.post("/adapt", async (req, res) => {
  try {
    const { campaign, targetLocales } = req.body;

    if (!campaign) {
      return res.status(400).json({
        success: false,
        error: "Campaign object required",
      });
    }

    if (!targetLocales || !Array.isArray(targetLocales) || targetLocales.length === 0) {
      return res.status(400).json({
        success: false,
        error: "At least one target locale required",
      });
    }

    // Process each locale sequentially (not batch — per project scope)
    const adaptations = [];
    for (const locale of targetLocales) {
      try {
        const result = await adaptCampaign(campaign, locale);
        adaptations.push(result);
      } catch (err) {
        console.error(`Adaptation failed for ${locale}:`, err.message);
        adaptations.push({
          locale,
          error: err.message,
        });
      }
    }

    res.json({
      success: true,
      adaptations,
      totalLocales: targetLocales.length,
      successfulAdaptations: adaptations.filter((a) => !a.error).length,
    });
  } catch (error) {
    console.error("Adaptation error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
