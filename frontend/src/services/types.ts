// ===== Campaign Input Types =====

export interface CampaignInput {
  headline: string;
  cta: string;
  body: string;
  sourceLocale: string;
  industry: string;
  brandTone: string;
  goal: string;
  colors: string[];
  localeTones?: { [locale: string]: string };
}

// ===== API Response Types =====

export interface AdaptationResult {
  locale: string;
  localeName: string;
  original: {
    headline: string;
    cta: string;
    body: string;
  };
  translated: {
    headline: string;
    cta: string;
    body: string;
  };
  adapted: {
    headline: string;
    cta: string;
    body: string;
  };
  changes: {
    headline: CulturalChange[];
    cta: CulturalChange[];
    body: CulturalChange[];
  };
  culturalAnalysis: CulturalAnalysis;
  colorAnalysis: ColorAnalysis | null;
  explanation: ExplanationResult | null;
  culturalScore: CulturalScore;
  backTranslation?: {
    headline: string | null;
    cta: string | null;
    body: string | null;
  };
  consistencyScore?: number;
  timestamp: string;
  error?: string;
}

export interface CulturalChange {
  original?: string;
  adapted?: string;
  reason?: string;
  what?: string;
  why?: string;
  change?: string;
  culturalReason?: string;
}

export interface CulturalAnalysis {
  idioms: Idiom[];
  holidays: Holiday[];
  colors: ColorRef[];
  numbers: NumberIssue[];
  toneIndicators: ToneIndicator[];
  urgencyLevel: number;
  culturalConflicts: CulturalConflict[];
  sentiment?: string;
  emotions?: string[];
}

export interface Idiom {
  idiom: string;
  meaning: string;
  risk: string;
}

export interface Holiday {
  holiday: string;
  region: string;
}

export interface ColorRef {
  color: string;
  name: string;
}

export interface NumberIssue {
  number: number;
  locale: string;
  issue: string;
  severity: string;
}

export interface ToneIndicator {
  type: string;
  indicator: string;
  note: string;
}

export interface CulturalConflict {
  locale: string;
  type: string;
  element: string;
  severity: string;
  message: string;
}

export interface ColorAnalysis {
  colors: ColorResult[];
  overallScore: number;
  overallStatus: string;
  summary: string;
}

export interface ColorResult {
  color: string;
  colorName: string;
  appropriate: boolean;
  status: string;
  message: string;
  sourceContext: { meaning: string; marketingUse: string } | null;
  targetContext: { meaning: string; marketingUse: string };
  suggestions: ColorSuggestion[];
}

export interface ColorSuggestion {
  color: string;
  meaning: string;
  reason: string;
}

export interface ExplanationResult {
  explanation: string;
  keyChanges: { change: string; culturalReason: string }[];
  marketingImpact: string;
}

export interface CulturalScore {
  overall: number;
  breakdown: { name: string; score: number }[];
  conflictPenalty: number;
}

export interface ImageAnalysisResult {
  locale: string;
  localeName: string;
  caption: string;
  appropriate: boolean;
  severity: string;
  issues: ImageIssue[];
  suggestions: string[];
  score: number;
  modelInfo: {
    captioning: string;
    classification: string;
    type: string;
  };
}

export interface ImageIssue {
  type: string;
  severity: string;
  element: string;
  message: string;
  suggestion: string;
}

// ===== Locale Type =====

export interface Locale {
  code: string;
  name: string;
}

// ===== Adapt API Response =====

export interface AdaptResponse {
  success: boolean;
  adaptations: AdaptationResult[];
  totalLocales: number;
  successfulAdaptations: number;
}

// ===== Analysis API Response =====

export interface AnalysisResponse {
  success: boolean;
  analysis: {
    ruleBasedAnalysis: CulturalAnalysis;
    aiAnalysis: any;
    combined: CulturalAnalysis & {
      aiDetectedElements: any[];
      overallTone: string;
      culturalAssumptions: string[];
      riskLevel: string;
    };
  };
}

// ===== App State =====

export type AppStep = "input" | "loading" | "results";

export interface ImageAnalysisResponse {
  success: boolean;
  imageAnalysis: ImageAnalysisResult[];
}
