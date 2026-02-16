Cultural Context Adapter - AI-Powered Marketing Localization
Project Overview
A tool that adapts marketing campaigns for different cultural contexts using AI - going beyond simple translation to adjust tone, messaging, colors, CTAs, and cultural references based on psychological and cultural research. This solves the multi-billion dollar problem of tone-deaf international marketing campaigns.
The Problem We're Solving
When companies expand internationally, they typically just translate their marketing materials word-for-word. This leads to:

Cultural missteps: Pepsi's "Come Alive" slogan translated to "Pepsi brings your ancestors back from the dead" in Chinese
Ineffective messaging: Aggressive US-style CTAs ("Buy Now!") that alienate Japanese consumers who prefer soft invitations
Visual blunders: Using white (associated with death in China) for celebration campaigns
Lost revenue: 30-40% of international campaigns underperform due to cultural misalignment

Example: A Black Friday email campaign from the US:

Headline: "Black Friday Blowout - Don't Miss Out!"
CTA: "Buy Now - Limited Time!"
Colors: Red (urgency), Black (drama)
Tone: Aggressive, scarcity-driven

This would fail in:

Japan: Too pushy, Black Friday isn't culturally relevant
China: "Don't miss out" is aggressive, but red is good (prosperity not urgency)
Saudi Arabia: Imagery might show inappropriate clothing, Black Friday timing conflicts with Islamic calendar
India: Western holiday references don't resonate, needs Diwali context instead

What This Project Does
Takes a marketing campaign (landing page, email, ad copy) and:

Analyzes cultural elements (idioms, colors, holidays, tone, imagery)
Detects potential cultural conflicts for target markets
Adapts the entire campaign using AI with cultural intelligence
Explains what changed and why (transparency for marketers)
Outputs culturally-appropriate versions for multiple markets simultaneously

Key Innovation
Not just translation - cultural transformation powered by LLM with injected cultural intelligence.

Tech Stack
Frontend

React (v18+) with TypeScript
Tailwind CSS for styling
React Hook Form for input handling
Lucide React for icons
Monaco Editor (optional) for rich text editing

Backend

Node.js (v18+) with Express or Next.js API routes
lingo.dev SDK (core translation engine)
Anthropic Claude API or OpenAI GPT-4 (for image analysis and advanced reasoning)

Database

PostgreSQL or MongoDB (to store cultural rules, campaign history, user data)
Redis (optional, for caching API responses)

AI/ML Components

lingo.dev SDK: Core translation with cultural context
Claude/GPT-4 Vision: Image analysis for cultural appropriateness
Custom prompt engineering: Inject cultural intelligence into LLM

DevOps

Docker for containerization
Vercel or Railway for deployment
GitHub Actions for CI/CD


Architecture
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                    │
│  ┌───────────────────────────────────────────────────┐  │
│  │  1. Campaign Input Form                           │  │
│  │     - Text inputs (headline, body, CTA)          │  │
│  │     - Image upload                                │  │
│  │     - Source locale selection                     │  │
│  │     - Target markets (multi-select)               │  │
│  └───────────────────────────────────────────────────┘  │
│                           ↓                             │
│  ┌───────────────────────────────────────────────────┐  │
│  │  2. Analysis Dashboard                            │  │
│  │     - Detected cultural elements                  │  │
│  │     - Flagged issues per market                   │  │
│  │     - Severity indicators                         │  │
│  └───────────────────────────────────────────────────┘  │
│                           ↓                             │
│  ┌───────────────────────────────────────────────────┐  │
│  │  3. Adapted Campaign View                         │  │
│  │     - Side-by-side comparison                     │  │
│  │     - Editable outputs                            │  │
│  │     - Explanation panels                          │  │
│  │     - Export options (HTML, JSON, PDF)            │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (Node.js/Express)              │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  API Endpoints                                    │  │
│  │  POST /api/analyze        - Analyze campaign     │  │
│  │  POST /api/adapt          - Generate adaptations │  │
│  │  POST /api/analyze-image  - Check image issues   │  │
│  │  GET  /api/cultural-rules - Fetch rules DB       │  │
│  └───────────────────────────────────────────────────┘  │
│                           ↓                             │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Core Processing Pipeline                         │  │
│  │                                                   │  │
│  │  1. Content Parser                                │  │
│  │     - Extract text elements                       │  │
│  │     - Identify color codes                        │  │
│  │     - Detect idioms/metaphors                     │  │
│  │                                                   │  │
│  │  2. Cultural Analyzer                             │  │
│  │     - Load rules for target markets               │  │
│  │     - Map elements to cultural meanings           │  │
│  │     - Flag conflicts                              │  │
│  │                                                   │  │
│  │  3. Prompt Builder                                │  │
│  │     - Construct culturally-aware prompts          │  │
│  │     - Include context (brand, industry, tone)     │  │
│  │     - Add do's and don'ts per culture             │  │
│  │                                                   │  │
│  │  4. Adaptation Engine (AI-POWERED)                │  │
│  │     ┌──────────────────────────────────────┐      │  │
│  │     │  lingo.dev SDK                       │      │  │
│  │     │  - localizeText() with custom prompts│      │  │
│  │     │  - batchLocalizeText() for multiple  │      │  │
│  │     │  - Handles actual LLM calls          │      │  │
│  │     └──────────────────────────────────────┘      │  │
│  │                                                   │  │
│  │  5. Image Analyzer (AI-POWERED)                   │  │
│  │     ┌──────────────────────────────────────┐      │  │
│  │     │  Claude/GPT-4 Vision API             │      │  │
│  │     │  - Detect cultural taboos in images  │      │  │
│  │     │  - Flag inappropriate symbols        │      │  │
│  │     │  - Suggest replacements              │      │  │
│  │     └──────────────────────────────────────┘      │  │
│  │                                                   │  │
│  │  6. Explanation Generator (AI-POWERED)            │  │
│  │     - Why changes were made                       │  │
│  │     - Cultural reasoning                          │  │
│  │     - Alternative suggestions                     │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                     DATA LAYER                          │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Cultural Rules Database (PostgreSQL/MongoDB)     │  │
│  │                                                   │  │
│  │  Collections/Tables:                              │  │
│  │  - color_meanings (color, locale, meaning, use)   │  │
│  │  - cta_styles (locale, effective_phrases, tone)   │  │
│  │  - communication_styles (locale, values, taboos)  │  │
│  │  - holiday_mappings (source_holiday, target_map)  │  │
│  │  - cultural_taboos (locale, category, items)      │  │
│  │  - campaigns (user_id, original, adaptations)     │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Cache Layer (Redis - Optional)                   │  │
│  │  - Cache LLM responses (same campaign + locale)   │  │
│  │  - Reduce API costs                               │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

