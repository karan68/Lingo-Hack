import React, { useState, useRef } from "react";
import { Upload, Loader, X, Eye, Download } from "lucide-react";

// Professional Image Text & Color Extractor (Isolated Component)
// Uses FREE, open-source: Tesseract.js (OCR) + Canvas API (colors)
// Can be safely deleted if no longer needed

interface ExtractionResult {
  headlines: string[];
  body_text: string[];
  keywords: string[];
  colors: string[];
  color_descriptions: string;
  brand_elements: string[];
}

// Helper: Extract dominant colors from image using Canvas API (FREE!)
async function extractColorsFromImage(file: File): Promise<string[]> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(["#FF6B35", "#F7931E", "#FFFFFF"]);
          return;
        }

        // Resize image for faster processing
        canvas.width = 50;
        canvas.height = 50;
        ctx.drawImage(img, 0, 0, 50, 50);

        const imageData = ctx.getImageData(0, 0, 50, 50);
        const data = imageData.data;

        // Sample every 4th pixel to get dominant colors
        const colorCounts: { [key: string]: number } = {};
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const hex = `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0").toUpperCase()}`;
          colorCounts[hex] = (colorCounts[hex] || 0) + 1;
        }

        const topColors = Object.entries(colorCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([color]) => color);

        resolve(topColors.length > 0 ? topColors : ["#FF6B35", "#F7931E", "#FFFFFF"]);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// Bounding box for detected text
interface TextBBox {
  text: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  confidence: number;
}

interface OcrResult {
  text: string;
  lines: TextBBox[];
}

