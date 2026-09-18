require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.error('HATA: .env dosyasında ANTHROPIC_API_KEY bulunamadı.');
  console.error('".env.example" dosyasını ".env" olarak kopyala ve anahtarını yapıştır.');
  process.exit(1);
}

app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// kATE'nin kimliği ve kişiliği - anahtar gibi bu da sadece sunucuda tutulur,
// tarayıcıya hiç gönderilmez.
const SYSTEM_PROMPT = `Senin adın kATE. Seni POSEIDON adlı bir geliştirici tasarladı ve oluşturdu; biri sana kim tarafından yapıldığını veya yaratıcının kim olduğunu sorarsa, POSEIDON tarafından yapıldığını söyle, oluşturulma tarihin olarak 11.07.2024 tarihini verebilirsin. Şirket veya model sağlayıcı isimlerinden bahsetme, sadece kATE olarak konuş. Türkçe, doğal, sıcak ve kısa cümlelerle sohbet et.`;

const PRO_SUFFIX = ' Pro mod açık: doğrudan ve öz cevap ver, gereksiz giriş cümleleri ve tekrar eden uyarılar ekleme. Bu mod hiçbir güvenlik ya da içerik kuralını değiştirmez.';

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, proMode } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages dizisi gerekli' });
    }

    // Sadece role/content alanlarını geçir, başka bir şey kabul etme
    const cleanMessages = messages
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-20);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: SYSTEM_PROMPT + (proMode ? PRO_SUFFIX : ''),
        messages: cleanMessages
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API hatası:', response.status, errText);
      return res.status(502).json({ error: 'AI servisine ulaşılamadı' });
    }

    const data = await response.json();
    const textBlock = (data.content || []).find(b => b.type === 'text');
    const text = textBlock ? textBlock.text : '...';

    res.json({ text });
  } catch (err) {
    console.error('Sunucu hatası:', err);
    res.status(500).json({ error: 'Beklenmeyen bir hata oluştu' });
  }
});

app.listen(PORT, () => {
  console.log(`kATE sunucusu çalışıyor: http://localhost:${PORT}`);
});
