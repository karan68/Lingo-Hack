import { Loader2, Globe, Languages, Brain, Palette } from "lucide-react";
import { useEffect, useState } from "react";

const steps = [
  { icon: Globe, label: "Analyzing cultural elements...", color: "text-blue-400" },
  { icon: Languages, label: "Translating with lingo.dev...", color: "text-emerald-400" },
  { icon: Brain, label: "Applying cultural intelligence...", color: "text-purple-400" },
  { icon: Palette, label: "Checking visual elements...", color: "text-pink-400" },
];

export function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-8">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center pulse-glow">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">
          Adapting Your Campaign
        </h2>
        <p className="text-gray-400 text-sm max-w-md">
          Analyzing cultural context, translating, and adapting for your target
          markets...
        </p>
      </div>

      <div className="space-y-3 w-full max-w-sm">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === currentStep;
          const isDone = i < currentStep;

          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-500 ${
                isActive
                  ? "bg-white/10 border border-white/20 scale-105"
                  : isDone
                  ? "bg-white/5 opacity-60"
                  : "opacity-30"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? step.color : "text-gray-500"} ${
                  isActive ? "animate-pulse" : ""
                }`}
              />
              <span
                className={`text-sm ${
                  isActive ? "text-white font-medium" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
              {isDone && (
                <span className="ml-auto text-emerald-400 text-xs">✓</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
