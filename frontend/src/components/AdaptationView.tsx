import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  Download,
  Globe,
  Languages,
  Brain,
  Wand2,
  Brush,
    Smile,
} from "lucide-react";
import type { AdaptationResult, ImageAnalysisResult } from "../services/types";
import { CulturalScoreCard } from "./CulturalScoreCard";
import { ExplanationPanel } from "./ExplanationPanel";
import { AnalysisDashboard } from "./AnalysisDashboard";
import { ColorAnalyzerPanel } from "./ColorAnalyzer";

interface Props {
  adaptations: AdaptationResult[];
  imageAnalysis: ImageAnalysisResult[] | null;
  onBack: () => void;
}

export function AdaptationView({ adaptations, imageAnalysis, onBack }: Props) {
  const [selectedLocale, setSelectedLocale] = useState(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const current = adaptations[selectedLocale];
  if (!current) return null;

  // Advanced feature extraction helpers for backward compatibility
  // Idiom/Slang localization: try current.culturalAnalysis.idioms or current.idiomSlang
  const idiomSlang = (current as any).idiomSlang || (current.culturalAnalysis && current.culturalAnalysis.idioms && current.culturalAnalysis.idioms.length > 0
    ? { localized: current.culturalAnalysis.idioms.map((i: any) => ({ original: i.idiom, localized: i.meaning, explanation: i.risk })) }
    : null);
  // Sentiment/Emotion: try current.sentiment or current.culturalAnalysis.sentiment
  const sentiment = (current as any).sentiment || (current.culturalAnalysis && current.culturalAnalysis.sentiment
    ? { label: current.culturalAnalysis.sentiment, score: 1, emotion: (current.culturalAnalysis.emotions && current.culturalAnalysis.emotions[0]) || undefined }
    : null);
  // Tone: try current.tone or current.culturalAnalysis.toneIndicators
  const tone = (current as any).tone || (current.culturalAnalysis && current.culturalAnalysis.toneIndicators && current.culturalAnalysis.toneIndicators.length > 0
    ? { requested: (current as any).requestedTone || undefined, detected: current.culturalAnalysis.toneIndicators[0].type, matchScore: 100 }
    : null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const exportAsJSON = () => {
    const data = JSON.stringify(adaptations, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cultural-adaptations.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentImageAnalysis = imageAnalysis?.find(
    (ia) => ia.locale === current.locale
  );

  return (
    <div className="space-y-6 fade-in-up">
      {/* === Advanced Adaptation Insights === */}
      <div className="flex items-center gap-2 mb-2">
        <Wand2 className="w-4 h-4 text-pink-400" />
        <h2 className="text-lg font-semibold text-white">Advanced Adaptation Insights</h2>
      </div>

      {/* Divider for end of advanced features */}
      <div className="border-t border-gray-700 my-6" />

      {/* Fallback if no advanced features present */}
      {!current.backTranslation && !idiomSlang && !sentiment && !tone && (
        <div className="text-gray-400 text-sm italic text-center">No advanced adaptation insights available for this locale.</div>
      )}

      {/* Back-Translation (for verification) - moved to bottom, no score */}
      {current.backTranslation && (
        <div className="glass-card rounded-xl p-5 mt-6 border-l-4 border-indigo-500/60">
          <h4 className="text-sm font-bold text-indigo-300 mb-2 flex items-center gap-2">
            <Languages className="w-4 h-4 text-indigo-400" /> Back-Translation <span className="text-xs text-gray-400">(for verification)</span>
          </h4>
          <div className="flex flex-wrap gap-4 items-center text-xs">
            <div>
              <span className="text-gray-400">Headline:</span> <span className="text-gray-200 font-mono">{current.backTranslation.headline || "-"}</span>
            </div>
            <div>
              <span className="text-gray-400">CTA:</span> <span className="text-gray-200 font-mono">{current.backTranslation.cta || "-"}</span>
            </div>
            <div>
              <span className="text-gray-400">Body:</span> <span className="text-gray-200 font-mono">{current.backTranslation.body || "-"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Idiom & Slang Localizer */}
      {idiomSlang && (
        <div className="glass-card rounded-xl p-5 mb-2 border-l-4 border-pink-500/60">
          <h4 className="text-sm font-bold text-pink-300 mb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-pink-400" /> Idiom & Slang Localization
          </h4>
          <div className="text-xs text-gray-200">
            {idiomSlang.localized && idiomSlang.localized.length > 0 ? (
              <ul className="list-disc ml-5">
                {idiomSlang.localized.map((item: any, idx: number) => (
                  <li key={idx}>
                    <span className="font-semibold text-pink-200">{item.original}</span> → <span className="text-pink-100">{item.localized}</span>
                    {item.explanation && <span className="text-gray-400 ml-2">({item.explanation})</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-gray-400">No idioms or slang detected in this adaptation.</span>
            )}
          </div>
        </div>
      )}

      {/* Sentiment & Emotion Analysis */}
      {sentiment && (
        <div className="glass-card rounded-xl p-5 mb-2 border-l-4 border-amber-500/60">
          <h4 className="text-sm font-bold text-amber-300 mb-2 flex items-center gap-2">
            <Smile className="w-4 h-4 text-amber-400" /> Sentiment & Emotion
          </h4>
          <div className="flex flex-wrap gap-4 items-center text-xs">
            <div>
              <span className="text-gray-400">Sentiment:</span> <span className="font-semibold text-amber-200">{sentiment.label}</span>
            </div>
            <div>
              <span className="text-gray-400">Score:</span> <span className="text-amber-100">{(sentiment.score * 100).toFixed(1)}%</span>
            </div>
            {sentiment.emotion && (
              <div>
                <span className="text-gray-400">Emotion:</span> <span className="text-amber-100">{sentiment.emotion}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tone Matching */}
      {tone && (
        <div className="glass-card rounded-xl p-5 mb-2 border-l-4 border-cyan-500/60">
          <h4 className="text-sm font-bold text-cyan-300 mb-2 flex items-center gap-2">
            <Brush className="w-4 h-4 text-cyan-400" /> Tone Matching
          </h4>
          <div className="flex flex-wrap gap-4 items-center text-xs">
            <div>
              <span className="text-gray-400">Requested Tone:</span> <span className="text-cyan-200 font-semibold">{tone.requested || "-"}</span>
            </div>
            <div>
              <span className="text-gray-400">Detected Tone:</span> <span className="text-cyan-100">{tone.detected || "-"}</span>
            </div>
            <div>
              <span className="text-gray-400">Match Score:</span> <span className={`font-bold ${tone.matchScore >= 80 ? "text-emerald-400" : tone.matchScore >= 60 ? "text-amber-400" : "text-red-400"}`}>{tone.matchScore ?? "-"}/100</span>
            </div>
          </div>
        </div>
      )}

      {/* Divider for end of advanced features */}
      <div className="border-t border-gray-700 my-6" />

      {/* Fallback if no advanced features present */}
      {!current.backTranslation && !idiomSlang && !sentiment && !tone && (
        <div className="text-gray-400 text-sm italic text-center">No advanced adaptation insights available for this locale.</div>
      )}
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          New Campaign
        </button>
        <button
          onClick={exportAsJSON}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 text-sm transition-all"
        >
          <Download className="w-4 h-4" />
          Export JSON
        </button>
      </div>

      {/* Locale Tabs */}
      <div className="flex flex-wrap gap-2">
        {adaptations.map((adaptation, i) => (
          <button
            key={adaptation.locale}
            onClick={() => setSelectedLocale(i)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              i === selectedLocale
                ? "bg-indigo-500/20 border border-indigo-500/40 text-white"
                : adaptation.error
                ? "bg-red-500/10 border border-red-500/20 text-red-400"
                : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            {adaptation.localeName || adaptation.locale}
            {adaptation.culturalScore && !adaptation.error && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  adaptation.culturalScore.overall >= 80
                    ? "bg-emerald-500/20 text-emerald-400"
                    : adaptation.culturalScore.overall >= 60
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {adaptation.culturalScore.overall}
              </span>
            )}
          </button>
        ))}
      </div>

      {current.error ? (
        <div className="glass-card rounded-xl p-8 text-center">
          <p className="text-red-400">Failed to adapt for {current.locale}: {current.error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Three-column comparison */}
          <div className="lg:col-span-2 space-y-4">
            {/* Headline Comparison */}
            <ComparisonRow
              label="Headline"
              original={current.original.headline}
              translated={current.translated.headline}
              adapted={current.adapted.headline}
              copiedField={copiedField}
              onCopy={(text) => copyToClipboard(text, "headline")}
              copyFieldName="headline"
            />

            {/* CTA Comparison */}
            <ComparisonRow
              label="Call-to-Action"
              original={current.original.cta}
              translated={current.translated.cta}
              adapted={current.adapted.cta}
              copiedField={copiedField}
              onCopy={(text) => copyToClipboard(text, "cta")}
              copyFieldName="cta"
            />

            {/* Body Comparison */}
            <ComparisonRow
              label="Body Copy"
              original={current.original.body}
              translated={current.translated.body}
              adapted={current.adapted.body}
              copiedField={copiedField}
              onCopy={(text) => copyToClipboard(text, "body")}
              copyFieldName="body"
              multiline
            />

            {/* Explanation */}
            <ExplanationPanel
              explanation={current.explanation}
              changes={current.changes}
              locale={current.locale}
            />

            {/* Image Analysis */}
            {currentImageAnalysis && (
              <div className="glass-card rounded-xl p-5 space-y-3">
                <h4 className="text-sm font-medium text-white flex items-center gap-2">
                  🖼️ Image Analysis
                  <span className="text-xs text-gray-500">
                    ({currentImageAnalysis.modelInfo?.type})
                  </span>
                </h4>
                <p className="text-xs text-gray-400">
                  Caption: "{currentImageAnalysis.caption}"
                </p>
                {currentImageAnalysis.issues.length > 0 ? (
                  <div className="space-y-2">
                    {currentImageAnalysis.issues.map((issue, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-2 px-3 py-2 rounded-lg border ${
                          issue.severity === "high"
                            ? "bg-red-500/5 border-red-500/20"
                            : "bg-amber-500/5 border-amber-500/10"
                        }`}
                      >
                        <span className="text-xs">
                          {issue.severity === "high" ? "🔴" : "🟡"}
                        </span>
                        <div className="text-xs">
                          <span className="text-gray-300">
                            {issue.message}
                          </span>
                          {issue.suggestion && (
                            <p className="text-gray-500 mt-0.5">
                              💡 {issue.suggestion}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                    <span>✅</span>
                    <span className="text-xs text-emerald-300">
                      No cultural issues detected in image for{" "}
                      {current.localeName}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Score + Analysis sidebar */}
          <div className="space-y-4">
            {current.culturalScore && (
              <CulturalScoreCard
                overall={current.culturalScore.overall}
                breakdown={current.culturalScore.breakdown}
                conflictPenalty={current.culturalScore.conflictPenalty}
              />
            )}

            {current.culturalAnalysis && (
              <AnalysisDashboard analysis={current.culturalAnalysis} />
            )}

            {current.colorAnalysis && (
              <ColorAnalyzerPanel
                analysis={current.colorAnalysis}
                locale={current.locale}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== Comparison Row Component ===== */


function highlightIdiomSlang(changes: any[], text: string) {
  if (!changes || changes.length === 0) return text;
  let highlighted = text;
  changes.forEach((change) => {
    if ((change.type === "idiom" || change.type === "slang") && change.adapted) {
      const regex = new RegExp(change.adapted.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "gi");
      highlighted = highlighted.replace(
        regex,
        `<span class='bg-amber-500/30 text-amber-900 px-1 rounded' title='Localized ${change.type}: ${change.original} → ${change.adapted}. Reason: ${change.reason}'>$&</span>`
      );
    }
  });
  return highlighted;
}

function ComparisonRow({
  label,
  original,
  translated,
  adapted,
  copiedField,
  onCopy,
  copyFieldName,
  multiline = false,
  changes = [],
}: {
  label: string;
  original: string;
  translated: string;
  adapted: string;
  copiedField: string | null;
  onCopy: (text: string) => void;
  copyFieldName: string;
  multiline?: boolean;
  changes?: any[];
}) {
  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-medium text-white mb-3">{label}</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Original */}
        <div className="rounded-lg bg-white/5 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-2 h-2 rounded-full bg-gray-500" />
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">
              Original (EN-US)
            </span>
          </div>
          <p
            className={`text-sm text-gray-300 ${
              multiline ? "whitespace-pre-wrap" : ""
            }`}
          >
            {original}
          </p>
        </div>

        {/* Translated */}
        <div className="rounded-lg bg-blue-500/5 border border-blue-500/10 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Languages className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] uppercase tracking-wider text-blue-400 font-medium">
              Translated (lingo.dev)
            </span>
          </div>
          <p
            className={`text-sm text-blue-200 ${
              multiline ? "whitespace-pre-wrap" : ""
            }`}
          >
            {translated}
          </p>
        </div>

        {/* Culturally Adapted */}
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3 relative">
          <div className="flex items-center gap-1.5 mb-2">
            <Brain className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-medium">
              Culturally Adapted
            </span>
            <button
              onClick={() => onCopy(adapted)}
              className="ml-auto p-1 rounded hover:bg-white/10 transition-colors"
              title="Copy adapted text"
            >
              {copiedField === copyFieldName ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-gray-500 hover:text-white" />
              )}
            </button>
          </div>
          <p
            className={`text-sm text-emerald-200 font-medium ${
              multiline ? "whitespace-pre-wrap" : ""
            }`}
            dangerouslySetInnerHTML={{
              __html: highlightIdiomSlang(changes, adapted),
            }}
          />
        </div>
      </div>
    </div>
  );
}
