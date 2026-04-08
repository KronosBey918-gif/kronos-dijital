import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { retrievePaymentForm } from "@/lib/iyzico/client";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const token = formData.get("token") as string;

    if (!token) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/kredi?durum=hata`
      );
    }

    const supabase = await createAdminClient();

    // Retrieve payment status
    const result = await retrievePaymentForm(token, "");

    if (result.status !== "success" || result.paymentStatus !== "SUCCESS") {
      // Mark payment as failed
      if (result.conversationId) {
        await supabase
          .from("payments")
          .update({ status: "failed", iyzico_payment_id: result.paymentId ?? null })
          .eq("iyzico_conversation_id", result.conversationId);
      }

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/kredi?durum=basarisiz`
      );
    }

    // Get payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("*, credit_packages(*)")
      .eq("iyzico_conversation_id", result.conversationId)
      .single();

    if (paymentError || !payment) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/kredi?durum=hata`
      );
    }

    // Idempotency: check if already processed
    if (payment.status === "completed") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/kredi?durum=basarili`
      );
    }

    const creditsToAdd = payment.credit_packages?.credits ?? 0;

    // Update payment status
    await supabase
      .from("payments")
      .update({ status: "completed", iyzico_payment_id: result.paymentId ?? null })
      .eq("id", payment.id);

    // Add credits to user
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", payment.user_id)
      .single();

    if (profile) {
      await supabase
        .from("profiles")
        .update({ credits: profile.credits + creditsToAdd })
        .eq("id", payment.user_id);
    }

    // Record credit transaction
    await supabase.from("credit_transactions").insert({
      user_id: payment.user_id,
      amount: creditsToAdd,
      type: "purchase",
      description: `${payment.credit_packages?.name} paketi satın alındı — ${creditsToAdd} kredi`,
      reference_id: payment.id,
    });

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/kredi?durum=basarili&kredi=${creditsToAdd}`
    );
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/kredi?durum=hata`
    );
  }
}
