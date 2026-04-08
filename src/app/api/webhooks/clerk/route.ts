import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret eksik" }, { status: 500 });
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Eksik header" }, { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(webhookSecret);

  let event: {
    type: string;
    data: {
      id: string;
      email_addresses: Array<{ email_address: string }>;
      first_name?: string;
      last_name?: string;
      image_url?: string;
    };
  };

  try {
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as typeof event;
  } catch (err) {
    return NextResponse.json({ error: "Geçersiz imza" }, { status: 400 });
  }

  const supabase = await createAdminClient();

  if (event.type === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } = event.data;
    const email = email_addresses[0]?.email_address ?? "";
    const fullName = [first_name, last_name].filter(Boolean).join(" ") || null;

    const { error } = await supabase.from("profiles").insert({
      id,
      email,
      full_name: fullName,
      avatar_url: image_url ?? null,
      credits: 5, // 5 ücretsiz hoşgeldin kredisi
    });

    if (error && error.code !== "23505") {
      console.error("Profile creation error:", error);
      return NextResponse.json({ error: "Profil oluşturulamadı" }, { status: 500 });
    }

    // Add welcome bonus transaction
    await supabase.from("credit_transactions").insert({
      user_id: id,
      amount: 5,
      type: "bonus",
      description: "Hoşgeldin bonusu - 5 ücretsiz kredi",
    });
  }

  if (event.type === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = event.data;
    const email = email_addresses[0]?.email_address ?? "";
    const fullName = [first_name, last_name].filter(Boolean).join(" ") || null;

    await supabase
      .from("profiles")
      .update({ email, full_name: fullName, avatar_url: image_url ?? null })
      .eq("id", id);
  }

  if (event.type === "user.deleted") {
    await supabase.from("profiles").delete().eq("id", event.data.id);
  }

  return NextResponse.json({ success: true });
}
