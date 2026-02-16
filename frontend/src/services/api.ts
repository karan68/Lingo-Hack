import type {
  CampaignInput,
  AdaptResponse,
  AnalysisResponse,
  ImageAnalysisResponse,
  Locale,
} from "./types";

const API_BASE = "/api";

/**
 * Adapt campaign to target markets
 */
export async function adaptCampaign(
  campaign: CampaignInput,
  targetLocales: string[]
): Promise<AdaptResponse> {
  const response = await fetch(`${API_BASE}/campaign/adapt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ campaign, targetLocales }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Network error" }));
    throw new Error(err.error || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Analyze campaign for cultural elements
 */
export async function analyzeCampaign(
  campaign: CampaignInput,
  targetLocales: string[]
): Promise<AnalysisResponse> {
  const response = await fetch(`${API_BASE}/campaign/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ campaign, targetLocales }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Network error" }));
    throw new Error(err.error || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Analyze image for cultural issues
 */
export async function analyzeImage(
  imageFile: File,
  targetLocales: string[]
): Promise<ImageAnalysisResponse> {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("targetLocales", JSON.stringify(targetLocales));

  const response = await fetch(`${API_BASE}/cultural/analyze-image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Network error" }));
    throw new Error(err.error || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Get supported locales
 */
export async function getLocales(): Promise<Locale[]> {
  const response = await fetch(`${API_BASE}/cultural/locales`);
  const data = await response.json();
  return data.locales;
}

/**
 * Health check
 */
export async function healthCheck(): Promise<{
  status: string;
  services: Record<string, boolean>;
}> {
  const response = await fetch(`${API_BASE}/health`);
  return response.json();
}
