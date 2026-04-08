import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/server";
import { generateWithFlux, getDesignDimensions } from "@/lib/replicate/client";
import { generatePrompt, CREDIT_COSTS } from "@/lib/prompts/generator";
import type { DesignType, OutputFormat } from "@/types/database";
import { z } from "zod";

const generateSchema = z.object({
  designType: z.enum([
    "logo", "kartvizit", "afis", "brosur", "el_ilani", "kitap_ayiraci",
    "tisort", "etiket", "sticker", "sosyal_medya", "menu", "davetiye",
    "ambalaj", "banner",
  ]),
  brandName: z.string().min(1, "Marka adı gerekli").max(100),
  brandDescription: z.string().max(500).optional(),
  industry: z.string().max(100).optional(),
  targetAudience: z.string().max(200).optional(),
  colorPalette: z.array(z.string()).max(5).optional(),
  styleNotes: z.string().max(300).optional(),
  keywords: z.array(z.string()).max(10).optional(),
  outputFormat: z.enum(["png", "jpg", "pdf", "svg"]).default("png"),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = generateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz istek", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const input = parsed.data;
    const creditCost = CREDIT_COSTS[input.designType as DesignType];
    const supabase = await createAdminClient();

    // Check credits
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profil bulunamadı" }, { status: 404 });
    }

    if (profile.credits < creditCost) {
      return NextResponse.json(
        {
          error: "Yetersiz kredi",
          required: creditCost,
          available: profile.credits,
        },
        { status: 402 }
      );
    }

    // Deduct credits immediately
    const { error: deductError } = await supabase.rpc("deduct_credits", {
      p_user_id: userId,
      p_amount: creditCost,
    });

    if (deductError) {
      // Fallback: direct update
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ credits: profile.credits - creditCost })
        .eq("id", userId);

      if (updateError) {
        return NextResponse.json({ error: "Kredi düşülemedi" }, { status: 500 });
      }
    }

    // Generate English prompt
    const prompt = generatePrompt({
      designType: input.designType as DesignType,
      brandName: input.brandName,
      brandDescription: input.brandDescription,
      industry: input.industry,
      targetAudience: input.targetAudience,
      colorPalette: input.colorPalette,
      styleNotes: input.styleNotes,
      keywords: input.keywords,
    });

    // Create generation record (pending)
    const { data: generation, error: genError } = await supabase
      .from("generations")
      .insert({
        user_id: userId,
        design_type: input.designType,
        brand_name: input.brandName,
        brand_description: input.brandDescription ?? null,
        color_palette: input.colorPalette ?? null,
        style_notes: input.styleNotes ?? null,
        prompt_used: prompt,
        output_format: input.outputFormat,
        status: "processing",
        credits_used: creditCost,
      })
      .select()
      .single();

    if (genError || !generation) {
      // Refund credits
      await supabase
        .from("profiles")
        .update({ credits: profile.credits })
        .eq("id", userId);

      return NextResponse.json({ error: "Kayıt oluşturulamadı" }, { status: 500 });
    }

    // Record credit transaction
    await supabase.from("credit_transactions").insert({
      user_id: userId,
      amount: -creditCost,
      type: "usage",
      description: `${input.designType} tasarımı üretildi: ${input.brandName}`,
      reference_id: generation.id,
    });

    // Generate image with Replicate
    try {
      const dimensions = getDesignDimensions(input.designType);
      const outputUrls = await generateWithFlux({
        prompt,
        width: dimensions.width,
        height: dimensions.height,
        num_outputs: 1,
        output_format: input.outputFormat === "pdf" || input.outputFormat === "svg" ? "png" : input.outputFormat as "png" | "jpg",
      });

      const outputUrl = outputUrls[0];

      // Update generation with result
      await supabase
        .from("generations")
        .update({
          output_url: outputUrl,
          status: "completed",
        })
        .eq("id", generation.id);

      return NextResponse.json({
        success: true,
        generationId: generation.id,
        outputUrl,
        creditsUsed: creditCost,
      });
    } catch (replicateError) {
      // Refund credits on generation failure
      await supabase
        .from("profiles")
        .update({ credits: profile.credits })
        .eq("id", userId);

      await supabase.from("credit_transactions").insert({
        user_id: userId,
        amount: creditCost,
        type: "refund",
        description: `Üretim hatası - kredi iadesi: ${input.brandName}`,
        reference_id: generation.id,
      });

      await supabase
        .from("generations")
        .update({ status: "failed" })
        .eq("id", generation.id);

      console.error("Replicate error:", replicateError);
      return NextResponse.json(
        { error: "Görüntü üretimi başarısız. Kredi iade edildi." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
