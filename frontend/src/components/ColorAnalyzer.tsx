import { Palette, CheckCircle, AlertTriangle } from "lucide-react";
import type { ColorAnalysis } from "../services/types";

interface Props {
  analysis: ColorAnalysis;
  locale: string;
}

export function ColorAnalyzerPanel({ analysis, locale }: Props) {
  return (
    <div className="glass-card rounded-xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Palette className="w-4 h-4 text-pink-400" />
        <h4 className="text-sm font-medium text-white">Color Analysis</h4>
        <span
          className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
            analysis.overallStatus === "excellent"
              ? "bg-emerald-500/10 text-emerald-400"
              : analysis.overallStatus === "needs_review"
              ? "bg-amber-500/10 text-amber-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {analysis.overallScore}/100
        </span>
      </div>

      <p className="text-xs text-gray-400">{analysis.summary}</p>

      <div className="space-y-2">
        {analysis.colors.map((color, i) => {
          const meaning = color.targetContext?.meaning || "(no data)";
          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                color.appropriate ? "bg-white/5" : "bg-red-500/5 border border-red-500/10"
              }`}
            >
              {/* Color swatch */}
              <div
                className="w-6 h-6 rounded-md border border-white/20 shrink-0"
                style={{ backgroundColor: color.color }}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-white">
                    {color.colorName}
                  </span>
                  {color.appropriate ? (
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                  )}
                </div>
                <p className="text-[11px] text-gray-500 truncate">
                  {meaning}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggestions */}
      {analysis.colors.some((c) => c.suggestions.length > 0) && (
        <div className="pt-2 border-t border-white/5">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">
            Suggested Alternatives
          </p>
          <div className="flex flex-wrap gap-1.5">
            {analysis.colors
              .flatMap((c) => c.suggestions)
              .slice(0, 4)
              .map((sug, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 text-[11px]"
                >
                  <div
                    className="w-3 h-3 rounded-sm border border-white/20"
                    style={{ backgroundColor: sug.color }}
                  />
                  <span className="text-gray-400">{sug.meaning || "(no data)"}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
