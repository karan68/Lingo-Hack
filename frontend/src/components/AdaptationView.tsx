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

function ComparisonRow({
  label,
  original,
  translated,
  adapted,
  copiedField,
  onCopy,
  copyFieldName,
  multiline = false,
}: {
  label: string;
  original: string;
  translated: string;
  adapted: string;
  copiedField: string | null;
  onCopy: (text: string) => void;
  copyFieldName: string;
  multiline?: boolean;
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
          >
            {adapted}
          </p>
        </div>
      </div>
    </div>
  );
}
