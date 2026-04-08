import Iyzipay from "iyzipay";

export const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY!,
  secretKey: process.env.IYZICO_SECRET_KEY!,
  uri: process.env.IYZICO_BASE_URL ?? "https://sandbox-api.iyzipay.com",
});

export interface IyzicoPaymentRequest {
  conversationId: string;
  price: string;
  paidPrice: string;
  currency: string;
  basketId: string;
  paymentGroup: string;
  callbackUrl: string;
  buyer: {
    id: string;
    name: string;
    surname: string;
    email: string;
    identityNumber: string;
    ip: string;
    city: string;
    country: string;
    registrationAddress: string;
  };
  shippingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
  };
  billingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
  };
  basketItems: Array<{
    id: string;
    name: string;
    category1: string;
    itemType: string;
    price: string;
  }>;
}

export function createPaymentForm(params: IyzicoPaymentRequest): Promise<{
  status: string;
  checkoutFormContent?: string;
  paymentPageUrl?: string;
  token?: string;
  errorMessage?: string;
}> {
  return new Promise((resolve, reject) => {
    iyzipay.checkoutFormInitialize.create(params as unknown as Record<string, unknown>, (err: Error | null, result: Record<string, unknown>) => {
      if (err) reject(err);
      else resolve(result as ReturnType<typeof resolve> extends Promise<infer T> ? T : never);
    });
  });
}

export function retrievePaymentForm(token: string, conversationId: string): Promise<{
  status: string;
  paymentStatus?: string;
  paymentId?: string;
  conversationId?: string;
  price?: string;
  paidPrice?: string;
  errorMessage?: string;
}> {
  return new Promise((resolve, reject) => {
    iyzipay.checkoutForm.retrieve(
      { locale: "tr", conversationId, token },
      (err: Error | null, result: Record<string, unknown>) => {
        if (err) reject(err);
        else resolve(result as ReturnType<typeof resolve> extends Promise<infer T> ? T : never);
      }
    );
  });
}