How lingo.dev Fits In
Primary Use: Core Translation + Cultural Adaptation
lingo.dev SDK is the main translation engine that handles:

Text localization with cultural context
Batch processing for multiple markets simultaneously
HTML preservation if adapting web pages
Consistent terminology across campaign elements

Integration Points
1. Headline Adaptation
javascriptimport { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

async function adaptHeadline(headline, targetLocale, culturalContext) {
  const adapted = await lingoDotDev.localizeText(
    headline,
    {
      sourceLocale: "en-US",
      targetLocale: targetLocale,
      // CRITICAL: Custom prompt with cultural intelligence
      customPrompt: buildCulturalPrompt(targetLocale, culturalContext)
    }
  );
  
  return adapted;
}

function buildCulturalPrompt(locale, context) {
  const rules = getCulturalRules(locale); // From database
  
  return `
    You are a cultural marketing expert adapting US campaigns for ${locale} audiences.
    
    CULTURAL VALUES FOR ${locale}:
    ${rules.values.join(', ')}
    
    COMMUNICATION STYLE:
    ${rules.communicationStyle}
    
    AVOID:
    ${rules.avoidances.join('\n- ')}
    
    PREFER:
    ${rules.preferences.join('\n- ')}
    
    CONTEXT: ${context.industry}, ${context.brandTone}
    
    Adapt this headline to resonate with ${locale} cultural psychology:
    "{text}"
    
    Provide:
    1. Culturally adapted version
    2. Brief explanation of key changes
  `;
}
2. Batch Processing for Multiple Markets
javascriptasync function adaptToAllMarkets(campaign, targetLocales) {
  // Headline for all markets
  const headlines = await lingoDotDev.batchLocalizeText(
    campaign.headline,
    {
      sourceLocale: "en-US",
      targetLocales: targetLocales,
      customPromptTemplate: (locale) => buildCulturalPrompt(locale, campaign.context)
    }
  );
  
  // CTA for all markets
  const ctas = await lingoDotDev.batchLocalizeText(
    campaign.cta,
    {
      sourceLocale: "en-US", 
      targetLocales: targetLocales,
      customPromptTemplate: (locale) => buildCTAPrompt(locale)
    }
  );
  
  // Body copy for all markets
  const bodyCopy = await lingoDotDev.batchLocalizeText(
    campaign.body,
    {
      sourceLocale: "en-US",
      targetLocales: targetLocales,
      customPromptTemplate: (locale) => buildBodyPrompt(locale, campaign.context)
    }
  );
  
  // Combine results
  return targetLocales.map((locale, index) => ({
    locale,
    headline: headlines[index],
    cta: ctas[index],
    body: bodyCopy[index]
  }));
}
3. HTML/Email Adaptation
javascriptasync function adaptEmailTemplate(htmlTemplate, targetLocale) {
  // lingo.dev preserves HTML structure while translating content
  const adaptedHTML = await lingoDotDev.localizeHtml(
    htmlTemplate,
    {
      sourceLocale: "en-US",
      targetLocale: targetLocale,
      customPrompt: buildCulturalPrompt(targetLocale, { type: 'email' })
    }
  );
  
  return adaptedHTML;
}
4. Explanation Generation
javascriptasync function explainAdaptation(original, adapted, locale) {
  // Use lingo.dev to generate explanations
  const explanation = await lingoDotDev.localizeText(
    `Original: "${original}" → Adapted: "${adapted}"`,
    {
      sourceLocale: "en",
      targetLocale: "en", // Same language, different purpose
      customPrompt: `
        Explain why this marketing text was adapted from US English to ${locale}.
        Focus on cultural psychology and communication style differences.
        
        Be specific about:
        1. What changed (words, tone, structure)
        2. Why it changed (cultural reason)
        3. What the new version achieves
        
        Write for a marketer who doesn't speak ${locale}.
      `
    }
  );
  
  return explanation;
}
Why lingo.dev vs Direct LLM Calls?
Featurelingo.dev SDKDirect OpenAI/Claude APITranslation qualityOptimized for localizationGeneral purposeBatch processingBuilt-in, efficientManual implementationHTML preservationAutomaticManual parsing neededTerminology consistencyBuilt-in memoryManual trackingCostOptimized pricingPay per tokenCachingAutomaticManual Redis setupRate limitingHandledManual implementation
Use lingo.dev for: All text translation/adaptation tasks
Use direct LLM API for: Image analysis, complex reasoning, explanation generation

Where to Use LLM/ML/AI
1. Text Adaptation (lingo.dev SDK → LLM)
Location: src/services/adaptationEngine.js
javascript// USES AI: YES (via lingo.dev SDK)
// WHY: Needs contextual understanding, cultural nuance, creative adaptation
async function adaptCampaignText(text, targetLocale, culturalRules) {
  return await lingoDotDev.localizeText(text, {
    sourceLocale: "en-US",
    targetLocale: targetLocale,
    customPrompt: injectCulturalContext(culturalRules)
  });
}
2. Image Analysis (Direct Vision API)
Location: src/services/imageAnalyzer.js
javascript// USES AI: YES (Claude Vision or GPT-4V)
// WHY: Needs visual understanding, symbol recognition, cultural interpretation
async function analyzeImageForCulturalIssues(imageBase64, targetLocale) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: { 
              type: "base64", 
              media_type: "image/jpeg", 
              data: imageBase64 
            }
          },
          {
            type: "text",
            text: buildImageAnalysisPrompt(targetLocale)
          }
        ]
      }]
    })
  });
  
  const result = await response.json();
  return JSON.parse(result.content[0].text);
}

