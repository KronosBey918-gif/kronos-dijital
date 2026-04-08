export interface Profile {
  id: string; // Clerk user ID
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  credits: number;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export type DesignType =
  | "logo"
  | "kartvizit"
  | "afis"
  | "brosur"
  | "el_ilani"
  | "kitap_ayiraci"
  | "tisort"
  | "etiket"
  | "sticker"
  | "sosyal_medya"
  | "menu"
  | "davetiye"
  | "ambalaj"
  | "banner";

export type GenerationStatus = "pending" | "processing" | "completed" | "failed";
export type OutputFormat = "png" | "jpg" | "pdf" | "svg";

export interface Generation {
  id: string;
  user_id: string;
  design_type: DesignType;
  brand_name: string;
  brand_description: string | null;
  color_palette: string[] | null;
  style_notes: string | null;
  prompt_used: string | null; // English prompt sent to Replicate
  output_url: string | null;
  output_format: OutputFormat;
  replicate_id: string | null;
  status: GenerationStatus;
  is_public: boolean;
  credits_used: number;
  created_at: string;
  // Joined
  profile?: Pick<Profile, "full_name" | "avatar_url">;
}

export type CreditTransactionType = "purchase" | "usage" | "refund" | "bonus";

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number; // positive = added, negative = used
  type: CreditTransactionType;
  description: string;
  reference_id: string | null;
  created_at: string;
}

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  currency: string;
  is_active: boolean;
  iyzico_product_ref: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  package_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  iyzico_payment_id: string | null;
  iyzico_conversation_id: string | null;
  created_at: string;
  // Joined
  package?: CreditPackage;
}

export interface BrandProfile {
  id: string;
  user_id: string;
  name: string;
  industry: string | null;
  target_audience: string | null;
  color_palette: string[] | null;
  style: string | null;
  keywords: string[] | null;
  logo_url: string | null;
  created_at: string;
}

// Dashboard stats
export interface DashboardStats {
  totalGenerations: number;
  completedGenerations: number;
  creditsUsed: number;
  publicDesigns: number;
}
