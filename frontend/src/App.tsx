import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { CampaignInputForm } from "./components/CampaignInput";
import { ImageTextExtractor } from "./components/ImageTextExtractor";
import { LoadingState } from "./components/LoadingState";
import { AdaptationView } from "./components/AdaptationView";
import {
  type CampaignInput,
  type AdaptationResult,
  type ImageAnalysisResult,
  type AppStep,
} from "./services/types";
import { adaptCampaign, analyzeImage, healthCheck } from "./services/api";

export default function App() {
  const [step, setStep] = useState<AppStep>("input");
  const [adaptations, setAdaptations] = useState<AdaptationResult[]>([]);
  const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysisResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [servicesOnline, setServicesOnline] = useState<boolean | null>(null);

  useEffect(() => {
    healthCheck()
      .then((data) => setServicesOnline(data.status === "ok"))
      .catch(() => setServicesOnline(false));
  }, []);

  const handleSubmit = async (
    campaign: CampaignInput,
    targetLocales: string[],
    imageFile: File | null
  ) => {
    setStep("loading");
    setError(null);
    setAdaptations([]);
    setImageAnalysis(null);

    try {
      const promises: Promise<void>[] = [];

      // Main adaptation
      promises.push(
        adaptCampaign(campaign, targetLocales).then((res) => {
          setAdaptations(res.adaptations);
        })
      );

      // Optional image analysis
      if (imageFile) {
        promises.push(
          analyzeImage(imageFile, targetLocales).then((res) => {
            setImageAnalysis(res.imageAnalysis);
          })
        );
      }

      await Promise.all(promises);
      setStep("results");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      setStep("input");
    }
  };

  const handleReset = () => {
    setStep("input");
    setAdaptations([]);
    setImageAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <Header />

      {/* Service Status */}
      {servicesOnline === false && (
        <div className="max-w-5xl mx-auto px-6 mt-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Backend services are offline. Start the server with{" "}
            <code className="bg-red-500/20 px-2 py-0.5 rounded text-xs">npm run dev:backend</code>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="max-w-5xl mx-auto px-6 mt-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {step === "input" && (
          <>
            <CampaignInputForm onSubmit={handleSubmit} loading={false} />
            {/* Experimental: Image Text Extractor for banners */}
            <ImageTextExtractor />
          </>
        )}

        {step === "loading" && <LoadingState />}

        {step === "results" && (
          <AdaptationView
            adaptations={adaptations}
            imageAnalysis={imageAnalysis}
            onBack={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600 text-xs">
        Built with lingo.dev + Claude + HuggingFace &middot; Cultural Context Adapter
      </footer>
    </div>
  );
}