function buildImageAnalysisPrompt(locale) {
  const culturalRules = getCulturalRules(locale);
  
  return `
    Analyze this image for cultural appropriateness in ${locale} market.
    
    CHECK FOR:
    - Taboo gestures or hand signs
    - Inappropriate clothing for culture
    - Prohibited food items: ${culturalRules.foodTaboos.join(', ')}
    - Offensive symbols or colors
    - Cultural insensitivity
    
    OUTPUT (JSON only):
    {
      "appropriate": true/false,
      "severity": "high/medium/low",
      "issues": ["specific issue 1", "specific issue 2"],
      "suggestions": ["use this instead", "remove X element"]
    }
  `;
}
3. Cultural Element Detection (Pattern Matching + Optional LLM)
Location: src/services/culturalAnalyzer.js
javascript// USES AI: OPTIONAL (hybrid approach)
// WHY: Some patterns are rule-based, complex ones use LLM

// Rule-based detection (NO AI - faster, cheaper)
function detectSimpleCulturalElements(text) {
  const idioms = detectIdioms(text); // Regex patterns
  const holidays = detectHolidays(text); // Known holiday list
  const colors = extractColors(text); // Hex code extraction
  
  return { idioms, holidays, colors };
}

// LLM-based detection for complex cases (USES AI)
async function detectComplexCulturalElements(text) {
  const analysis = await lingoDotDev.localizeText(text, {
    sourceLocale: "en",
    targetLocale: "en",
    customPrompt: `
      Analyze this marketing text for cultural elements:
      
      Identify:
      1. Metaphors and their cultural context
      2. Implicit cultural assumptions
      3. Tone indicators (casual, formal, urgent, friendly)
      4. Power dynamics in language
      5. Individual vs collective framing
      
      Text: "${text}"
      
      Output JSON only.
    `
  });
  
  return JSON.parse(analysis);
}
4. Explanation Generation (LLM via lingo.dev)
Location: src/services/explanationGenerator.js
javascript// USES AI: YES (via lingo.dev SDK)
// WHY: Needs natural language generation, reasoning about cultural differences
async function generateExplanation(original, adapted, locale, changes) {
  return await lingoDotDev.localizeText(
    JSON.stringify({ original, adapted, changes }),
    {
      sourceLocale: "en",
      targetLocale: "en",
      customPrompt: `
        You adapted marketing content from US English to ${locale}.
        
        Original: "${original}"
        Adapted: "${adapted}"
        Changes made: ${JSON.stringify(changes)}
        
        Write a clear explanation for a marketer explaining:
        1. What changed (specific words/phrases)
        2. Cultural reasoning (why it needed to change)
        3. Expected impact (how it will perform better)
        
        Keep it concise (3-4 sentences).
      `
    }
  );
}
5. Color Scheme Recommendations (Rule-Based + NO AI)
Location: src/services/colorAnalyzer.js
javascript// USES AI: NO
// WHY: Deterministic color-to-meaning mapping, no creativity needed
function analyzeColorScheme(colors, targetLocale) {
  const culturalColorMeanings = getColorMeanings(targetLocale); // From DB
  
  const analysis = colors.map(color => {
    const meaning = culturalColorMeanings[color];
    
    return {
      color,
      originalIntent: meaning.western,
      targetMeaning: meaning[targetLocale],
      appropriate: meaning.marketingUse[targetLocale].appropriate,
      suggestions: meaning.marketingUse[targetLocale].alternatives
    };
  });
  
  return analysis;
}
6. CTA Recommendations (Database Lookup + NO AI for MVP)
Location: src/services/ctaOptimizer.js
javascript// USES AI: NO (for MVP)
// WHY: Pre-defined best practices per culture
function recommendCTA(originalCTA, targetLocale) {
  const ctaStyles = getCTAStyles(targetLocale); // From DB
  
  // Simple mapping
  const ctaMap = {
    "Buy Now": {
      "ja-JP": "詳しく見る (See Details)",
      "zh-CN": "了解更多 (Learn More)",
      "de-DE": "Jetzt entdecken (Discover Now)"
    },
    "Sign Up": {
      "ja-JP": "登録する (Register)",
      "zh-CN": "立即注册 (Register Now)",
      "de-DE": "Registrieren (Register)"
    }
  };
  
  return ctaMap[originalCTA]?.[targetLocale] || originalCTA;
}

// ADVANCED: Use LLM for custom CTAs not in database
async function generateCustomCTA(originalCTA, targetLocale, context) {
  return await lingoDotDev.localizeText(originalCTA, {
    sourceLocale: "en-US",
    targetLocale: targetLocale,
    customPrompt: buildCTAPrompt(targetLocale, context)
  });
}

AI/ML Decision Matrix
ComponentUse AI?MethodReasoningText translation✅ YESlingo.dev SDKNeeds contextual understanding, nuanceCultural adaptation✅ YESlingo.dev SDK + custom promptsRequires cultural intelligenceImage analysis✅ YESClaude/GPT-4 VisionVisual understanding neededExplanation generation✅ YESlingo.dev SDKNatural language reasoningColor analysis❌ NORule-based lookupDeterministic mappingSimple CTA mapping❌ NODatabase lookupPre-defined best practicesHoliday detection❌ NOPattern matchingKnown list of holidaysHex color extraction❌ NORegexSimple parsingComplex metaphor detection⚠️ OPTIONALLLM if neededHybrid approachBatch processing✅ YESlingo.dev batchLocalizeTextEfficiency + consistency

