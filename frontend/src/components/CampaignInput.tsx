import { useState } from "react";
import {
  Send,
  Type,
  MousePointerClick,
  FileText,
  Briefcase,
  Target,
  Palette,
  Sparkles,
  Image,
} from "lucide-react";
import type { CampaignInput } from "../services/types";
import { sampleCampaigns } from "../data/sampleCampaigns";

const AVAILABLE_LOCALES = [
  { code: "zh-CN", name: "Chinese (China)", flag: "🇨🇳" },
  { code: "ja-JP", name: "Japanese", flag: "🇯🇵" },
  { code: "ko-KR", name: "Korean", flag: "🇰🇷" },
  { code: "de-DE", name: "German", flag: "🇩🇪" },
  { code: "fr-FR", name: "French", flag: "🇫🇷" },
  { code: "es-MX", name: "Spanish (Mexico)", flag: "🇲🇽" },
  { code: "ar-SA", name: "Arabic (Saudi Arabia)", flag: "🇸🇦" },
  { code: "hi-IN", name: "Hindi (India)", flag: "🇮🇳" },
];

const TONES = [
  { value: "casual", label: "Casual" },
  { value: "professional", label: "Professional" },
  { value: "luxury", label: "Luxury" },
  { value: "playful", label: "Playful" },
];

const GOALS = [
  { value: "sales", label: "Drive Sales" },
  { value: "awareness", label: "Brand Awareness" },
  { value: "signups", label: "Get Sign-ups" },
  { value: "engagement", label: "Engagement" },
];

interface Props {
  onSubmit: (campaign: CampaignInput, targetLocales: string[], imageFile: File | null) => Promise<void>;
  loading?: boolean;
}
export function CampaignInputForm({ onSubmit, loading }: Props) {
  const [campaign, setCampaign] = useState<CampaignInput>({
    headline: "",
    cta: "",
    body: "",
    sourceLocale: "en-US",
    industry: "",
    brandTone: "casual",
    goal: "sales",
    colors: [],
  });
  const [targetLocales, setTargetLocales] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [colorInput, setColorInput] = useState("");

  const loadSample = (index: number) => {
    const sample = sampleCampaigns[index];
    setCampaign({
      headline: sample.headline,
      cta: sample.cta,
      body: sample.body,
      sourceLocale: sample.sourceLocale,
      industry: sample.industry,
      brandTone: sample.brandTone,
      goal: sample.goal,
      colors: sample.colors,
    });
    setColorInput(sample.colors.join(", "));
  };

  const toggleLocale = (code: string) => {
    setTargetLocales((prev) =>
      prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleColorInputChange = (value: string) => {
    setColorInput(value);
    const colors = value
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    setCampaign((prev) => ({ ...prev, colors }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetLocales.length === 0) return;
    onSubmit(campaign, targetLocales, imageFile);
  };

  // Note: Locale-specific tone is applied globally via campaign.brandTone
  // For future: per-locale tone selection can be expanded here

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Demo Mode Banner */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium text-white">
            Quick Demo — Try a sample campaign
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {sampleCampaigns.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => loadSample(i)}
              className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/30 text-xs text-left transition-all"
            >
              <span className="block font-medium text-white">
                {sample.name}
              </span>
              <span className="block text-gray-500 mt-0.5 line-clamp-1">
                {sample.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Campaign Content */}
      <div className="glass-card rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Type className="w-5 h-5 text-indigo-400" />
          Campaign Content
        </h2>

        {/* Headline */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Headline
          </label>
          <input
            type="text"
            value={campaign.headline}
            onChange={(e) =>
              setCampaign({ ...campaign, headline: e.target.value })
            }
            placeholder="Black Friday Blowout - Don't Miss Out!"
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
            required
          />
        </div>

        {/* CTA */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
            <MousePointerClick className="w-3.5 h-3.5" />
            Call-to-Action
          </label>
          <input
            type="text"
            value={campaign.cta}
            onChange={(e) =>
              setCampaign({ ...campaign, cta: e.target.value })
            }
            placeholder="Buy Now!"
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
            required
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            Body Copy
          </label>
          <textarea
            value={campaign.body}
            onChange={(e) =>
              setCampaign({ ...campaign, body: e.target.value })
            }
            placeholder="Get 50% off everything before it's too late! Limited stock available..."
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 resize-none"
            required
          />
        </div>
      </div>

      {/* Campaign Context */}
      <div className="glass-card rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-emerald-400" />
          Campaign Context
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Industry
            </label>
            <input
              type="text"
              value={campaign.industry}
              onChange={(e) =>
                setCampaign({ ...campaign, industry: e.target.value })
              }
              placeholder="E-commerce / Retail"
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Brand Tone
            </label>
            <select
              value={campaign.brandTone}
              onChange={(e) =>
                setCampaign({ ...campaign, brandTone: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 [&>option]:bg-gray-900"
            >
              {TONES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Campaign Goal
            </label>
            <select
              value={campaign.goal}
              onChange={(e) =>
                setCampaign({ ...campaign, goal: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 [&>option]:bg-gray-900"
            >
              {GOALS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Colors */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5" />
            Campaign Colors
            <span className="text-gray-600 font-normal">(comma-separated)</span>
          </label>
          <input
            type="text"
            value={colorInput}
            onChange={(e) => handleColorInputChange(e.target.value)}
            placeholder="red, black, white"
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
            <Image className="w-3.5 h-3.5" />
            Campaign Image
            <span className="text-gray-600 font-normal">(optional)</span>
          </label>
          <div className="flex items-center gap-4">
            <label className="flex-1 cursor-pointer">
              <div className="px-4 py-3 rounded-lg bg-white/5 border border-dashed border-white/20 hover:border-indigo-500/40 text-center transition-all">
                <span className="text-sm text-gray-400">
                  {imageFile ? imageFile.name : "Click to upload image"}
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-16 h-16 rounded-lg object-cover border border-white/10"
              />
            )}
          </div>
        </div>
      </div>

      {/* Target Markets */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-pink-400" />
          Target Markets
          {targetLocales.length > 0 && (
            <span className="text-sm font-normal text-gray-400">
              ({targetLocales.length} selected)
            </span>
          )}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {AVAILABLE_LOCALES.map((locale) => {
            const isSelected = targetLocales.includes(locale.code);
            return (
              <button
                key={locale.code}
                type="button"
                onClick={() => toggleLocale(locale.code)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm text-left transition-all ${
                  isSelected
                    ? "bg-indigo-500/15 border-indigo-500/40 text-white"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <span className="text-lg">{locale.flag}</span>
                <span className="truncate">{locale.name}</span>
              </button>
            );
          })}
        </div>

        {targetLocales.length === 0 && (
          <p className="text-xs text-amber-400/80">
            ⚠ Select at least one target market
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || targetLocales.length === 0}
        className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/40"
      >
        <Send className="w-5 h-5" />
        Adapt Campaign
      </button>
    </form>
  );
}
