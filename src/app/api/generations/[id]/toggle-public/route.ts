import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({ isPublic: z.boolean() });

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Geçersiz" }, { status: 400 });

  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("generations")
    .update({ is_public: parsed.data.isPublic })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) return NextResponse.json({ error: "Güncellenemedi" }, { status: 500 });
  return NextResponse.json({ success: true });
}