Database Schema
Cultural Rules Database
sql-- PostgreSQL Schema

-- Color meanings across cultures
CREATE TABLE color_meanings (
  id SERIAL PRIMARY KEY,
  color VARCHAR(7) NOT NULL, -- Hex code
  locale VARCHAR(10) NOT NULL,
  cultural_meaning TEXT,
  marketing_context TEXT,
  appropriate_for_marketing BOOLEAN,
  alternative_suggestions TEXT[]
);

-- CTA effectiveness by culture
CREATE TABLE cta_styles (
  id SERIAL PRIMARY KEY,
  locale VARCHAR(10) NOT NULL,
  cta_type VARCHAR(50), -- 'purchase', 'signup', 'learn_more'
  effective_phrases TEXT[],
  ineffective_phrases TEXT[],
  tone VARCHAR(50), -- 'direct', 'soft', 'formal', 'casual'
  examples JSONB
);

-- Communication styles
CREATE TABLE communication_styles (
  id SERIAL PRIMARY KEY,
  locale VARCHAR(10) NOT NULL,
  style_type VARCHAR(50), -- 'individualistic', 'collectivist', 'hierarchical'
  core_values TEXT[],
  persuasion_tactics TEXT[],
  taboos TEXT[],
  preferences TEXT[]
);

-- Holiday mappings
CREATE TABLE holiday_mappings (
  id SERIAL PRIMARY KEY,
  source_holiday VARCHAR(100),
  source_locale VARCHAR(10),
  target_holiday VARCHAR(100),
  target_locale VARCHAR(10),
  cultural_equivalence_score DECIMAL(3,2), -- 0.0-1.0
  notes TEXT
);

-- Cultural taboos
CREATE TABLE cultural_taboos (
  id SERIAL PRIMARY KEY,
  locale VARCHAR(10) NOT NULL,
  category VARCHAR(50), -- 'food', 'gesture', 'color', 'symbol', 'number'
  taboo_item TEXT,
  severity VARCHAR(20), -- 'high', 'medium', 'low'
  explanation TEXT,
  alternative_suggestions TEXT[]
);

