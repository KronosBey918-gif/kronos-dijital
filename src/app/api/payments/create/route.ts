import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/server";
import { createPaymentForm } from "@/lib/iyzico/client";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const schema = z.object({
  packageId: z.string().uuid(),
  buyerIp: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
    }

    const { packageId } = parsed.data;
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    const supabase = await createAdminClient();

    // Get package
    const { data: pkg, error: pkgError } = await supabase
      .from("credit_packages")
      .select("*")
      .eq("id", packageId)
      .eq("is_active", true)
      .single();

    if (pkgError || !pkg) {
      return NextResponse.json({ error: "Paket bulunamadı" }, { status: 404 });
    }

    const conversationId = uuidv4();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const email = user.emailAddresses[0]?.emailAddress ?? "";
    const firstName = user.firstName ?? "Kullanıcı";
    const lastName = user.lastName ?? "-";
    const priceStr = pkg.price.toFixed(2);

    const forwardedIp = req.headers.get("x-forwarded-for") ?? "85.34.78.112";
    const buyerIp = forwardedIp.split(",")[0].trim();

    // Create payment form
    const paymentResult = await createPaymentForm({
      conversationId,
      price: priceStr,
      paidPrice: priceStr,
      currency: "TRY",
      basketId: pkg.id,
      paymentGroup: "PRODUCT",
      callbackUrl: `${appUrl}/api/payments/callback`,
      buyer: {
        id: userId,
        name: firstName,
        surname: lastName,
        email,
        identityNumber: "11111111111",
        ip: buyerIp,
        city: "Istanbul",
        country: "Turkey",
        registrationAddress: "Türkiye",
      },
      shippingAddress: {
        contactName: `${firstName} ${lastName}`,
        city: "Istanbul",
        country: "Turkey",
        address: "Türkiye",
      },
      billingAddress: {
        contactName: `${firstName} ${lastName}`,
        city: "Istanbul",
        country: "Turkey",
        address: "Türkiye",
      },
      basketItems: [
        {
          id: pkg.id,
          name: `${pkg.name} - ${pkg.credits} Kredi`,
          category1: "Dijital Ürün",
          itemType: "VIRTUAL",
          price: priceStr,
        },
      ],
    });

    if (paymentResult.status !== "success") {
      return NextResponse.json(
        { error: paymentResult.errorMessage ?? "Ödeme başlatılamadı" },
        { status: 400 }
      );
    }

    // Save pending payment record
    await supabase.from("payments").insert({
      user_id: userId,
      package_id: packageId,
      amount: pkg.price,
      currency: "TRY",
      status: "pending",
      iyzico_conversation_id: conversationId,
    });

    return NextResponse.json({
      checkoutFormContent: paymentResult.checkoutFormContent,
      token: paymentResult.token,
    });
  } catch (error) {
    console.error("Payment create error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
