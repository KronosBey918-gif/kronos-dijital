# Kronos Dijital — Kurulum Rehberi

## 1. Node.js Kurulumu
1. https://nodejs.org → **LTS** sürümü indirin (v22.x)
2. Kurulumu tamamlayın
3. Terminal/CMD'yi **yeniden başlatın**
4. `node --version` ve `npm --version` ile kontrol edin

## 2. Bağımlılıkları Yükle
Proje klasöründe terminal açın:
```bash
cd "C:\Users\İSA\OneDrive\Desktop\Kronos Dijital"
npm install
```

## 3. API Keylerini Al ve .env.local'e Ekle

### Clerk (Auth)
1. https://clerk.com → "Start for free" → Google ile kayıt ol
2. "Create application" → App name: "Kronos Dijital" → Email + Google seç
3. Sol menü → **API Keys** → Key'leri kopyala:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
4. Clerk Dashboard → **Webhooks** → "Add Endpoint":
   - URL: `https://SITEADINIZ.com/api/webhooks/clerk`
   - Events: `user.created`, `user.updated`, `user.deleted`
   - Webhook secret → `CLERK_WEBHOOK_SECRET`'e ekle

### Supabase
1. https://supabase.com → GitHub ile kayıt
2. "New project" → Name: "kronos-dijital" → Region: "eu-central-1"
3. Settings → **API** → URL ve anon key → `.env.local`'e ekle
4. Settings → **API** → Service role key → `.env.local`'e ekle
5. **SQL Editor** → `supabase/schema.sql` dosyasının içeriğini yapıştır → Run

### Replicate
1. https://replicate.com → GitHub ile giriş
2. Profil → **API tokens** → "Create token"
3. `REPLICATE_API_TOKEN`'a ekle

### iyzico (Ödeme)
1. Sandbox test için: https://sandbox-merchant.iyzipay.com
2. Kayıt ol → API Anahtarları bölümünden key'leri al:
   - `IYZICO_API_KEY`
   - `IYZICO_SECRET_KEY`
3. Base URL sandbox için: `https://sandbox-api.iyzipay.com`

## 4. Uygulamayı Başlat
```bash
npm run dev
```
Tarayıcıda: http://localhost:3000

## 5. Admin Yapma
Supabase → Table Editor → profiles → kendi `is_admin` kolonunu `true` yap

## 6. Vercel'e Deploy
1. https://vercel.com → GitHub ile giriş
2. "New Project" → repo'yu seç
3. Environment Variables bölümüne `.env.local`'deki tüm değerleri ekle
4. Deploy!

## Önemli Notlar
- iyzico production için: `IYZICO_BASE_URL=https://api.iyzipay.com`
- Supabase Storage → "generations" bucket oluştur (public: true)
- Clerk Webhook URL'i → production URL'inizi kullanın
