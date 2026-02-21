# 🌍 "Buy Now" Doesn't Work in Japan — So I Built an AI That Knows Why

### How a frustrating day at work led me to build Cultural Context Adapter — an AI-powered engine that goes beyond translation to make marketing campaigns actually *resonate* across cultures.

---

![Cultural Context Adapter Banner](https://img.shields.io/badge/Built%20for-lingo.dev%20Hackathon-blue?style=for-the-badge)

> *"Translation is telling people what you said. Localization is making them feel what you meant."*

---

## 📖 The Story: When Google Translate Wasn't Enough

It was a Tuesday afternoon. I was working on a global campaign — one of those high-stakes, multi-market launches where every word counts. The creative team had crafted a killer headline:

> **"🔥 Don't Miss Out! Grab Our Black Friday Blowout Deals — Buy Now!"**

Simple. Punchy. Effective — for the US market.

Then came the localization phase. We ran the copy through translation APIs — Google Translate, Bing, the usual suspects. Minutes later, we had the headline in Japanese, Chinese, Hindi, Arabic, French, German...

*Done, right?*

Not even close.

The Japanese translation came back with "Buy Now" rendered as something close to a **command** — almost *rude* in a culture that values indirect, polite suggestion over aggressive sales tactics. The Chinese version referenced "Black Friday," a holiday that means nothing in China (they have Singles' Day, 双十一!). The Hindi version still talked about "beef burgers" from the body copy — a massive cultural taboo in India. And the Arabic output didn't even consider right-to-left formatting nuances.

Every single translation had to go through **human verification**. A team of native speakers, cultural consultants, and regional marketers spent **days** reviewing, rewriting, and re-approving. The cost? Thousands. The delay? Weeks.

And this happened **every. single. campaign.**

That's when it hit me:

> **Translation ≠ Localization. And localization without cultural intelligence is just expensive guesswork.**

So I built something to fix it.

---

## 🧠 The Idea: What If AI Could *Think* Culturally?

The core problem is simple but deep:

| What We Had | What We Needed |
|---|---|
| Word-for-word translation | Cultural *adaptation* |
| "Buy Now" → "今すぐ購入" (Japanese) | "Buy Now" → "詳しく見る" (See Details — culturally appropriate) |
| Same CTA for every market | CTAs tailored to local persuasion psychology |
| No awareness of taboos | Automatic taboo detection (beef in India, number 4 in China/Japan) |
| No color sensitivity | Red = urgency (US) vs. Red = luck (China) vs. White = mourning (China) |
| Human review bottleneck | AI-driven cultural scoring with explanations |

I imagined a pipeline where:

1. You feed in your campaign copy
2. It gets **translated** using a best-in-class translation engine
3. Then an **AI cultural layer** refines it — rewriting CTAs, swapping idioms, respecting taboos, adjusting tone
4. You get a **cultural confidence score** and a human-readable **explanation** of every change

No more blind spots. No more weeks of human review. No more accidentally offending an entire market.

---

## 🏗️ Introducing: Cultural Context Adapter

**Cultural Context Adapter** is an open-source, AI-powered marketing localization engine that goes *beyond translation* to adapt campaigns for cultural resonance across 8+ global markets.

It's built on a simple but powerful idea: **layer cultural intelligence on top of translation**.

### The Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | React 18 + TypeScript + Vite | Fast, modern SPA with glassmorphism dark UI |
| **Styling** | Tailwind CSS v4 | Rapid, utility-first design |
| **Backend** | Node.js + Express (ESM) | Lightweight REST API |
| **Translation** | **lingo.dev SDK** ⭐ | Core translation engine — fast, accurate, developer-friendly |
| **AI Reasoning** | Groq (Llama 3.3 70B) | Cultural adaptation, explanation generation, reasoning |
| **Image Analysis** | HuggingFace (BLIP + ViT) | Open-source image captioning & classification |
| **Cultural Data** | Custom JSON Rule Store | 8 locales × 15+ cultural dimensions |

---

## 🔑 Why lingo.dev Is the Foundation

Let me be real — this project wouldn't exist without [**lingo.dev**](https://lingo.dev).

Here's why: the whole premise of Cultural Context Adapter is that *translation is step one, not the finish line*. But step one still has to be **excellent**. If your base translation is garbage, no amount of cultural reasoning will save it.

lingo.dev gives us:

- **High-quality AI translation** via a dead-simple SDK
- **Object-level translation** — pass in a nested JSON, get back translated JSON with structure preserved
- **Batch translation** — translate to multiple locales in a single call
- **Developer-first API** — `npm install lingo.dev` and you're rolling

Here's the actual code from our backend:

```javascript
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

// Translate headline to Japanese
const translated = await lingoDotDev.localizeText(
  "Don't Miss Out! Grab Our Black Friday Blowout Deals!",
  { sourceLocale: "en-US", targetLocale: "ja-JP" }
);
```

That's it. One line. Clean, fast, reliable.

But here's the magic: what happens *after* this translation is where Cultural Context Adapter earns its keep.

---

## ⚙️ Architecture Deep Dive

Here's how the entire system works, end to end:

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + TypeScript)                │
│                                                                     │
│  ┌─────────────┐   ┌──────────────┐   ┌──────────────────────────┐ │
│  │  Campaign    │   │   Loading    │   │    Results Dashboard     │ │
│  │  Input Form  │──▶│   State      │──▶│  ┌────────────────────┐ │ │
│  │             │   │  (animated)  │   │  │ Three-Column View  │ │ │
│  │ • Headline  │   │              │   │  │ Original│Translated│ │ │
│  │ • CTA       │   └──────────────┘   │  │         │ Adapted  │ │ │
│  │ • Body      │                      │  ├────────────────────┤ │ │
│  │ • Colors    │                      │  │ Cultural Score Ring │ │ │
│  │ • Image     │                      │  │ Explanation Panel  │ │ │
│  │ • Locales   │                      │  │ Color Analysis     │ │ │
│  └─────────────┘                      │  │ Sentiment & Tone   │ │ │
│                                       │  │ Idiom Detection    │ │ │
│  ┌─────────────────┐                  │  │ Back-Translation   │ │ │
│  │  Demo Campaigns  │                  │  └────────────────────┘ │ │
│  │  (Pre-loaded)    │                  └──────────────────────────┘ │
│  └─────────────────┘                                               │
└────────────────────────────┬────────────────────────────────────────┘
                             │ REST API (POST /api/campaign/adapt)
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        BACKEND (Node.js + Express)                  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                   ADAPTATION ENGINE (Orchestrator)            │   │
│  │                                                              │   │
│  │  STEP 1: Rule-Based Analysis ──────────────────────────┐     │   │
│  │  (No AI • Instant • Free)                              │     │   │
│  │  • Idiom detection (12+ patterns)                      │     │   │
│  │  • Holiday detection & mapping                         │     │   │
│  │  • Sensitive number detection (4,9,13...)              │     │   │
│  │  • Tone & urgency analysis                            │     │   │
│  │  • Color reference extraction                         │     │   │
│  │  • Cultural conflict scanning                         │     │   │
│  │  • Sentiment & emotion analysis                       │     │   │
│  │                                                        │     │   │
│  │  STEP 2: Translation ──────────────────────────────────┤     │   │
│  │  ┌─────────────────────────────────┐                   │     │   │
│  │  │        lingo.dev SDK            │                   │     │   │
│  │  │  • localizeText() per field     │                   │     │   │
│  │  │  • Parallel translation         │                   │     │   │
│  │  │  • Source → Target locale       │                   │     │   │
│  │  └─────────────────────────────────┘                   │     │   │
│  │                                                        │     │   │
│  │  STEP 3: Cultural Adaptation (LLM) ───────────────────┤     │   │
│  │  ┌─────────────────────────────────┐                   │     │   │
│  │  │   Groq / Llama 3.3 70B         │                   │     │   │
│  │  │  • Cultural prompt engineering  │                   │     │   │
│  │  │  • Injects cultural rules JSON  │                   │     │   │
│  │  │  • Adapts headline, CTA, body   │                   │     │   │
│  │  │  • Returns changes + scores     │                   │     │   │
│  │  └─────────────────────────────────┘                   │     │   │
│  │                                                        │     │   │
│  │  STEP 4: Explanation Generation ──────────────────────┤     │   │
│  │  • Human-readable rationale for every cultural change  │     │   │
│  │  • Key changes + marketing impact summary             │     │   │
│  │                                                        │     │   │
│  │  STEP 5: Scoring ─────────────────────────────────────┤     │   │
│  │  • Weighted cultural confidence (0-100)                │     │   │
│  │  • Breakdown: Headline, CTA, Body, Colors             │     │   │
│  │  • Conflict penalties applied                         │     │   │
│  │                                                        │     │   │
│  │  STEP 6: Back-Translation Verification ───────────────┘     │   │
│  │  • Round-trip via lingo.dev for sanity check                │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │   Color       │  │    CTA       │  │   Image Analyzer         │  │
│  │   Analyzer    │  │  Optimizer   │  │   (HuggingFace)          │  │
│  │  (Rule-based) │  │ (Rule-based) │  │  • BLIP captioning       │  │
│  │  • 6 colors   │  │ • 7 CTA maps │  │  • ViT classification    │  │
│  │  • 8 locales  │  │ • 8 locales  │  │  • Cultural rule check   │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │               CULTURAL RULES DATABASE (JSON)                 │   │
│  │  8 locales × 15+ dimensions per locale                       │   │
│  │  • Values, taboos, preferences, CTA styles, color meanings   │   │
│  │  • Holiday mappings, number sensitivities, dress codes       │   │
│  │  • Communication style, narrative style, persuasion tactics  │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### Pipeline Flowchart

```
        ┌──────────────────┐
        │   User submits   │
        │   campaign +     │
        │   target locales │
        └────────┬─────────┘
                 │
                 ▼
   ┌─────────────────────────┐
   │  STEP 1: Rule-Based     │ ◀── No AI, instant, free
   │  Cultural Analysis       │
   │  ─────────────────────   │
   │  • Scan for idioms       │
   │  • Detect holidays       │
   │  • Check taboo numbers   │
   │  • Analyze tone/urgency  │
   │  • Detect color refs     │
   │  • Find conflicts        │
   │  • Sentiment analysis    │
   └────────────┬────────────┘
                │
                ▼
   ┌─────────────────────────┐
   │  STEP 2: Translation    │ ◀── lingo.dev SDK
   │  via lingo.dev          │
   │  ─────────────────────  │
   │  Headline ──▶ Translated│
   │  CTA ──────▶ Translated │
   │  Body ─────▶ Translated │
   │  (parallel execution)   │
   └────────────┬────────────┘
                │
                ▼
   ┌─────────────────────────┐
   │  STEP 3: Cultural       │ ◀── Groq / Llama 3.3 70B
   │  Adaptation via LLM     │
   │  ─────────────────────  │
   │  Original + Translation  │
   │  + Cultural Rules JSON   │
   │        ↓                 │
   │  Culturally adapted text │
   │  + Change explanations   │
   │  + Per-field scores      │
   └────────────┬────────────┘
                │
                ├──────────────────┐
                ▼                  ▼
   ┌──────────────────┐  ┌───────────────────┐
   │  STEP 4: Explain  │  │  STEP 4b: Color   │
   │  Every Change     │  │  Analysis         │
   │  (LLM-powered)    │  │  (Rule-based)     │
   └────────┬─────────┘  └────────┬──────────┘
            │                     │
            └──────────┬──────────┘
                       ▼
          ┌──────────────────────┐
          │  STEP 5: Calculate   │
          │  Cultural Confidence │
          │  Score (0-100)       │
          │  ────────────────    │
          │  Weighted average of │
          │  all component scores│
          │  minus conflict      │
          │  penalties           │
          └──────────┬───────────┘
                     ▼
          ┌──────────────────────┐
          │  STEP 6: Back-       │ ◀── lingo.dev SDK
          │  Translation Check   │
          │  ────────────────    │
          │  Adapted text ──▶    │
          │  Back to English     │
          │  (verification only) │
          └──────────┬───────────┘
                     ▼
          ┌──────────────────────┐
          │  Return full results │
          │  to frontend         │
          │  ────────────────    │
          │  • Original          │
          │  • Translated        │
          │  • Adapted           │
          │  • Score + Breakdown │
          │  • Explanations      │
          │  • Analysis data     │
          └──────────────────────┘
```

---

## 🎯 The Features That Make It Special

### 1. Three-Column Comparison View

See your campaign in three states, side by side:

| Original (English) | lingo.dev Translation | Culturally Adapted |
|---|---|---|
| "Don't Miss Out! Black Friday Blowout!" | "お見逃しなく！ブラックフライデー大特価！" | "年末特別ご奉仕 — この機会をぜひご覧ください" |
| "Buy Now!" | "今すぐ購入！" | "詳しく見る (See Details)" |
| Aggressive, urgent | Direct translation (feels pushy) | Polite, invitational (feels *native*) |

See what happened? The Japanese version:
- Replaced "Black Friday" (unknown concept) with "Year-End Special" (年末特別)
- Changed "Buy Now!" (a command) to "Please take a look" (ご覧ください)
- Shifted from urgency-based to harmony-based persuasion

*That's not translation. That's cultural intelligence.*

### 2. Cultural Confidence Score (0-100)

Every adaptation gets a score, calculated from weighted components:

```
Cultural Score = Weighted Average of:
  ├── Headline Score    (weight: 3)
  ├── CTA Score         (weight: 2)
  ├── Body Copy Score   (weight: 3)
  └── Color Score       (weight: 1)

  Minus: Conflict Penalties (up to -10 per high-severity conflict)
```

The score breaks down into:
- **Tone Alignment** — Does it match the locale's communication style?
- **Cultural Relevance** — Does it reference local values and concepts?
- **Taboo Avoidance** — Did it dodge all cultural landmines?
- **Local Resonance** — Would a native feel this was written *for them*?

### 3. Automatic Taboo Detection & Avoidance

The system has a rich cultural rules database covering 8 locales with 15+ dimensions each. Some examples:

| Market | Taboo | What We Do |
|---|---|---|
| 🇮🇳 India (hi-IN) | Beef references | Auto-replace "beef burger" → "vegetarian burger" |
| 🇨🇳 China (zh-CN) | Number 4 (sounds like "death") | Flag any pricing/quantities with 4 |
| 🇯🇵 Japan (ja-JP) | Aggressive CTAs | Rewrite commands → polite suggestions |
| 🇸🇦 Saudi Arabia (ar-SA) | Alcohol/pork references | Flag and suggest alternatives |
| 🇨🇳 China (zh-CN) | White in celebrations | Flag white color schemes for festive campaigns |
| 🇰🇷 Korea (ko-KR) | Red ink for names | Associated with death; flagged immediately |

### 4. Color Analysis Across Cultures

Colors aren't universal. Our Color Analyzer maps brand colors against cultural meanings:

```
Red (#FF0000):
  🇺🇸 US     → Urgency, passion, sales     ✅ Safe
  🇨🇳 China  → Luck, prosperity, happiness  ✅ Great!
  🇯🇵 Japan  → Vitality, good fortune       ✅ Safe

White (#FFFFFF):
  🇺🇸 US     → Purity, cleanliness          ✅ Safe
  🇨🇳 China  → Death, mourning, funerals    ❌ AVOID!
  🇯🇵 Japan  → Mixed (purity + mourning)    ⚠️ Cautious

Green (#00FF00):
  🇺🇸 US     → Growth, eco-friendly          ✅ Safe
  🇨🇳 China  → Infidelity (green hat!)       ❌ AVOID!
```

### 5. Idiom Detection & Localization

English is *packed* with idioms that make zero sense when translated literally:

| English Idiom | Literal Risk | What We Do |
|---|---|---|
| "Killing it!" | Sounds violent in translation | Flag + suggest culturally equivalent expression |
| "Piece of cake" | "A piece of cake" makes no sense | Replace with local idiom for "easy" |
| "Don't miss out" | FOMO pressure — aggressive in collectivist cultures | Soften to invitation |
| "Hit the ground running" | Literal = confusing | Replace with "start quickly" equivalent |
| "Game changer" | Sports metaphor, not universal | Use "revolutionary" or similar |

### 6. Image Analysis (Open-Source AI)

Upload a campaign image and our pipeline:
1. **BLIP** (Salesforce) generates a text caption describing the image
2. **ViT** (Google) classifies the image content
3. **Rule-based engine** checks the description against cultural rules
4. Returns issues, suggestions, and a cultural appropriateness score

All using **open-source models** via HuggingFace — no expensive proprietary vision APIs needed.

### 7. Sentiment & Tone Matching

The system detects the emotional tone of your campaign and checks if it matches the target culture:

- **Japan** → Emotionally restrained, subtle, quality-focused
- **Mexico** → Warm, personal, festive energy
- **Germany** → Direct, precise, quality/data-focused
- **Saudi Arabia** → Formal, respectful, value-aligned

### 8. Back-Translation Verification

After cultural adaptation, we translate the adapted text *back to English* using lingo.dev. This lets marketers who don't speak the target language **verify** that the meaning was preserved — without needing a native speaker on call.

---

## 🧪 Real Example: Black Friday in Japan

Let's trace a campaign through the system:

**Input:**
```
Headline: "🔥 Black Friday Blowout! Don't Miss Out!"
CTA: "Buy Now!"
Body: "Grab the biggest deals of the year. Up to 70% off everything. 
       This weekend only — quantities are limited, act fast!"
Target: ja-JP (Japan)
Colors: ["#FF0000", "#000000"]
```

**Step 1 — Rule-Based Analysis detects:**
- 🎌 Holiday: "Black Friday" → needs mapping to Japanese equivalent
- 💬 Idiom: "Don't miss out" → FOMO, too aggressive for Japan
- 💬 Idiom: "Blowout" → might translate literally to "explosion"
- 📢 Tone: 2 exclamation marks → too urgent for indirect culture
- 📢 ALL CAPS detected → perceived as shouting
- 🔢 70% → check for sensitive numbers (OK)
- 🎨 Colors: Red ✅, Black ✅

**Step 2 — lingo.dev translates:**
```
Headline: "🔥 ブラックフライデー大特売！お見逃しなく！"
CTA: "今すぐ購入！"
Body: "今年最大のお買い得品を手に入れましょう。最大70%オフ。
       今週末限り — 数量限定、お急ぎください！"
```

**Step 3 — Llama 3.3 culturally adapts:**
```
Headline: "✨ 年末特別ご奉仕 — 厳選された品々をぜひご覧ください"
          (Year-End Special Service — Please view our carefully selected items)
CTA: "詳しく見る" (See Details)
Body: "今年お世話になった感謝を込めて、最大70%引きでご提供いたします。
       品質にこだわった商品を、この機会にぜひお試しください。"
       (With gratitude for your support this year, we offer up to 70% off.
        Please take this opportunity to try our quality-focused products.)
```

**What changed and why:**

| Change | Cultural Reason |
|---|---|
| "Black Friday" → "年末特別ご奉仕" (Year-end special) | Black Friday isn't a concept in Japan; year-end sales are |
| "Don't miss out!" → removed | FOMO-based urgency feels rude in harmony-focused culture |
| "Buy Now!" → "詳しく見る" (See Details) | Commands are inappropriate; invitations are effective |
| "Grab deals" → "ご提供いたします" (We humbly offer) | Shifted from aggressive taking to respectful giving |
| Added gratitude language | Japanese business culture expects expressions of gratitude |
| "Act fast!" → "この機会にぜひ" (Please take this opportunity) | Urgency softened to polite suggestion |

**Cultural Score: 87/100** ✅

---

## 🧩 The Role of lingo.dev in the Pipeline

Let me emphasize this: **lingo.dev is not just "a translation API" in this project — it's the backbone.**

Here's every place lingo.dev touches:

```
Campaign Input
    │
    ├──▶ lingo.dev Translation (Step 2)
    │    • Translates headline, CTA, body in parallel
    │    • High-quality base translation for LLM to refine
    │
    ├──▶ Cultural Adaptation uses lingo.dev output (Step 3)
    │    • LLM receives both original + lingo.dev translation
    │    • Compares them to make culturally-informed changes
    │
    └──▶ lingo.dev Back-Translation (Step 6)
         • Translates adapted text back to English
         • Verification loop for non-native speakers
```

Without lingo.dev, this project would need:
- A separate translation service (more complexity)
- Custom translation infrastructure (more cost)
- Less reliable base translations (worse adaptation quality)

The lingo.dev SDK gave us a **production-ready translation layer in literally 3 lines of code**, letting us focus 100% of our energy on the *cultural intelligence layer* — which is the real innovation here.

---

## 💻 Code Highlights

### The Prompt Engineering Magic

The secret sauce is in how we inject cultural knowledge into the LLM. Here's a simplified version of our cultural adaptation prompt:

```javascript
function buildCulturalAdaptationPrompt(locale, culturalRules, context) {
  return `You are an expert cultural marketing consultant 
  specializing in ${locale} (${culturalRules.name}).

  CULTURAL CONTEXT:
  Core Values: ${culturalRules.values.join(", ")}
  Communication Style: ${culturalRules.communicationStyle}
  
  PERSUASION TACTICS THAT WORK:
  ${culturalRules.persuasionTactics.map(t => `- ${t}`).join("\n")}
  
  TABOOS TO AVOID:
  ${culturalRules.taboos.map(t => `- ❌ ${t}`).join("\n")}
  
  YOUR TASK:
  Culturally adapt the translated marketing text. Don't just 
  translate — transform it to resonate with ${locale} 
  cultural psychology.
  
  Return JSON with: adapted text, changes made, 
  cultural score, and score breakdown.`;
}
```

We're essentially giving the LLM a **cultural briefing document** for each locale, turning it into a virtual cultural consultant.

### The Cultural Rules Database

We maintain a hand-crafted JSON database with 8 locales and 15+ dimensions per locale:

```json
{
  "ja-JP": {
    "name": "Japanese",
    "communicationStyle": "Extremely indirect, polite, hierarchical",
    "values": ["respect", "harmony (和)", "quality", "modesty"],
    "taboos": ["aggressive sales", "boasting", "number 4 (死)"],
    "ctaTone": "soft",
    "effectiveCTAs": ["詳しく見る (See Details)", "ご覧ください (Please Look)"],
    "ineffectiveCTAs": ["今すぐ買え (Buy Now! - rude)"],
    "colorMeanings": {
      "#FFFFFF": { "meaning": "Purity + mourning", "appropriate": true },
      "#FF69B4": { "meaning": "Cherry blossoms, beauty", "appropriate": true }
    },
    "numberTaboos": [4, 9, 42, 49]
  }
}
```

This isn't AI-generated fluff. Each rule was researched and validated against cultural marketing best practices.

---

## 🚀 Future Scope: Where This Goes Next

This hackathon build is just the beginning. Here's what's on the roadmap:

### 1. 📄 Direct PDF Translation & Adaptation

**The vision:** Upload a marketing PDF (brochure, flyer, ad creative) and get back a fully adapted version — translated, culturally adjusted, and re-rendered as a new PDF.

```
Input: English campaign PDF
  ↓
  Extract text + layout (PDF parsing)
  ↓
  lingo.dev translation + cultural adaptation
  ↓
  Re-inject adapted text into layout
  ↓
Output: Culturally adapted PDF for ja-JP
```

No more manual copy-paste between translation tools and design tools.

### 2. 🎭 Deep Sentiment Analysis Pipeline

Go beyond basic positive/negative detection:
- **Emotion mapping** per locale (what emotions drive purchases in Japan vs. Brazil?)
- **Persuasion psychology scoring** (is this ad using the right psychological triggers?)
- **Brand voice consistency** checking across all localized versions
- **A/B test prediction** — which adaptation will perform better, with confidence intervals

### 3. 🖼️ Real-Time Image Generation

Instead of just *analyzing* images for cultural issues, **generate new ones**:

```
"Generate a campaign hero image for this jewelry ad 
 targeting Saudi Arabia — ensure modest styling, 
 gold tones (prosperity), Arabic calligraphy elements, 
 and avoid any cultural sensitivities."
```

Using Stable Diffusion or DALL-E with cultural rules injected into the generation prompt.

### 4. 🔄 Full Campaign Workflow

```
┌────────────┐    ┌──────────────┐    ┌───────────────┐
│ Upload PDF │───▶│ Cultural     │───▶│ Generate      │
│ or Design  │    │ Analysis &   │    │ Adapted PDF   │
│ File       │    │ Adaptation   │    │ + Images      │
└────────────┘    └──────────────┘    └───────┬───────┘
                                              │
                  ┌──────────────┐    ┌───────▼───────┐
                  │ Performance  │◀───│ A/B Test      │
                  │ Analytics    │    │ Predictions   │
                  └──────────────┘    └───────────────┘
```

### 5. 🌐 Expanding Locale Coverage

Currently supporting 8 markets. The goal:
- **30+ locales** with deep cultural rules
- **Regional variants** (Brazilian Portuguese vs. European Portuguese)
- **Subculture awareness** (Gen Z in Japan vs. senior demographics)
- **Industry-specific rules** (luxury, food, tech, healthcare)

### 6. 🔌 Platform Integrations

- **Adobe Creative Cloud plugin** — adapt campaigns directly inside Photoshop/InDesign
- **Figma plugin** — cultural analysis while you design
- **CMS integrations** — WordPress, Contentful, Strapi
- **CI/CD pipeline** — automated cultural checks before campaign deployment

---

## 📊 Impact & Why This Matters

The global marketing localization market is worth **$25+ billion**. And the current process is broken:

| Current Process | With Cultural Context Adapter |
|---|---|
| Translate → Human review → Fix → Re-review | Translate → Auto-adapt → Score → Ship |
| Days to weeks per market | Minutes per market |
| Thousands per campaign per locale | API costs only |
| Cultural mistakes caught *after* launch | Cultural issues caught *before* translation |
| Requires native-speaker reviewer teams | AI-powered with human-readable explanations |

This isn't about replacing human translators. It's about giving them **superpowers** — catching the 80% of cultural issues automatically so they can focus on the nuanced 20%.

---

## 🏁 Try It Yourself

The project is open source. Here's how to get started:

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/lingo-hack.git
cd lingo-hack

# Install
npm install && cd backend && npm install && cd ../frontend && npm install && cd ..

# Configure (you need 3 API keys)
# LINGODOTDEV_API_KEY  → lingo.dev
# GROQ_API_KEY         → groq.com  
# HF_API_KEY           → huggingface.co

# Run
npm run dev
# Frontend: http://localhost:5173
# Backend:  http://localhost:3001
```

Hit **"Try Demo Campaign"** to see it in action with pre-loaded campaigns (Black Friday, SaaS Launch, Food & Beverage, Luxury Fashion).

---

## 🙏 Acknowledgments

- **[lingo.dev](https://lingo.dev)** — For the incredible translation SDK and for running this hackathon. Your platform made the "translation foundation" trivially easy, letting us focus on the cultural intelligence layer.
- **Groq** — For blazing-fast LLM inference with Llama 3.3 70B
- **HuggingFace** — For democratizing AI with open-source models (BLIP, ViT)
- **The cultures of the world** — For being endlessly fascinating and reminding us that "one size fits all" never fits anyone

---

## 🎤 Final Thoughts

Every time a "Buy Now!" button goes live in Japan as a barking command instead of a polite invitation, that's not a translation problem — it's a **cultural intelligence gap**.

Every time a white-themed holiday campaign launches in China, where white means mourning, that's not a design oversight — it's a **cultural blind spot**.

And every time a marketing team spends two weeks and thousands of dollars on human review for something an AI could flag in seconds, that's not thoroughness — it's an **opportunity cost**.

**Cultural Context Adapter** doesn't replace human cultural expertise. It *democratizes* it. It gives every marketing team — from startups to enterprises — access to the cultural intelligence that used to require expensive consultants and native-speaker reviewers.

Translation is solved. **Cultural adaptation is the next frontier.**

And with tools like lingo.dev providing the translation backbone, the future of truly global marketing is closer than you think.

---

*Built with ❤️ for the lingo.dev Hackathon*

*Tags: #AI #NLP #Localization #CulturalIntelligence #MarketingTech #lingoDotDev #Translation #Hackathon #OpenSource*
