import type { DesignType } from "@/types/database";

export interface PromptInput {
  designType: DesignType;
  brandName: string;
  brandDescription?: string;
  industry?: string;
  targetAudience?: string;
  colorPalette?: string[];
  styleNotes?: string;
  keywords?: string[];
}

// Credit cost per design type
export const CREDIT_COSTS: Record<DesignType, number> = {
  logo: 3,
  kartvizit: 2,
  afis: 3,
  brosur: 4,
  el_ilani: 3,
  kitap_ayiraci: 2,
  tisort: 3,
  etiket: 2,
  sticker: 1,
  sosyal_medya: 1,
  menu: 4,
  davetiye: 3,
  ambalaj: 4,
  banner: 2,
};

// Turkish design type → English description
const DESIGN_TYPE_DESCRIPTIONS: Record<DesignType, string> = {
  logo: "professional logo design",
  kartvizit: "business card design",
  afis: "promotional poster design",
  brosur: "professional brochure design",
  el_ilani: "flyer design",
  kitap_ayiraci: "bookmark design",
  tisort: "t-shirt graphic design",
  etiket: "product label design",
  sticker: "sticker design",
  sosyal_medya: "social media post design",
  menu: "restaurant/cafe menu design",
  davetiye: "invitation card design",
  ambalaj: "product packaging design",
  banner: "horizontal banner design",
};

function buildColorSection(colors?: string[]): string {
  if (!colors || colors.length === 0) return "";
  return `, color palette: ${colors.join(", ")}`;
}

function buildStyleSection(style?: string): string {
  if (!style) return "";
  return `, style: ${style}`;
}

function buildKeywordsSection(keywords?: string[]): string {
  if (!keywords || keywords.length === 0) return "";
  return `, incorporating elements of: ${keywords.join(", ")}`;
}

/**
 * Generates a high-quality English prompt for FLUX.1-dev image generation.
 * All Turkish inputs are translated/transformed to precise English design prompts.
 */
export function generatePrompt(input: PromptInput): string {
  const designDesc = DESIGN_TYPE_DESCRIPTIONS[input.designType];
  const colorSection = buildColorSection(input.colorPalette);
  const styleSection = buildStyleSection(input.styleNotes);
  const keywordsSection = buildKeywordsSection(input.keywords);

  const industryContext = input.industry ? ` for the ${input.industry} industry` : "";
  const audienceContext = input.targetAudience
    ? ` targeting ${input.targetAudience}`
    : "";
  const brandContext = input.brandDescription
    ? `. Brand concept: ${input.brandDescription}`
    : "";

  // Core flat design constraint — always enforced
  const flatDesignConstraint = [
    "flat design style",
    "clean vector-like illustration",
    "no mockups",
    "no hands",
    "no desk",
    "no environmental background scenes",
    "no perspective product photography",
    "no 3D rendering",
    "pure flat graphic output",
    "white or solid background",
    "professional print-ready quality",
    "sharp edges",
    "bold typography",
    "high contrast",
  ].join(", ");

  const prompt = [
    `Professional ${designDesc} for brand "${input.brandName}"${industryContext}${audienceContext}${brandContext}`,
    `${flatDesignConstraint}`,
    `${colorSection}${styleSection}${keywordsSection}`,
    `ultra detailed, 8k resolution, commercial grade design, trending on behance, award-winning graphic design`,
  ]
    .filter(Boolean)
    .join(". ");

  return prompt;
}

// Design type label in Turkish
export const DESIGN_TYPE_LABELS: Record<DesignType, string> = {
  logo: "Logo",
  kartvizit: "Kartvizit",
  afis: "Afiş",
  brosur: "Broşür",
  el_ilani: "El İlanı",
  kitap_ayiraci: "Kitap Ayracı",
  tisort: "Tişört Tasarımı",
  etiket: "Etiket",
  sticker: "Sticker",
  sosyal_medya: "Sosyal Medya Postu",
  menu: "Menü",
  davetiye: "Davetiye",
  ambalaj: "Ambalaj",
  banner: "Banner",
};

// Design type icons (emoji)
export const DESIGN_TYPE_ICONS: Record<DesignType, string> = {
  logo: "✦",
  kartvizit: "💼",
  afis: "📋",
  brosur: "📄",
  el_ilani: "📃",
  kitap_ayiraci: "🔖",
  tisort: "👕",
  etiket: "🏷️",
  sticker: "⭐",
  sosyal_medya: "📱",
  menu: "🍽️",
  davetiye: "💌",
  ambalaj: "📦",
  banner: "🖼️",
};

export const ALL_DESIGN_TYPES: DesignType[] = [
  "logo",
  "kartvizit",
  "sosyal_medya",
  "afis",
  "sticker",
  "etiket",
  "brosur",
  "el_ilani",
  "banner",
  "menu",
  "davetiye",
  "ambalaj",
  "tisort",
  "kitap_ayiraci",
];
