# 🌍 Cultural Context Adapter

Link of the technical doc - https://medium.com/@mekaranyadav8/buy-now-doesnt-work-in-japan-so-i-built-an-ai-that-knows-why-20ef0e4a3bd1
Link of the walthrough - https://drive.google.com/file/d/131vlVCMVemq35Bq9EofOBqH4yQ3bpf8y/view?usp=sharing

**AI-powered marketing localization that goes beyond translation** — adapts campaigns to resonate culturally in every target market.

> Built for the lingo.dev hackathon · Powered by lingo.dev SDK + Anthropic Claude + HuggingFace open-source models

---

## 🎯 The Problem

Translation ≠ Localization. A "Buy Now" CTA that works in the US falls flat in Japan. A red color scheme that signals urgency in America symbolizes luck in China. Holiday campaigns reference events that don't exist in other cultures.

**Cultural Context Adapter** solves this by adding an intelligent cultural adaptation layer on top of translation.


## 🆕 Latest Features

- **Advanced Adaptation Insights**:
    - **Sentiment & Emotion Analysis**: Detects and displays the emotional tone of each adaptation.
    - **Idioms & Slang Localizer**: Finds and localizes idioms/slang, with explanations.
    - **Automatic Tone Matching**: Detects and matches tone per locale, with match scoring.
    - **Back-Translation (Verification Only)**: Shows round-trip translation for verification, no longer scored or used for evaluation.

- **Cultural Sensitivity Automation**:
    - For Hindi (India), all “beef” references are automatically replaced with “vegetarian” to respect local taboos.

- **UI/UX Improvements**:
    - All advanced features are grouped and clearly displayed.
    - Back-Translation is now at the bottom, labeled for verification only, and the consistency score is removed to avoid confusion.

- **Testing & Demo**:
    - New advanced test cases for food taboos, idioms, tone, and more.
    - End-to-end demo flows for hackathon/judging.

**How to Demo:**
- Run the app, select a campaign, and choose multiple locales.
- For Hindi (India), try a campaign with “beef burger” and see it automatically adapted.
- Use the “Advanced Adaptation Insights” section to show sentiment, idioms, tone, and back-translation.
- Explain that back-translation is for verification only, not for scoring.

---

| Feature | Description |
|---------|-------------|
| **Cultural Adaptation** | Rewrites marketing copy to match local communication styles, values, and preferences |
| **Three-Column View** | Compare Original → lingo.dev Translation → Culturally Adapted side-by-side |
| **Cultural Confidence Score** | 0-100 score measuring how well content fits target culture |
| **Color Analysis** | Checks brand colors against cultural color meanings per locale |
| **Image Analysis** | Open-source AI (BLIP + ViT) scans images for cultural sensitivity issues |
| **CTA Optimization** | Locale-specific call-to-action patterns (urgency vs. harmony vs. formality) |
| **Holiday Mapping** | Automatically detects and maps holidays to local equivalents |
| **Idiom Detection** | Catches English idioms that don't translate and suggests alternatives |
| **Explanation Engine** | Detailed rationale for every cultural change made |
| **Demo Mode** | Pre-loaded sample campaigns to showcase capabilities instantly |


## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   Frontend (React + TS)                      │
│  Campaign Input → Loading → Adaptation Insights View          │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Advanced Adaptation Insights:                           │ │
│  │  - Sentiment & Emotion  - Idioms & Slang  - Tone Match │ │
│  │  - Color Analysis      - Cultural Score                 │ │
│  │  - Back-Translation (Verification, bottom of page)      │ │
│  └─────────────────────────────────────────────────────────┘ │
└────────────────────┬─────────────────────────────────────────┘
                     │ REST API
┌────────────────────▼────────────────────────────────────────┐
│                Backend (Express)                            │
│                                                            │
│  ┌──────────────┐  ┌─────────────────────┐                │
│  │ Cultural      │  │ lingo.dev SDK       │                │
│  │ Analyzer      │  │ (Translation)       │                │
│  │ (Rule-based)  │  └─────────────────────┘                │
│  └──────────────┘                                          │
│  ┌──────────────┐  ┌─────────────────────┐                │
│  │ Groq/Claude   │  │ HuggingFace         │                │
│  │ (LLM Adapt.)  │  │ (BLIP + ViT)        │                │
│  │ (Cultural     │  │ (Image Analysis)    │                │
│  │  Reasoning)   │  └─────────────────────┘                │
│  └──────────────┘                                          │
│  ┌──────────────┐  ┌─────────────────────┐                │
│  │ Color         │  │ CTA                 │                │
│  │ Analyzer      │  │ Optimizer           │                │
│  └──────────────┘  └─────────────────────┘                │
└────────────────────────────────────────────────────────────┘
```

### Pipeline Flow

1. **Rule-Based Analysis** — Detects idioms, holidays, sensitive numbers, tone, urgency, and cultural conflicts
2. **lingo.dev Translation** — High-quality machine translation via lingo.dev SDK
3. **Claude Cultural Adaptation** — Refines translations using cultural rules and communication style data
4. **Explanation Generation** — Produces human-readable rationale for every change
5. **Score Calculation** — Cultural confidence score with breakdown by category

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + TypeScript + Vite | SPA with glassmorphism dark UI |
| Styling | Tailwind CSS v4 | Utility-first styling |
| Icons | lucide-react | Consistent iconography |
| Backend | Node.js + Express (ESM) | REST API server |
| Translation | **lingo.dev SDK** | Core translation engine |
| AI Reasoning | Anthropic Claude (claude-sonnet-4-20250514) | Cultural adaptation & explanations |
| Image AI | HuggingFace Inference (BLIP + ViT) | Open-source image analysis |
| Cultural Data | JSON rule store | 9 locales × 15+ cultural dimensions |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- API keys for: [lingo.dev](https://lingo.dev), [Anthropic](https://console.anthropic.com), [HuggingFace](https://huggingface.co/settings/tokens)

### Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/lingo-hack.git
cd lingo-hack

# Install all dependencies
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..

# Configure environment
cp .env.example backend/.env
# Edit backend/.env with your API keys:
#   LINGODOTDEV_API_KEY=your_lingo_dev_key
#   ANTHROPIC_API_KEY=your_anthropic_key
#   HF_API_KEY=your_huggingface_key

# Start development servers (frontend + backend)
npm run dev
```