// Helper: Extract text using Tesseract.js (FREE OCR!) — returns text + bounding boxes
async function extractTextUsingTesseract(imageFile: File): Promise<OcrResult> {
  try {
    const Tesseract = await import("tesseract.js");
    
    console.log("📄 Starting OCR with Tesseract.js...");
    
    const result = await Tesseract.recognize(imageFile, "eng", {
      logger: (m: any) => {
        if (m.status === "recognizing text") {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    const lines: TextBBox[] = ((result.data as any).lines || []).map((line: any) => ({
      text: line.text.trim(),
      x0: line.bbox.x0,
      y0: line.bbox.y0,
      x1: line.bbox.x1,
      y1: line.bbox.y1,
      confidence: line.confidence,
    })).filter((l: TextBBox) => l.text.length > 0);

    console.log("📐 OCR bounding boxes:", lines);

    return { text: result.data.text || "", lines };
  } catch (error) {
    console.error("Tesseract.js error:", error);
    throw new Error("Failed to extract text. Try a clearer image.");
  }
}

// Helper: Clean text by removing excess symbols
function cleanHeadlineText(text: string): string {
  if (!text) return text;
  // Remove control characters and weird symbols, but keep ALL language scripts (Unicode letters/numbers)
  let cleaned = text
    .replace(/[^\p{L}\p{N}\s.,!?'"()\-।]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  return cleaned.substring(0, 80);
}

// Helper: Parse extracted text into structured data
function parseExtractedText(text: string): Omit<ExtractionResult, "colors" | "color_descriptions"> {
  console.log("🔍 Raw extracted text:", text);
  
  const lines = text
    .split(/[\n.!?]+/)
    .map((l) => l.trim())
    .filter((l) => {
      if (l.length < 2) return false; // Allow even single word + space
      const alphaRatio = (l.match(/[a-z]/i) || []).length / l.length;
      const hasLetters = /[a-z]/i.test(l);
      return hasLetters; // Just keep anything with at least one letter
    });

  console.log("📝 Filtered lines:", lines);

  const headlines: string[] = [];
  const bodyText: string[] = [];
  const keywords: string[] = [];

  lines.forEach((line) => {
    // Headlines: short lines (less than 60 chars)
    if (line.length < 60) {
      headlines.push(line);
    }
    // Body text: longer lines
    if (line.length >= 20 && line.length < 150) {
      bodyText.push(line);
    }
    // Keywords: short phrases
    if (line.length < 25 && line.length > 2) {
      keywords.push(line);
    }
  });

  console.log("✅ Headlines:", headlines);
  console.log("✅ Body text:", bodyText);
  console.log("✅ Keywords:", keywords);

  return {
    headlines: [...new Set(headlines)].slice(0, 5),
    body_text: [...new Set(bodyText)].slice(0, 5),
    keywords: [...new Set(keywords)].slice(0, 10),
    brand_elements: ["Logo", "Brand messaging"],
  };
}

export function ImageTextExtractor() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Adaptation states
  const [adaptations, setAdaptations] = useState<any[]>([]);
  const [adaptLoading, setAdaptLoading] = useState(false);
  const [adaptError, setAdaptError] = useState<string | null>(null);
  const [targetLocalesForAdapt, setTargetLocalesForAdapt] = useState<string[]>([]);
  
  // Banner generation states
  const [generatingBanner, setGeneratingBanner] = useState<string | null>(null);
  const [generatedBanners, setGeneratedBanners] = useState<{ [key: string]: string }>({});
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [ocrLines, setOcrLines] = useState<TextBBox[]>([]);

  const AVAILABLE_LOCALES = [
    { code: "fr-FR", name: "French", flag: "🇫🇷" },
    { code: "es-MX", name: "Spanish", flag: "🇲🇽" },
    { code: "de-DE", name: "German", flag: "🇩🇪" },
    { code: "zh-CN", name: "Chinese", flag: "🇨🇳" },
    { code: "ja-JP", name: "Japanese", flag: "🇯🇵" },
    { code: "hi-IN", name: "Hindi", flag: "🇮🇳" },
    { code: "ar-SA", name: "Arabic", flag: "🇸🇦" },
    { code: "ko-KR", name: "Korean", flag: "🇰🇷" },
  ];

  const adaptExtraction = async () => {
    if (!result || result.headlines.length === 0 || targetLocalesForAdapt.length === 0) {
      setAdaptError("Please select at least one target market");
      return;
    }

    setAdaptLoading(true);
    setAdaptError(null);
    setAdaptations([]);

    try {
      // Create a campaign from extracted text
      const campaign = {
        headline: result.headlines[0] || "Product",
        cta: "Learn More",
        body: result.body_text[0] || result.headlines.join(". "),
        sourceLocale: "en-US",
        industry: "Food & Beverage",
        brandTone: "casual",
        goal: "sales",
        colors: result.colors,
      };

      console.log("🌍 Adapting for:", targetLocalesForAdapt);

      const response = await fetch("http://localhost:3001/api/campaign/adapt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaign,
          targetLocales: targetLocalesForAdapt,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to adapt content");
      }

      const data = await response.json();
      setAdaptations(data.adaptations || []);
      console.log("✅ Adaptations received");
    } catch (err: any) {
      setAdaptError(err.message || "Failed to adapt extracted text");
    }

    setAdaptLoading(false);
  };

  const toggleLocaleForAdapt = (locale: string) => {
    setTargetLocalesForAdapt((prev) =>
      prev.includes(locale) ? prev.filter((l) => l !== locale) : [...prev, locale]
    );
  };

  // Generate banner entirely on the frontend using Canvas API
  // This gives proper Unicode rendering and doesn't need a server
  const generateBanner = async (adapt: any) => {
    if (!imageBase64) {
      alert("Image data not ready. Please re-upload the image.");
      return;
    }

    const bannerKey = adapt.locale;
    setGeneratingBanner(bannerKey);

    try {
      const headline = adapt.adapted?.headline || adapt.translated?.headline || '';
      const cta = adapt.adapted?.cta || adapt.translated?.cta || '';

      if (!headline) {
        alert("No translated headline available.");
        setGeneratingBanner(null);
        return;
      }

      console.log("🎨 Generating banner with Canvas API:", { headline, cta, ocrLines: ocrLines.length });

      // Load the original image into an HTMLImageElement
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = reject;
        i.src = imageBase64;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;

      // Draw the original image
      ctx.drawImage(img, 0, 0);

      // For each OCR-detected line, paint over it with the sampled background color
      if (ocrLines.length > 0) {
        for (const line of ocrLines) {
          // Sample background color: pick pixels just outside the text bounding box
          const pad = 4;
          const sampleX = Math.max(0, line.x0 - pad);
          const sampleY = Math.max(0, line.y0 - pad);
          const pixel = ctx.getImageData(sampleX, sampleY, 1, 1).data;
          const bgColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

          // Expand the paint area slightly to cover anti-aliased edges
          const expand = 6;
          ctx.fillStyle = bgColor;
          ctx.fillRect(
            line.x0 - expand,
            line.y0 - expand,
            (line.x1 - line.x0) + expand * 2,
            (line.y1 - line.y0) + expand * 2
          );
        }

        console.log("✅ Painted over", ocrLines.length, "text regions");

        // Now render the new translated headline in the same area as the original text
        // Compute the bounding area of ALL original text lines
        const allX0 = Math.min(...ocrLines.map(l => l.x0));
        const allY0 = Math.min(...ocrLines.map(l => l.y0));
        const allX1 = Math.max(...ocrLines.map(l => l.x1));
        const allY1 = Math.max(...ocrLines.map(l => l.y1));
        const textAreaW = allX1 - allX0;
        const textAreaH = allY1 - allY0;
        const centerX = allX0 + textAreaW / 2;
        const centerY = allY0 + textAreaH / 2;

        // Choose font size to fit within the original text area width
        let fontSize = Math.min(textAreaH * 0.8, 72);
        ctx.font = `bold ${fontSize}px "Noto Sans", "Segoe UI", Arial, sans-serif`;
        let measured = ctx.measureText(headline);
        // Shrink font if text is wider than original area
        while (measured.width > textAreaW * 1.1 && fontSize > 12) {
          fontSize -= 2;
          ctx.font = `bold ${fontSize}px "Noto Sans", "Segoe UI", Arial, sans-serif`;
          measured = ctx.measureText(headline);
        }

        // Render headline — white with dark shadow for readability
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        ctx.shadowColor = "rgba(0,0,0,0.7)";
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText(headline, centerX, centerY);

        // Reset shadow
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      } else {
        // No bounding boxes — fallback: render text centered at bottom third of image
        const centerX = canvas.width / 2;
        const centerY = canvas.height * 0.35;
        let fontSize = Math.min(canvas.width / headline.length * 1.5, 72);
        ctx.font = `bold ${fontSize}px "Noto Sans", "Segoe UI", Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        ctx.shadowColor = "rgba(0,0,0,0.7)";
        ctx.shadowBlur = 6;
        ctx.fillText(headline, centerX, centerY);
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
      }

      // Render CTA button if present
      if (cta) {
        const btnW = Math.min(canvas.width * 0.35, 250);
        const btnH = 50;
        const btnX = (canvas.width - btnW) / 2;
        const btnY = canvas.height * 0.82;

        // Draw rounded rectangle button
        const radius = 10;
        ctx.fillStyle = "#FF6B35";
        ctx.beginPath();
        ctx.moveTo(btnX + radius, btnY);
        ctx.lineTo(btnX + btnW - radius, btnY);
        ctx.quadraticCurveTo(btnX + btnW, btnY, btnX + btnW, btnY + radius);
        ctx.lineTo(btnX + btnW, btnY + btnH - radius);
        ctx.quadraticCurveTo(btnX + btnW, btnY + btnH, btnX + btnW - radius, btnY + btnH);
        ctx.lineTo(btnX + radius, btnY + btnH);
        ctx.quadraticCurveTo(btnX, btnY + btnH, btnX, btnY + btnH - radius);
        ctx.lineTo(btnX, btnY + radius);
        ctx.quadraticCurveTo(btnX, btnY, btnX + radius, btnY);
        ctx.closePath();
        ctx.fill();

        // CTA text
        ctx.font = `bold 20px "Noto Sans", "Segoe UI", Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        ctx.fillText(cta, btnX + btnW / 2, btnY + btnH / 2);
      }

      // Export canvas to data URL
      const dataUrl = canvas.toDataURL("image/png");

      setGeneratedBanners((prev) => ({
        ...prev,
        [bannerKey]: dataUrl,
      }));

      // Auto-download
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `banner_${adapt.locale}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("✅ Banner generated successfully (Canvas API)");
    } catch (err: any) {
      console.error("❌ Banner generation error:", err);
      alert(`Failed to generate banner: ${err.message}`);
    }

    setGeneratingBanner(null);
  };

  const extractFromImage = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      // Extract colors locally (instant, FREE!)
      console.log("🎨 Extracting colors from image...");
      const colors = await extractColorsFromImage(file);
      console.log("✅ Colors extracted:", colors);

      // Extract text using Tesseract.js (may take a few seconds)
      console.log("📄 Extracting text from image...");
      const ocrResult = await extractTextUsingTesseract(file);
      const extractedText = ocrResult.text;
      console.log("✅ Raw text from Tesseract:", extractedText);
      console.log("📊 Text length:", extractedText.length);
      console.log("📐 OCR lines with bounding boxes:", ocrResult.lines.length);

      // Store bounding boxes for banner generation
      setOcrLines(ocrResult.lines);

      // Parse the text
      const parsed = parseExtractedText(extractedText);

      const extraction: ExtractionResult = {
        ...parsed,
        colors: colors,
        color_descriptions: `Image uses a palette of ${colors.length} dominant colors. Warm/orange tones suggest energy, appetite appeal, and urgency typical in food advertising.`,
      };

      console.log("🎯 Final extraction result:", extraction);
      setResult(extraction);
    } catch (err: any) {
      console.error("❌ Extraction error:", err);
      setError(err.message || "Failed to process image. Try a clearer image with better text contrast.");
    }

    setLoading(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setResult(null);

    // Also store actual base64 for banner generation
    const reader = new FileReader();
    reader.onload = () => {
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);

    extractFromImage(file);
  };

  const reset = () => {
    setImage(null);
    setImagePreview(null);
    setImageBase64(null);
    setOcrLines([]);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 mb-8">
      <div className="glass-card rounded-2xl p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
            <Eye className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Banner Analyzer (FREE)</h2>
            <p className="text-sm text-gray-400">
              Upload ads/banners to extract headlines, colors & text. 100% free • No API keys • Tesseract.js OCR
            </p>
          </div>
        </div>

        {/* Upload Area */}
        {!image ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              dragActive
                ? "border-cyan-500 bg-cyan-500/10"
                : "border-gray-500 bg-gray-900/30 hover:border-gray-400"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-3" onClick={() => fileInputRef.current?.click()}>
              <div className="p-4 bg-indigo-500/20 rounded-full">
                <Upload className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <p className="text-white font-semibold">Drag banner image here or click</p>
                <p className="text-sm text-gray-400 mt-1">PNG, JPG, WebP • Best results: Clear text on solid background</p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Image Preview & Results */}
        {imagePreview && (
          <div className="space-y-6">
            {/* Image & Loading */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <img src={imagePreview} alt="Preview" className="w-48 h-48 object-cover rounded-xl border border-gray-700" />
                <button
                  onClick={reset}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 rounded-lg text-sm transition-all"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              </div>

              {/* Results */}
              <div className="flex-1 space-y-4">
                {loading ? (
                  <div className="flex items-center gap-3 py-8">
                    <Loader className="w-5 h-5 text-indigo-400 animate-spin" />
                    <div className="text-sm">
                      <p className="text-gray-300 font-medium">Processing image...</p>
                      <p className="text-gray-500 text-xs">This may take 10-30 seconds depending on image size</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-300 text-xs space-y-2">
                    <p><strong>⚠️ Error:</strong> {error}</p>
                    <p>Tips for better results:</p>
                    <ul className="list-disc list-inside space-y-1 text-red-200">
                      <li>Use high-contrast images (dark text on light background)</li>
                      <li>Ensure text is at least 20px tall</li>
                      <li>Avoid rotated or skewed text</li>
                      <li>Try JPG or PNG format</li>
                    </ul>
                  </div>
                ) : result ? (
                  <div className="space-y-4">
                    {/* Headlines */}
                    {result.headlines.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-cyan-300 mb-2">📌 Headlines</h3>
                        <div className="space-y-2">
                          {result.headlines.map((h, i) => (
                            <div key={i} className="bg-cyan-500/10 border border-cyan-500/30 rounded px-3 py-2 text-sm text-gray-100">
                              {h}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Body Text */}
                    {result.body_text.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-blue-300 mb-2">📄 Body Text</h3>
                        <div className="space-y-2">
                          {result.body_text.map((b, i) => (
                            <div key={i} className="bg-blue-500/10 border border-blue-500/30 rounded px-3 py-2 text-sm text-gray-100">
                              {b}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Keywords */}
                    {result.keywords.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-emerald-300 mb-2">🏷️ Keywords</h3>
                        <div className="flex flex-wrap gap-2">
                          {result.keywords.map((k, i) => (
                            <span key={i} className="bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 rounded text-xs text-emerald-200">
                              {k}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Colors */}
                    {result.colors.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-amber-300 mb-2">🎨 Detected Colors</h3>
                        <div className="flex flex-wrap gap-3">
                          {result.colors.map((color, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div
                                className="w-10 h-10 rounded border border-gray-600 shadow-lg"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                              <span className="text-xs text-gray-300 font-mono">{color}</span>
                            </div>
                          ))}
                        </div>
                        {result.color_descriptions && (
                          <p className="text-xs text-gray-400 mt-2 italic">{result.color_descriptions}</p>
                        )}
                      </div>
                    )}

                    {/* Brand Elements */}
                    {result.brand_elements.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-pink-300 mb-2">⭐ Brand Elements</h3>
                        <ul className="text-xs text-gray-300 space-y-1">
                          {result.brand_elements.map((e, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-pink-400">•</span>
                              <span>{e}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Target Markets */}
                    {result && (
                      <div className="glass-card rounded-lg p-5 space-y-4 border border-gray-700/50">
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                          🎯 Target Markets
                          {targetLocalesForAdapt.length > 0 && (
                            <span className="text-xs font-normal text-gray-400">
                              ({targetLocalesForAdapt.length} selected)
                            </span>
                          )}
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {AVAILABLE_LOCALES.map((locale) => {
                            const isSelected = targetLocalesForAdapt.includes(locale.code);
                            return (
                              <button
                                key={locale.code}
                                type="button"
                                onClick={() => toggleLocaleForAdapt(locale.code)}
                                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs text-left transition-all ${
                                  isSelected
                                    ? "bg-indigo-500/15 border-indigo-500/40 text-white"
                                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20"
                                }`}
                              >
                                <span className="text-base">{locale.flag}</span>
                                <span className="truncate font-medium">{locale.name}</span>
                              </button>
                            );
                          })}
                        </div>

                        {targetLocalesForAdapt.length === 0 && (
                          <p className="text-xs text-amber-400/80">
                            ⚠ Select at least one target market to adapt the content
                          </p>
                        )}

                        <button
                          onClick={adaptExtraction}
                          disabled={adaptLoading || targetLocalesForAdapt.length === 0}
                          className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                        >
                          {adaptLoading ? (
                            <>
                              <Loader className="w-4 h-4 animate-spin" /> Adapting...
                            </>
                          ) : (
                            <>
                              ✈️ Adapt Campaign
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Adaptation Loading */}
                    {adaptLoading && (
                      <div className="border-t border-gray-700 pt-4 mt-4">
                        <div className="flex items-center gap-3">
                          <Loader className="w-5 h-5 text-emerald-400 animate-spin" />
                          <p className="text-gray-300 text-sm">Adapting content...</p>
                        </div>
                      </div>
                    )}

                    {/* Adaptation Error */}
                    {adaptError && (
                      <div className="border-t border-gray-700 pt-4 mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-300 text-xs">
                        <p><strong>⚠️ Error:</strong> {adaptError}</p>
                      </div>
                    )}

                    {adaptations.length > 0 && (
                      <div className="border-t border-gray-700 pt-4 mt-4 space-y-4">
                        <h3 className="text-sm font-semibold text-emerald-300">🌐 Adapted Content</h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {adaptations.map((adapt, idx) => {
                            console.log("🎯 Displaying adaptation:", adapt);
                            
                            // Extract culturalScore safely (it might be an object)
                            const scoreValue = typeof adapt.culturalScore === 'object' 
                              ? adapt.culturalScore?.overall || 0 
                              : adapt.culturalScore || 0;
                            
                            // Extract explanation safely (it might be an object)
                            const explanationText = typeof adapt.explanation === 'object'
                              ? adapt.explanation?.explanation || 'Culturally adapted'
                              : adapt.explanation || 'Culturally adapted';

                            // Get headline and cta safely
                            const headline = adapt.adapted?.headline || adapt.translated?.headline || '';
                            const cta = adapt.adapted?.cta || adapt.translated?.cta || '';
                            
                            console.log("📝 Headlines and CTA:", { headline, cta, adapted: adapt.adapted });

                            return (
                              <div key={idx} className="border border-emerald-500/30 rounded-lg p-4 space-y-3 hover:border-emerald-500/60 transition-all">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-semibold text-emerald-300">
                                    {AVAILABLE_LOCALES.find((l) => l.code === adapt.locale)?.flag} {adapt.localeName}
                                  </h4>
                                  {scoreValue && (
                                    <span className="text-xs bg-emerald-500/20 px-2 py-1 rounded text-emerald-200">
                                      Score: {Math.round(scoreValue)}%
                                    </span>
                                  )}
                                </div>

                                {/* Display adapted headline */}
                                {headline && (
                                  <div>
                                    <p className="text-xs text-gray-400 mb-2">📌 Headline</p>
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded px-3 py-2">
                                      <p className="text-sm text-gray-100 font-medium">{headline}</p>
                                    </div>
                                  </div>
                                )}

                                {/* CTA */}
                                {cta && (
                                  <div>
                                    <p className="text-xs text-gray-400">💬 CTA</p>
                                    <p className="text-sm text-gray-100 font-medium bg-blue-500/10 border border-blue-500/20 rounded px-3 py-2">
                                      {cta}
                                    </p>
                                  </div>
                                )}

                                {/* Cultural Note */}
                                {explanationText && (
                                  <p className="text-xs text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded px-3 py-2">
                                    <strong>📢 Cultural Note:</strong> {explanationText}
                                  </p>
                                )}

                                {/* Generate Banner Button */}
                                <button
                                  onClick={() => generateBanner(adapt)}
                                  disabled={generatingBanner === adapt.locale}
                                  className="w-full mt-2 py-2 px-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                                >
                                  {generatingBanner === adapt.locale ? (
                                    <>
                                      <Loader className="w-4 h-4 animate-spin" /> Generating...
                                    </>
                                  ) : (
                                    <>
                                      <Download className="w-4 h-4" /> Generate Banner
                                    </>
                                  )}
                                </button>

                                {/* Display generated banner if available */}
                                {generatedBanners[adapt.locale] && (
                                  <div className="mt-2 border-t border-emerald-500/20 pt-2">
                                    <p className="text-xs text-gray-400 mb-2">✅ Generated Banner</p>
                                    <img 
                                      src={generatedBanners[adapt.locale]} 
                                      alt={`Banner for ${adapt.localeName}`}
                                      className="w-full rounded border border-emerald-500/30"
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!image && !loading && !error && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No image selected. Upload a banner to begin analysis.</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-xs text-gray-500 border-t border-gray-700 pt-4">
          ✓ Color extraction: Canvas API (instant) | ✓ Text extraction: Tesseract.js OCR (free) | ✓ No paid APIs
        </div>
      </div>
    </div>
  );
}