-- Campaign history (user data)
CREATE TABLE campaigns (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  campaign_name VARCHAR(255),
  source_locale VARCHAR(10),
  original_content JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Adaptations per campaign
CREATE TABLE adaptations (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES campaigns(id),
  target_locale VARCHAR(10),
  adapted_content JSONB,
  cultural_changes JSONB,
  explanation TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
Sample Data
sql-- Insert color meanings
INSERT INTO color_meanings (color, locale, cultural_meaning, marketing_context, appropriate_for_marketing, alternative_suggestions)
VALUES
('#FF0000', 'en-US', 'Danger, urgency, passion', 'Sales, clearance, limited time offers', true, ARRAY['#000000', '#0066CC']),
('#FF0000', 'zh-CN', 'Prosperity, luck, celebration', 'Premium products, festive campaigns, weddings', true, ARRAY['#FFD700', '#FFA500']),
('#FFFFFF', 'en-US', 'Purity, cleanliness, minimalism', 'Premium brands, healthcare, tech', true, ARRAY['#F5F5F5', '#E0E0E0']),
('#FFFFFF', 'zh-CN', 'Death, mourning', 'Avoid in celebrations, weddings', false, ARRAY['#FFD700', '#FF0000']);

-- Insert CTA styles
INSERT INTO cta_styles (locale, cta_type, effective_phrases, ineffective_phrases, tone, examples)
VALUES
('en-US', 'purchase', ARRAY['Buy Now', 'Shop Now', 'Get Yours', 'Add to Cart'], ARRAY['Maybe Consider', 'Think About It'], 'direct', '{"example": "Limited Time: Buy Now!"}'),
('ja-JP', 'purchase', ARRAY['詳しく見る', 'ご覧ください', '詳細はこちら'], ARRAY['今すぐ買え', '購入しろ'], 'soft', '{"example": "詳しく見る"}'),
('zh-CN', 'purchase', ARRAY['了解更多', '立即查看', '探索详情'], ARRAY['快买', '马上买'], 'inviting', '{"example": "立即了解"}');

-- Insert communication styles
INSERT INTO communication_styles (locale, style_type, core_values, persuasion_tactics, taboos, preferences)
VALUES
('en-US', 'individualistic', ARRAY['independence', 'innovation', 'personal achievement'], ARRAY['personal benefit', 'uniqueness', 'being first'], ARRAY['aggressive collectivism'], ARRAY['data-driven claims', 'testimonials']),
('zh-CN', 'collectivist', ARRAY['family harmony', 'tradition', 'group belonging'], ARRAY['family benefit', 'heritage', 'social proof'], ARRAY['individual over group', 'breaking tradition'], ARRAY['family imagery', 'multigenerational appeal']),
('ja-JP', 'collectivist + hierarchical', ARRAY['respect', 'harmony', 'quality'], ARRAY['group consensus', 'quality emphasis', 'soft persuasion'], ARRAY['direct confrontation', 'aggressive sales'], ARRAY['subtle messaging', 'quality focus']);
```

---

## Project Structure
```
cultural-context-adapter/
├── frontend/                    # React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── CampaignInput.tsx       # Form to input campaign
│   │   │   ├── AnalysisDashboard.tsx   # Show detected elements
│   │   │   ├── AdaptationView.tsx      # Side-by-side comparison
│   │   │   ├── ExplanationPanel.tsx    # Why changes were made
│   │   │   ├── ColorAnalyzer.tsx       # Color scheme feedback
│   │   │   └── ImageUploader.tsx       # Image upload + preview
│   │   ├── services/
│   │   │   ├── api.ts                  # API client
│   │   │   └── types.ts                # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                     # Node.js/Express API
│   ├── src/
│   │   ├── routes/
│   │   │   ├── campaign.routes.js      # Campaign endpoints
│   │   │   ├── analysis.routes.js      # Analysis endpoints
│   │   │   └── cultural.routes.js      # Cultural rules API
│   │   ├── services/
│   │   │   ├── adaptationEngine.js     # 🤖 Main AI adapter (lingo.dev)
│   │   │   ├── imageAnalyzer.js        # 🤖 Vision AI (Claude/GPT-4)
│   │   │   ├── culturalAnalyzer.js     # Cultural element detector
│   │   │   ├── promptBuilder.js        # Builds custom prompts
│   │   │   ├── explanationGenerator.js # 🤖 Generates explanations
│   │   │   ├── colorAnalyzer.js        # Color-culture mapping
│   │   │   ├── ctaOptimizer.js         # CTA recommendations
│   │   │   └── batchProcessor.js       # 🤖 Multi-market processing
│   │   ├── database/
│   │   │   ├── connection.js           # DB connection
│   │   │   ├── migrations/             # Schema migrations
│   │   │   └── seeds/                  # Sample cultural data
│   │   ├── utils/
│   │   │   ├── cache.js                # Redis caching
│   │   │   └── validators.js           # Input validation
│   │   ├── config/
│   │   │   └── culturalRules.js        # Cultural rules loader
│   │   └── server.js                   # Express app
│   ├── package.json
│   └── .env.example
│
├── shared/                      # Shared types/constants
│   └── types.ts                 # TypeScript interfaces
│
├── database/
│   ├── schema.sql              # PostgreSQL schema
│   └── seed-data.sql           # Sample cultural rules
│
├── docs/
│   ├── API.md                  # API documentation
│   ├── CULTURAL_RULES.md       # How to add new cultures
│   └── DEPLOYMENT.md           # Deployment guide
│
├── docker-compose.yml          # Local development setup
├── .env.example
├── README.md
└── package.json

Implementation Guide
Step 1: Setup Project
bash# Clone repo
git clone <your-repo>
cd cultural-context-adapter

# Install dependencies
npm install

# Setup database
docker-compose up -d postgres
npm run db:migrate
npm run db:seed

# Setup environment variables
cp .env.example .env
# Add your API keys:
# LINGODOTDEV_API_KEY=your_key
# ANTHROPIC_API_KEY=your_key (for image analysis)
Step 2: Implement Core Adaptation Engine
File: backend/src/services/adaptationEngine.js
javascriptimport { LingoDotDevEngine } from "lingo.dev/sdk";
import { buildCulturalPrompt } from "./promptBuilder.js";
import { getCulturalRules } from "../config/culturalRules.js";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

/**
 * Adapt campaign text for target locale with cultural intelligence
 * 
 * @param {string} text - Original marketing text
 * @param {string} sourceLocale - Source locale (e.g., 'en-US')
 * @param {string} targetLocale - Target locale (e.g., 'zh-CN')
 * @param {object} context - Campaign context (industry, tone, brand)
 * @returns {Promise<object>} Adapted text + explanation
 */
export async function adaptCampaignText(text, sourceLocale, targetLocale, context) {
  try {
    // Get cultural rules for target market
    const culturalRules = await getCulturalRules(targetLocale);
    
    // Build culturally-aware prompt
    const customPrompt = buildCulturalPrompt(targetLocale, culturalRules, context);
    
    // Call lingo.dev with cultural context
    const adapted = await lingoDotDev.localizeText(text, {
      sourceLocale,
      targetLocale,
      customPrompt,
    });
    
    // Generate explanation of changes
    const explanation = await generateExplanation(text, adapted, targetLocale, culturalRules);
    
    return {
      original: text,
      adapted,
      explanation,
      locale: targetLocale,
    };
    
  } catch (error) {
    console.error(`Adaptation failed for ${targetLocale}:`, error);
    throw new Error(`Failed to adapt text: ${error.message}`);
  }
}

/**
 * Adapt campaign to multiple markets simultaneously
 * 
 * @param {object} campaign - Full campaign object
 * @param {string[]} targetLocales - Array of target locales
 * @returns {Promise<object[]>} Array of adaptations
 */
export async function adaptToMultipleMarkets(campaign, targetLocales) {
  try {
    // Process headline for all markets
    const headlines = await lingoDotDev.batchLocalizeText(
      campaign.headline,
      {
        sourceLocale: campaign.sourceLocale,
        targetLocales,
        customPromptTemplate: (locale) => {
          const rules = getCulturalRules(locale);
          return buildCulturalPrompt(locale, rules, campaign.context);
        }
      }
    );
    
    // Process CTA for all markets
    const ctas = await lingoDotDev.batchLocalizeText(
      campaign.cta,
      {
        sourceLocale: campaign.sourceLocale,
        targetLocales,
        customPromptTemplate: (locale) => {
          const rules = getCulturalRules(locale);
          return buildCTAPrompt(locale, rules);
        }
      }
    );
    
    // Process body copy for all markets
    const bodyCopy = await lingoDotDev.batchLocalizeText(
      campaign.body,
      {
        sourceLocale: campaign.sourceLocale,
        targetLocales,
        customPromptTemplate: (locale) => {
          const rules = getCulturalRules(locale);
          return buildBodyPrompt(locale, rules, campaign.context);
        }
      }
    );
    
    // Combine results
    return targetLocales.map((locale, index) => ({
      locale,
      headline: headlines[index],
      cta: ctas[index],
      body: bodyCopy[index],
      timestamp: new Date().toISOString(),
    }));
    
  } catch (error) {
    console.error('Batch adaptation failed:', error);
    throw new Error(`Batch processing failed: ${error.message}`);
  }
}

async function generateExplanation(original, adapted, locale, culturalRules) {
  // Use lingo.dev to generate human-readable explanation
  const explanation = await lingoDotDev.localizeText(
    JSON.stringify({ original, adapted }),
    {
      sourceLocale: "en",
      targetLocale: "en",
      customPrompt: `
        You adapted marketing content for ${locale} market.
        
        Original: "${original}"
        Adapted: "${adapted}"
        
        Cultural context for ${locale}:
        - Values: ${culturalRules.values.join(', ')}
        - Communication style: ${culturalRules.communicationStyle}
        - Common taboos: ${culturalRules.taboos.join(', ')}
        
        Write a concise explanation (3-4 sentences) for a marketer explaining:
        1. What specific words/phrases changed
        2. The cultural reason for the change
        3. Why the adapted version will perform better
        
        Write in clear, professional English.
      `
    }
  );
  
  return explanation;
}
Step 3: Implement Prompt Builder
File: backend/src/services/promptBuilder.js
javascript/**
 * Build culturally-aware prompt for lingo.dev
 * 
 * This is WHERE THE MAGIC HAPPENS - we inject cultural intelligence into the LLM
 */
export function buildCulturalPrompt(locale, culturalRules, context) {
  return `
You are an expert cultural marketing consultant specializing in ${locale} markets.

CULTURAL CONTEXT FOR ${locale}:

Core Values:
${culturalRules.values.map(v => `- ${v}`).join('\n')}

Communication Style: ${culturalRules.communicationStyle}

Persuasion Tactics That Work:
${culturalRules.persuasionTactics.map(t => `- ${t}`).join('\n')}

AVOID (Cultural Taboos):
${culturalRules.taboos.map(t => `- ${t}`).join('\n')}

PREFER:
${culturalRules.preferences.map(p => `- ${p}`).join('\n')}

CAMPAIGN CONTEXT:
- Industry: ${context.industry}
- Brand tone: ${context.brandTone}
- Target audience: ${context.targetAudience}
- Campaign goal: ${context.goal}

YOUR TASK:
Adapt the following marketing text from ${context.sourceLocale} to ${locale}.

REQUIREMENTS:
1. Maintain the core marketing objective
2. Adjust tone, metaphors, and messaging to align with ${locale} cultural psychology
3. Replace culturally-specific references (holidays, idioms) with local equivalents
4. Ensure the adapted version feels native, not translated
5. Preserve brand voice while adapting to local communication norms

Original text: "{text}"

Provide ONLY the adapted version - no explanations or commentary.
  `.trim();
}

export function buildCTAPrompt(locale, culturalRules) {
  return `
You are adapting a call-to-action (CTA) button for ${locale} market.

CTA STYLE FOR ${locale}:
- Tone: ${culturalRules.ctaTone}
- Effective phrases: ${culturalRules.effectiveCTAs.join(', ')}
- Avoid: ${culturalRules.ineffectiveCTAs.join(', ')}

Guidelines:
${culturalRules.ctaGuidelines.map(g => `- ${g}`).join('\n')}

Adapt this CTA: "{text}"

Provide ONLY the adapted CTA text.
  `.trim();
}

export function buildBodyPrompt(locale, culturalRules, context) {
  return `
You are adapting marketing body copy for ${locale} audience.

CULTURAL CONTEXT:
- Key values: ${culturalRules.values.slice(0, 3).join(', ')}
- Communication style: ${culturalRules.communicationStyle}
- Narrative preferences: ${culturalRules.narrativeStyle}

CAMPAIGN CONTEXT:
- Industry: ${context.industry}
- Product/service: ${context.product}
- Key benefits to emphasize: ${context.benefits.join(', ')}

Guidelines for ${locale}:
${culturalRules.bodyGuidelines.map(g => `- ${g}`).join('\n')}

Adapt this body copy: "{text}"

Provide ONLY the adapted copy - maintain paragraph structure.
  `.trim();
}
Step 4: Implement Image Analyzer
File: backend/src/services/imageAnalyzer.js
javascript/**
 * Analyze images for cultural appropriateness using Vision AI
 * 
 * USES: Claude Sonnet with vision capabilities
 * WHY: Need to detect visual cultural issues (gestures, symbols, clothing, food)
 */
export async function analyzeImageForCulturalIssues(imageBase64, targetLocale, culturalRules) {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        messages: [{
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: imageBase64
              }
            },
            {
              type: "text",
              text: buildImageAnalysisPrompt(targetLocale, culturalRules)
            }
          ]
        }]
      })
    });

    const result = await response.json();
    const analysisText = result.content[0].text;
    
    // Parse JSON response
    const analysis = JSON.parse(analysisText);
    
    return {
      locale: targetLocale,
      appropriate: analysis.appropriate,
      severity: analysis.severity || 'low',
      issues: analysis.issues || [],
      suggestions: analysis.suggestions || [],
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Image analysis failed:', error);
    throw new Error(`Image analysis failed: ${error.message}`);
  }
}