The app will be available at **http://localhost:5173**

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `LINGODOTDEV_API_KEY` | ✅ | lingo.dev API key for translation |
| `ANTHROPIC_API_KEY` | ✅ | Anthropic API key for Claude |
| `HF_API_KEY` | ⚡ | HuggingFace token (needed for image analysis) |
| `PORT` | ❌ | Backend port (default: 3001) |
| `FRONTEND_URL` | ❌ | Frontend URL for CORS (default: http://localhost:5173) |

## 📁 Project Structure

```
lingo-hack/
├── package.json                    # Root workspace (concurrently)
├── .env.example                    # Environment template
│
├── backend/
│   ├── package.json
│   └── src/
│       ├── server.js               # Express server entry
│       ├── config/
│       │   └── culturalRules.js    # Cultural data loader
│       ├── data/
│       │   └── culturalRules.json  # 9 locales × 15+ dimensions
│       ├── routes/
│       │   ├── campaign.routes.js  # /api/campaign/*
│       │   └── cultural.routes.js  # /api/cultural/*
│       └── services/
│           ├── adaptationEngine.js # Core pipeline orchestrator
│           ├── colorAnalyzer.js    # Color-culture mapping
│           ├── ctaOptimizer.js     # CTA localization
│           ├── culturalAnalyzer.js # Rule-based content analysis
│           ├── explanationGenerator.js # Claude explanations
│           ├── imageAnalyzer.js    # HuggingFace image pipeline
│           └── promptBuilder.js    # Claude prompt engineering
│
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx                 # Main orchestrator
        ├── index.css               # Tailwind + custom styles
        ├── data/
        │   └── sampleCampaigns.ts  # 4 demo campaigns
        ├── services/
        │   ├── api.ts              # API client
        │   └── types.ts            # TypeScript interfaces
        └── components/
            ├── Header.tsx
            ├── CampaignInput.tsx    # Input form + demo mode
            ├── LoadingState.tsx     # Animated loading
            ├── AdaptationView.tsx   # Three-column results
            ├── CulturalScoreCard.tsx # SVG ring gauge
            ├── ExplanationPanel.tsx  # Change rationale
            ├── AnalysisDashboard.tsx # Detection badges
            └── ColorAnalyzer.tsx    # Color swatch analysis
```

## 🎮 Demo Mode

Click **"Try Demo Campaign"** to load one of four pre-built marketing campaigns:

1. **🛍️ Black Friday Sale** — Tests holiday mapping, urgency adaptation, discount framing
2. **🚀 SaaS Product Launch** — Tests B2B tone, feature-focused vs. relationship-focused messaging
3. **🍕 Food & Beverage** — Tests food taboos, sensory language, dietary considerations
4. **👗 Luxury Fashion** — Tests luxury positioning, modesty considerations, color symbolism

## 🌐 Supported Locales

| Code | Market | Cultural Highlights |
|------|--------|-------------------|
| zh-CN | China | Collectivist messaging, red = luck, number sensitivities (4 vs 8) |
| ja-JP | Japan | Indirect communication, harmony focus, seasonal references |
| ko-KR | Korea | Technology emphasis, social proof, Confucian values |
| de-DE | Germany | Direct & precise, quality focus, environmental consciousness |
| fr-FR | France | Elegant expression, aesthetic appreciation, cultural pride |
| es-MX | Mexico | Warm & personal, family values, festive energy |
| ar-SA | Saudi Arabia | Formal & respectful, Islamic values, right-to-left considerations |
| hi-IN | India | Family-centric, festival-aware, diversity-sensitive |

## 🧠 How Cultural Scoring Works

The Cultural Confidence Score (0-100) is calculated from:

| Category | Weight | What It Measures |
|----------|--------|-----------------|
| Communication Style | 25% | Match with locale's directness/formality |
| Cultural Values | 25% | Alignment with core cultural values |
| Sensitivity | 25% | Avoidance of taboos and sensitive topics |
| Marketing Fit | 25% | CTA style, color choices, holiday relevance |

**Penalties:** Each detected cultural conflict reduces the score by up to 10 points.



## 📝 License

MIT

---

**Built with ❤️ for the lingo.dev hackathon**
