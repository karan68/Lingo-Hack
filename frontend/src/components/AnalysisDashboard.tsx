import {
  AlertTriangle,
  CheckCircle,
  Info,
  MessageSquare,
  Calendar,
  Hash,
  Volume2,
} from "lucide-react";
import type { CulturalAnalysis } from "../services/types";

interface Props {
  analysis: CulturalAnalysis;
}

export function AnalysisDashboard({ analysis }: Props) {
  const hasIssues =
    analysis.idioms.length > 0 ||
    analysis.holidays.length > 0 ||
    analysis.culturalConflicts.length > 0 ||
    analysis.numbers.length > 0;

  return (
    <div className="glass-card rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">
          Cultural Analysis
        </h3>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            analysis.culturalConflicts.some((c) => c.severity === "high")
              ? "bg-red-500/10 text-red-400 border border-red-500/20"
              : hasIssues
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          }`}
        >
          {analysis.culturalConflicts.some((c) => c.severity === "high")
            ? "High Risk"
            : hasIssues
            ? "Needs Attention"
            : "Low Risk"}
        </span>
      </div>

      {/* Urgency Meter */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-400 flex items-center gap-1">
            <Volume2 className="w-3 h-3" /> Urgency Level
          </span>
          <span
            className={
              analysis.urgencyLevel > 60
                ? "text-red-400"
                : analysis.urgencyLevel > 30
                ? "text-amber-400"
                : "text-emerald-400"
            }
          >
            {analysis.urgencyLevel}/100
          </span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${analysis.urgencyLevel}%`,
              background:
                analysis.urgencyLevel > 60
                  ? "linear-gradient(90deg, #f59e0b, #ef4444)"
                  : analysis.urgencyLevel > 30
                  ? "linear-gradient(90deg, #22c55e, #f59e0b)"
                  : "#22c55e",
            }}
          />
        </div>
      </div>

      {/* Detected Elements */}
      <div className="space-y-2">
        {analysis.idioms.map((idiom, i) => (
          <div
            key={`idiom-${i}`}
            className="flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/10"
          >
            <MessageSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="text-amber-300 font-medium">
                "{idiom.idiom}"
              </span>
              <span className="text-gray-400"> — {idiom.risk}</span>
            </div>
          </div>
        ))}

        {analysis.holidays.map((holiday, i) => (
          <div
            key={`holiday-${i}`}
            className="flex items-start gap-2 px-3 py-2 rounded-lg bg-blue-500/5 border border-blue-500/10"
          >
            <Calendar className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="text-blue-300 font-medium">
                {holiday.holiday}
              </span>
              <span className="text-gray-400">
                {" "}
                — {holiday.region} specific
              </span>
            </div>
          </div>
        ))}

        {analysis.numbers.map((num, i) => (
          <div
            key={`num-${i}`}
            className="flex items-start gap-2 px-3 py-2 rounded-lg bg-purple-500/5 border border-purple-500/10"
          >
            <Hash className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div className="text-xs text-gray-400">{num.issue}</div>
          </div>
        ))}

        {analysis.toneIndicators.map((tone, i) => (
          <div
            key={`tone-${i}`}
            className="flex items-start gap-2 px-3 py-2 rounded-lg bg-white/5"
          >
            <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="text-gray-300">{tone.indicator}</span>
              <span className="text-gray-500"> — {tone.note}</span>
            </div>
          </div>
        ))}

        {/* Cultural Conflicts */}
        {analysis.culturalConflicts.map((conflict, i) => (
          <div
            key={`conflict-${i}`}
            className={`flex items-start gap-2 px-3 py-2 rounded-lg border ${
              conflict.severity === "high"
                ? "bg-red-500/5 border-red-500/20"
                : "bg-amber-500/5 border-amber-500/10"
            }`}
          >
            {conflict.severity === "high" ? (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs">
              <span
                className={
                  conflict.severity === "high"
                    ? "text-red-300"
                    : "text-amber-300"
                }
              >
                [{conflict.locale}]
              </span>{" "}
              <span className="text-gray-400">{conflict.message}</span>
            </div>
          </div>
        ))}
      </div>

      {!hasIssues && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-emerald-300">
            No major cultural issues detected in source text.
          </span>
        </div>
      )}
    </div>
  );
}