function buildImageAnalysisPrompt(locale, culturalRules) {
  return `
Analyze this marketing image for cultural appropriateness in ${locale} market.

CULTURAL CONTEXT FOR ${locale}:
- Taboo items: ${culturalRules.taboos.join(', ')}
- Sensitive topics: ${culturalRules.sensitivities.join(', ')}
- Color meanings: ${culturalRules.colorMeanings.join(', ')}
- Dress code norms: ${culturalRules.dressCodes}

CHECK FOR:
1. **Taboo items**: Food (pork, beef), alcohol, specific animals
2. **Inappropriate gestures**: Hand signs, body language that offends
3. **Clothing issues**: Immodest dress, cultural/religious insensitivity
4. **Symbols**: Religious symbols used inappropriately, political symbols
5. **Color issues**: Colors with negative cultural associations
6. **Numbers**: Unlucky numbers (e.g., 4 in China/Japan, 13 in West)
7. **Gender portrayal**: Stereotypes, power dynamics
8. **Cultural stereotypes**: Offensive representations

OUTPUT (JSON ONLY - no markdown, no explanation):
{
  "appropriate": true or false,
  "severity": "high" or "medium" or "low",
  "issues": [
    "Specific issue 1 with explanation",
    "Specific issue 2 with explanation"
  ],
  "suggestions": [
    "Replace X with Y",
    "Remove Z element",
    "Consider alternative imagery showing..."
  ]
}

If the image is culturally appropriate, return:
{
  "appropriate": true,
  "severity": "low",
  "issues": [],
  "suggestions": []
}
  `.trim();
}

