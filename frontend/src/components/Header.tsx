import { Globe, Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Cultural Context Adapter
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h1>
            <p className="text-xs text-gray-400">
              AI-Powered Marketing Localization — Beyond Translation
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Powered by lingo.dev
          </span>
        </div>
      </div>
    </header>
  );
}
