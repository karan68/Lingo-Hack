import type { CampaignInput } from "../services/types";

export interface SampleCampaign extends CampaignInput {
  name: string;
  description: string;
}

export const sampleCampaigns: SampleCampaign[] = [
  {
    name: "🛍️ Black Friday Sale",
    description: "Classic US aggressive sales campaign — great for showing cultural conflicts",
    headline: "Black Friday Blowout - Don't Miss Out!",
    cta: "Buy Now - Limited Time!",
    body: "Get 50% off everything in our store! This is your last chance to grab incredible deals before they're gone forever. Hurry — limited stock available. Be the first to shop our exclusive Black Friday collection!",
    sourceLocale: "en-US",
    industry: "E-commerce / Retail",
    brandTone: "casual",
    goal: "sales",
    colors: ["red", "black", "white"],
  },
  {
    name: "💻 SaaS Product Launch",
    description: "Tech product launch with individual achievement messaging",
    headline: "Level Up Your Productivity — The Tool That Changes Everything",
    cta: "Start Your Free Trial",
    body: "Join 100,000+ professionals who've already transformed their workflow. Our AI-powered platform helps you work smarter, not harder. No credit card required — try it free for 14 days and see the difference yourself.",
    sourceLocale: "en-US",
    industry: "Technology / SaaS",
    brandTone: "professional",
    goal: "signups",
    colors: ["blue", "white"],
  },
  {
    name: "🍔 Food & Beverage",
    description: "Food campaign with potential dietary cultural conflicts",
    headline: "Summer BBQ Collection — Fire Up the Grill!",
    cta: "Shop Now",
    body: "Get everything you need for the perfect backyard BBQ. Premium beef burgers, craft beer selections, and all the fixings. Grab a cold one and enjoy summer the American way!",
    sourceLocale: "en-US",
    industry: "Food & Beverage",
    brandTone: "casual",
    goal: "sales",
    colors: ["red", "orange", "gold"],
  },
  {
    name: "💎 Luxury Fashion",
    description: "Luxury brand with sophisticated tone and visual elements",
    headline: "Exclusive Holiday Collection — Elegance Redefined",
    cta: "Discover the Collection",
    body: "Introducing our limited-edition holiday pieces, crafted with the finest materials. Each creation tells a story of timeless sophistication. Available exclusively at select boutiques this Christmas season.",
    sourceLocale: "en-US",
    industry: "Luxury Fashion",
    brandTone: "luxury",
    goal: "awareness",
    colors: ["black", "gold", "white"],
  },
];