/**
 * Batch analyze multiple images
 */
export async function batchAnalyzeImages(images, targetLocales) {
  const culturalRulesCache = {};
  
  const analyses = [];
  
  for (const image of images) {
    for (const locale of targetLocales) {
      // Get cultural rules (cached)
      if (!culturalRulesCache[locale]) {
        culturalRulesCache[locale] = await getCulturalRules(locale);
      }
      
      const analysis = await analyzeImageForCulturalIssues(
        image.base64,
        locale,
        culturalRulesCache[locale]
      );
      
      analyses.push({
        imageId: image.id,
        ...analysis
      });
    }
  }
  
  return analyses;
}
Step 5: Create API Routes
File: backend/src/routes/campaign.routes.js
javascriptimport express from 'express';
import { adaptCampaignText, adaptToMultipleMarkets } from '../services/adaptationEngine.js';
import { analyzeImageForCulturalIssues } from '../services/imageAnalyzer.js';
import { analyzeCampaignElements } from '../services/culturalAnalyzer.js';

const router = express.Router();

/**
 * POST /api/campaign/analyze
 * Analyze campaign for cultural elements
 */
router.post('/analyze', async (req, res) => {
  try {
    const { campaign, targetLocales } = req.body;
    
    const analysis = await analyzeCampaignElements(campaign, targetLocales);
    
    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/campaign/adapt
 * Adapt campaign to target markets
 */
router.post('/adapt', async (req, res) => {
  try {
    const { campaign, targetLocales } = req.body;
    
    // Validate input
    if (!campaign || !targetLocales || !Array.isArray(targetLocales)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input: campaign and targetLocales required'
      });
    }
    
    // Adapt to all target markets
    const adaptations = await adaptToMultipleMarkets(campaign, targetLocales);
    
    // Save to database (optional)
    // await saveCampaignAdaptations(campaign.id, adaptations);
    
    res.json({
      success: true,
      adaptations
    });
    
  } catch (error) {
    console.error('Adaptation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/campaign/analyze-image
 * Analyze image for cultural issues
 */
router.post('/analyze-image', async (req, res) => {
  try {
    const { imageBase64, targetLocale } = req.body;
    
    const analysis = await analyzeImageForCulturalIssues(imageBase64, targetLocale);
    
    res.json({
      success: true,
      analysis
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
Step 6: Build React Frontend
File: frontend/src/components/CampaignInput.tsx
typescriptimport React, { useState } from 'react';
import { adaptCampaign } from '../services/api';

interface CampaignInputProps {
  onAdaptationComplete: (results: any) => void;
}

export function CampaignInput({ onAdaptationComplete }: CampaignInputProps) {
  const [campaign, setCampaign] = useState({
    headline: '',
    cta: '',
    body: '',
    sourceLocale: 'en-US',
    context: {
      industry: '',
      brandTone: '',
      goal: ''
    }
  });
  
  const [targetLocales, setTargetLocales] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const availableLocales = [
    { code: 'zh-CN', name: 'Chinese (China)' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'ko-KR', name: 'Korean' },
    { code: 'de-DE', name: 'German' },
    { code: 'fr-FR', name: 'French' },
    { code: 'es-MX', name: 'Spanish (Mexico)' },
    { code: 'ar-SA', name: 'Arabic (Saudi Arabia)' },
    { code: 'hi-IN', name: 'Hindi (India)' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (targetLocales.length === 0) {
      alert('Please select at least one target market');
      return;
    }
    
    setLoading(true);
    
    try {
      const results = await adaptCampaign(campaign, targetLocales);
      onAdaptationComplete(results);
    } catch (error) {
      console.error('Adaptation failed:', error);
      alert('Failed to adapt campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Input Your Campaign</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Headline */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Headline
          </label>
          <input
            type="text"
            value={campaign.headline}
            onChange={(e) => setCampaign({ ...campaign, headline: e.target.value })}
            placeholder="Black Friday Blowout - Don't Miss Out!"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* CTA */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Call-to-Action
          </label>
          <input
            type="text"
            value={campaign.cta}
            onChange={(e) => setCampaign({ ...campaign, cta: e.target.value })}
            placeholder="Buy Now!"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Body Copy */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Body Copy
          </label>
          <textarea
            value={campaign.body}
            onChange={(e) => setCampaign({ ...campaign, body: e.target.value })}
            placeholder="Get 50% off everything before it's too late! Limited stock available..."
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Context */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Industry</label>
            <input
              type="text"
              value={campaign.context.industry}
              onChange={(e) => setCampaign({
                ...campaign,
                context: { ...campaign.context, industry: e.target.value }
              })}
              placeholder="E-commerce"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Brand Tone</label>
            <select
              value={campaign.context.brandTone}
              onChange={(e) => setCampaign({
                ...campaign,
                context: { ...campaign.context, brandTone: e.target.value }
              })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select tone</option>
              <option value="casual">Casual</option>
              <option value="professional">Professional</option>
              <option value="luxury">Luxury</option>
              <option value="playful">Playful</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Goal</label>
            <select
              value={campaign.context.goal}
              onChange={(e) => setCampaign({
                ...campaign,
                context: { ...campaign.context, goal: e.target.value }
              })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select goal</option>
              <option value="sales">Drive Sales</option>
              <option value="awareness">Brand Awareness</option>
              <option value="signups">Get Sign-ups</option>
            </select>
          </div>
        </div>

        {/* Target Markets */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Target Markets (select multiple)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {availableLocales.map((locale) => (
              <label key={locale.code} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={targetLocales.includes(locale.code)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setTargetLocales([...targetLocales, locale.code]);
                    } else {
                      setTargetLocales(targetLocales.filter(l => l !== locale.code));
                    }
                  }}
                  className="w-4 h-4"
                />
                <span>{locale.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Adapting Campaign...' : 'Adapt Campaign'}
        </button>
      </form>
    </div>
  );
}

How to Use lingo.dev in This Project
Installation
bashnpm install lingo.dev
Authentication
bash# Option 1: Login via CLI
npx lingo.dev@latest login

# Option 2: Set API key in .env
LINGODOTDEV_API_KEY=your_api_key_here
Core Usage Patterns
1. Simple Text Adaptation
javascriptimport { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

const adapted = await lingoDotDev.localizeText(
  "Buy Now - Limited Time!",
  {
    sourceLocale: "en-US",
    targetLocale: "ja-JP",
    customPrompt: "Adapt this CTA for Japanese market. Use soft, invitational language instead of direct commands."
  }
);
2. Batch Processing
javascriptconst results = await lingoDotDev.batchLocalizeText(
  "Black Friday Sale!",
  {
    sourceLocale: "en-US",
    targetLocales: ["zh-CN", "ja-JP", "ko-KR", "de-DE"],
    customPromptTemplate: (locale) => `Adapt for ${locale} with cultural awareness`
  }
);
// Returns array: [chinese_version, japanese_version, korean_version, german_version]
3. Object Localization (Preserves Structure)
javascriptconst campaign = {
  headline: "Black Friday Blowout",
  cta: "Shop Now",
  subheading: "50% Off Everything"
};

const adapted = await lingoDotDev.localizeObject(
  campaign,
  {
    sourceLocale: "en-US",
    targetLocale: "zh-CN",
    customPrompt: culturalPrompt
  }
);
// Returns: { headline: "新春特卖", cta: "立即选购", subheading: "全场五折" }
4. HTML Preservation
javascriptconst emailHTML = `
  <h1>Welcome to Our Store!</h1>
  <p>Get <strong>50% off</strong> your first order.</p>
  <a href="/shop">Shop Now</a>
`;

const adapted = await lingoDotDev.localizeHtml(
  emailHTML,
  {
    sourceLocale: "en-US",
    targetLocale: "fr-FR",
    customPrompt: culturalPrompt
  }
);
// HTML structure preserved, text adapted

Environment Variables
bash# .env file

# lingo.dev API key (required)
LINGODOTDEV_API_KEY=your_lingodotdev_api_key

# Anthropic API key (for image analysis)
ANTHROPIC_API_KEY=your_anthropic_api_key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cultural_adapter

# Redis (optional, for caching)
REDIS_URL=redis://localhost:6379

# Server
PORT=3000
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:3000/api

Running the Project
Development
bash# Start database
docker-compose up -d

# Run backend
cd backend
npm install
npm run dev

# Run frontend (separate terminal)
cd frontend
npm install
npm run dev
Production Build
bash# Build frontend
cd frontend
npm run build

# Build backend
cd backend
npm run build

# Start production server
npm start

API Documentation
POST /api/campaign/adapt
Adapt campaign to multiple markets.
Request:
json{
  "campaign": {
    "headline": "Black Friday Blowout - Don't Miss Out!",
    "cta": "Buy Now!",
    "body": "Get 50% off everything...",
    "sourceLocale": "en-US",
    "context": {
      "industry": "retail",
      "brandTone": "casual",
      "goal": "sales"
    }
  },
  "targetLocales": ["zh-CN", "ja-JP", "de-DE"]
}
Response:
json{
  "success": true,
  "adaptations": [
    {
      "locale": "zh-CN",
      "headline": "新春好礼，全家共享",
      "cta": "立即了解",
      "body": "...",
      "explanation": "Changed 'Black Friday' to Chinese New Year context...",
      "culturalChanges": {
        "holidays": ["Black Friday → Chinese New Year"],
        "tone": ["urgent → invitational"],
        "focus": ["individual → family-oriented"]
      }
    }
  ]
}

Testing
Manual Testing Flow

Input US campaign: "Black Friday Blowout - Buy Now!"
Select targets: China, Japan, Saudi Arabia
Click "Adapt Campaign"
Verify outputs:

China: References Chinese New Year, family-oriented
Japan: Soft CTA, quality focus
Saudi Arabia: No Black Friday reference, culturally appropriate



Unit Tests
javascript// backend/tests/adaptationEngine.test.js

import { adaptCampaignText } from '../src/services/adaptationEngine.js';

describe('Adaptation Engine', () => {
  it('should adapt aggressive US CTA to soft Japanese version', async () => {
    const result = await adaptCampaignText(
      "Buy Now!",
      "en-US",
      "ja-JP",
      { industry: 'retail', brandTone: 'casual', goal: 'sales' }
    );
    
    // Should not contain direct command words
    expect(result.adapted).not.toMatch(/買え|今すぐ買/);
    
    // Should use invitational language
    expect(result.adapted).toMatch(/見る|ください/);
  });
});

Deployment
Vercel (Recommended for MVP)
bash# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# - LINGODOTDEV_API_KEY
# - ANTHROPIC_API_KEY
# - DATABASE_URL
Docker (Production)
dockerfile# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

Success Metrics
How to know if this is working:

Accuracy: Adapted campaigns feel native, not translated
Cultural appropriateness: No flagged cultural issues in outputs
Consistency: Same campaign → same adaptations (with caching)
Speed: < 5 seconds for single market, < 15 seconds for 5 markets
User satisfaction: Marketers approve adaptations without major edits


Future Enhancements (Post-Hackathon)

 A/B testing predictions
 Integration with marketing platforms (Mailchimp, HubSpot)
 Custom cultural rules per brand
 Video/audio analysis
 Real-time collaboration for teams
 Analytics dashboard (which adaptations perform best)
 Legal/compliance checking per region


License
MIT

Support
Questions? Issues? Need help?

GitHub Issues: [link]
Discord: [link]
Email: support@yourproject.com