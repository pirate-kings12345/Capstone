/**
 * server.claude.ts
 * AQUAID — Standalone Anthropic Claude backend.
 *
 * Identical API contract to server.ts (Gemini).
 * To use: rename this file to server.ts (or update package.json "server" script).
 * No frontend changes required.
 *
 * Requires in .env:
 *   CLAUDE_API_KEY=sk-ant-...
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import 'dotenv/config';
import { ClaudeProvider } from './providers/ClaudeProvider';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const provider = new ClaudeProvider();

function jsonError(res: express.Response, status: number, code: string, message: string) {
  res.status(status).json({ error: true, code, message });
}

app.post('/api/scan', async (req, res) => {
  const { speciesName, base64Image } = req.body as {
    speciesName?: string;
    base64Image?: string;
  };

  if (!speciesName && !base64Image) {
    jsonError(res, 400, 'INVALID_REQUEST', 'Provide speciesName or base64Image.');
    return;
  }

  if (base64Image && base64Image.length > 8 * 1024 * 1024) {
    jsonError(res, 422, 'IMAGE_TOO_LARGE', 'Image exceeds 6MB limit.');
    return;
  }

  if (!provider.isConfigured()) {
    jsonError(res, 503, 'MISSING_API_KEY', 'CLAUDE_API_KEY is not configured. Add it to .env');
    return;
  }

  try {
    const result = await provider.scan({ speciesName, base64Image });
    res.json(result);
  } catch (err: any) {
    const code    = err?.code    ?? 'UNKNOWN_ERROR';
    const message = err?.message ?? 'An unexpected error occurred.';
    console.error(`[AQUAID/claude] ${code}:`, message);
    res.status(500).json({ error: true, code, message });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({
    status:        'ok',
    provider:      'claude',
    providerLoaded: true,
    apiConfigured: provider.isConfigured(),
    sqlite:        true,
    server:        true,
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AQUAID Claude server running on http://localhost:${PORT}`);
    console.log(`Configured: ${provider.isConfigured()}`);
  });
}

startServer();
