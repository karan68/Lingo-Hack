import { Lightbulb, ArrowRight, TrendingUp } from "lucide-react";
import type { ExplanationResult, CulturalChange } from "../services/types";

interface Props {
  explanation: ExplanationResult | null;
  changes: {
    headline: CulturalChange[];
    cta: CulturalChange[];
    body: CulturalChange[];
  };
  locale: string;
}

export function ExplanationPanel({ explanation, changes, locale }: Props) {
  const allChanges = [
    ...changes.headline.map((c) => ({ ...c, section: "Headline" })),
    ...changes.cta.map((c) => ({ ...c, section: "CTA" })),
    ...changes.body.map((c) => ({ ...c, section: "Body" })),
  ];

  return (
    <div className="space-y-4">
      {/* Main Explanation */}
      {explanation && (
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-2">
                Why These Changes?
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                {explanation.explanation}
              </p>
            </div>
          </div>

          {/* Marketing Impact */}
          {explanation.marketingImpact && (
            <div className="mt-4 flex items-start gap-2 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-300">
                {explanation.marketingImpact}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Detailed Changes */}
      {allChanges.length > 0 && (
        <div className="glass-card rounded-xl p-5">
          <h4 className="text-sm font-medium text-white mb-3">
            Change Details
          </h4>
          <div className="space-y-3">
            {allChanges.slice(0, 6).map((change, i) => (
              <div
                key={i}
                className="flex flex-col gap-1 px-3 py-2.5 rounded-lg bg-white/5"
              >
                <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-medium">
                  {change.section}
                </span>
                {(change.original || change.what || change.change) && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-red-300 line-through">
                      {change.original || change.what || change.change}
                    </span>
                    <ArrowRight className="w-3 h-3 text-gray-500 shrink-0" />
                    <span className="text-emerald-300">
                      {change.adapted || ""}
                    </span>
                  </div>
                )}
                <p className="text-[11px] text-gray-500 italic">
                  {change.reason || change.why || change.culturalReason || ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
