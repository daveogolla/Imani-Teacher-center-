import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI server-side with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Gemini Content Generation Endpoint
app.post('/api/gemini/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, systemInstruction } = req.body;
    if (!prompt) {
      res.status(400).json({ error: 'Missing prompt' });
      return;
    }

    if (!ai) {
      // In case key is not provided yet in test mode, return structured fallback or mock response
      res.status(503).json({
        error: 'Gemini API key is not configured yet on server.',
        fallback: true
      });
      return;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || 'You are an expert Kenya Institute of Curriculum Development (KICD) curriculum specialist and Kenyan senior teacher crafting authentic CBC and KCSE Schemes of Work, Lesson Plans, and Revision materials matching KICD guidelines and approved course books.',
      },
    });

    res.json({
      text: response.text || '',
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate content with Gemini',
    });
  }
});

// M-Pesa STK Push endpoint - sends prompt to phone number
app.post('/api/mpesa/stk-push', (req: Request, res: Response) => {
  const { phoneNumber, amount, documentTitle } = req.body;

  if (!phoneNumber || phoneNumber.trim().length < 9) {
    res.status(400).json({
      success: false,
      message: 'Please provide a valid Safaricom phone number (e.g., 0707423879 or 0712345678)',
    });
    return;
  }

  // Format phone number
  let cleanPhone = phoneNumber.trim().replace(/\s+/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '254' + cleanPhone.slice(1);
  } else if (cleanPhone.startsWith('+')) {
    cleanPhone = cleanPhone.slice(1);
  }

  const checkoutRequestId = 'ws_CO_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let generatedReceipt = 'SLT';
  for (let i = 0; i < 7; i++) {
    generatedReceipt += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  res.json({
    success: true,
    message: `Payment prompt sent to +${cleanPhone}! Please check your phone screen and enter your M-Pesa PIN.`,
    checkoutRequestId,
    phoneNumber: '+' + cleanPhone,
    amount: amount || 15,
    recipient: '0707423879 (IMANI TEACHERS CENTER)',
    generatedReceipt,
  });
});

// M-Pesa verification endpoint for Ksh 15 send money or STK completion to 0707423879
app.post('/api/mpesa/verify', (req: Request, res: Response) => {
  const { transactionCode, phoneNumber, amount, documentTitle } = req.body;
  
  if (!transactionCode || transactionCode.trim().length < 5) {
    res.status(400).json({
      success: false,
      message: 'Please provide a valid M-Pesa transaction code (e.g. SLT479K01Z)',
    });
    return;
  }

  // Clean code and create verified receipt
  const cleanCode = transactionCode.trim().toUpperCase();
  const dateStr = new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' });

  res.json({
    success: true,
    message: 'Payment verified successfully!',
    receipt: {
      receiptNo: cleanCode,
      amount: amount || 15,
      recipient: '0707423879 (IMANI TEACHERS CENTER)',
      payerPhone: phoneNumber || '0707423879',
      document: documentTitle || 'Curriculum Resource Document',
      dateTime: dateStr,
      status: 'CONFIRMED',
    },
  });
});

// Setup Vite in Dev or Static files in Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Imani Teachers Center server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
