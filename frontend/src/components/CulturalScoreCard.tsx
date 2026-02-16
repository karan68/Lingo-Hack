interface ScoreCardProps {
  overall: number;
  breakdown: { name: string; score: number }[];
  conflictPenalty: number;
}

export function CulturalScoreCard({ overall, breakdown, conflictPenalty }: ScoreCardProps) {
  const circumference = 2 * Math.PI * 45;
  const dashoffset = circumference - (overall / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return { stroke: "#22c55e", text: "text-emerald-400", label: "Excellent" };
    if (score >= 60) return { stroke: "#f59e0b", text: "text-amber-400", label: "Good" };
    if (score >= 40) return { stroke: "#f97316", text: "text-orange-400", label: "Needs Work" };
    return { stroke: "#ef4444", text: "text-red-400", label: "Poor" };
  };

  const scoreInfo = getScoreColor(overall);

  return (
    <div className="glass-card rounded-xl p-6 text-center">
      <h3 className="text-sm font-medium text-gray-400 mb-4">
        Cultural Confidence Score
      </h3>

      {/* Score Ring */}
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
          {/* Background ring */}
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          {/* Score ring */}
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke={scoreInfo.stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            className="score-ring"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${scoreInfo.text}`}>
            {overall}
          </span>
          <span className="text-xs text-gray-500">/100</span>
        </div>
      </div>

      <span className={`text-sm font-medium ${scoreInfo.text}`}>
        {scoreInfo.label}
      </span>

      {/* Breakdown */}
      {breakdown.length > 0 && (
        <div className="mt-4 space-y-2">
          {breakdown.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-gray-400">{item.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${item.score}%`,
                      backgroundColor: getScoreColor(item.score).stroke,
                    }}
                  />
                </div>
                <span className={getScoreColor(item.score).text}>
                  {item.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {conflictPenalty > 0 && (
        <div className="mt-3 text-xs text-red-400/80 flex items-center justify-center gap-1">
          <span>-{conflictPenalty} conflict penalty</span>
        </div>
      )}
    </div>
  );
}
