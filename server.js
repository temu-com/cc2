const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const TELEGRAM_BOT_TOKEN = '7740489037:AAHgOz-DbTeXM-IqY9luQNPL4uao1kWrudU';
const TELEGRAM_CHAT_ID = '5395609882';

app.post('/sendTelegramPhoto', async (req, res) => {
  const { photoBase64 } = req.body;
  if (!photoBase64) return res.status(400).json({ success: false, error: 'photoBase64 eksik' });

  try {
    const buffer = Buffer.from(photoBase64.split(',')[1], 'base64');
    const formData = new (require('form-data'))();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('photo', buffer, 'screenshot.png');

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if (!data.ok) throw new Error(data.description);

    res.json({ success: true, result: data.result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));
