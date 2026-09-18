# kATE

Kendi sunucunda çalışan, Anthropic API'ye bağlı kişisel AI sohbet uygulaması.
API anahtarı sadece sunucuda (`.env`) tutulur, tarayıcıya asla gönderilmez.

## Kurulum

1. Node.js 18 veya üstü kurulu olmalı.
2. Bu klasörde:
   ```
   npm install
   ```
3. `.env.example` dosyasını `.env` olarak kopyala ve kendi Anthropic API anahtarını yapıştır:
   ```
   cp .env.example .env
   ```
   Anahtarı https://console.anthropic.com adresinden alabilirsin.
4. Sunucuyu başlat:
   ```
   npm start
   ```
5. Tarayıcıda aç: `http://localhost:3000`

## iPhone'dan kullanmak için

- Bilgisayarını çalışır tut, aynı Wi-Fi ağındaki iPhone'dan bilgisayarının
  yerel IP adresiyle bağlan (örn. `http://192.168.1.23:3000`), ya da
- Sunucuyu bir yere (Render, Railway, Fly.io, kendi VPS'in vb.) deploy et,
  o zaman internet üzerinden her yerden erişebilirsin.
- Safari'de siteyi açıp paylaş menüsünden "Ana Ekrana Ekle" dersen
  uygulama simgesiyle (logo dahil) ana ekrana eklenir.

## Notlar

- Ses tanıma (mikrofon) ve sesli yanıt (metin okuma) tarayıcının kendi
  Web Speech API'sini kullanır; sayfa açıkken çalışır, cihaz kilitliyken
  veya kapalıyken çalışmaz — bu bir platform kısıtıdır, kodla aşılamaz.
- Sohbet geçmişi tarayıcının `localStorage`'ında tutulur (sadece o cihaz/tarayıcıda kalır).
- "Pro" modu yalnızca yanıt tonunu daha doğrudan yapar; herhangi bir
  güvenlik/içerik kuralını devre dışı bırakmaz.
