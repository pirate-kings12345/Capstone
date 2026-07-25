/**
 * server.ts
 * AQUAID Express backend — provider-agnostic AI scan endpoint.
 *
 * Switch AI providers by setting AI_PROVIDER in .env:
 *   AI_PROVIDER=gemini   (default)
 *   AI_PROVIDER=claude
 *
 * No frontend changes required when switching providers.
 */

import express from 'express';
import cors from "cors";
import path from 'path';
import { createServer as createViteServer } from 'vite';
import 'dotenv/config';
import { getProvider } from './providers/AIProviderFactory';
const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());

app.use(express.json({
  limit: '100mb'
}));

app.use(express.urlencoded({
  limit: '100mb',
  extended: true
}));

const PORT = Number(process.env.PORT ?? 3000);


// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Map provider error codes to HTTP status codes. */
function errorToStatus(code: string | undefined): number {
  switch (code) {
    case 'MISSING_API_KEY':   return 503;
    case 'INVALID_API_KEY':   return 503;
    case 'INVALID_REQUEST':   return 400;
    case 'INVALID_IMAGE':     return 422;
    case 'UNSUPPORTED_FORMAT':return 422;
    case 'EMPTY_RESPONSE':    return 502;
    case 'INVALID_JSON':      return 502;
    default:                  return 500;
  }
}

/** Consistent JSON error shape — no HTML, no plain text. */
function jsonError(res: express.Response, status: number, code: string, message: string) {
  res.status(status).json({ error: true, code, message });
}

// ─── POST /api/scan ───────────────────────────────────────────────────────────
app.post('/api/scan', async (req, res) => {
  const { speciesName, base64Image } = req.body as {
    speciesName?: string;
    base64Image?: string;
  };

  if (!speciesName && !base64Image) {
    jsonError(res, 400, 'INVALID_REQUEST', 'Provide speciesName or base64Image.');
    return;
  }

  // Image size guard — reject base64 strings larger than 8MB (raw bytes ~6MB)
if (base64Image && base64Image.length > 30000000) {
  jsonError(
    res,
    413,
    'IMAGE_TOO_LARGE',
    'Image too large'
  );
  return;
}

  const provider = getProvider();

  if (!provider.isConfigured()) {
    jsonError(res, 503, 'MISSING_API_KEY',
      `${provider.name.toUpperCase()}_API_KEY is not configured. Add it to .env and restart the server.`);
    return;
  }

  try {
    const result = await provider.scan({ speciesName, base64Image });
    // Debug: log which fields are populated in the response
    if (process.env.NODE_ENV !== 'production') {
      const populated = Object.entries(result)
        .filter(([, v]) => {
          if (Array.isArray(v)) return v.length > 0;
          return typeof v === 'string' ? v.trim().length > 0 : v !== null && v !== undefined;
        })
        .map(([k]) => k);
      console.log(`[AQUAID/${provider.name}] Fields populated (${populated.length}):`, populated.join(', '));
    }
    res.json(result);
  } catch (err: any) {
    const code    = err?.code    ?? 'UNKNOWN_ERROR';
    const message = err?.message ?? 'An unexpected error occurred.';
    const status  = errorToStatus(code);
    console.error(`[AQUAID/${provider.name}] Scan error ${code}:`, message);
    jsonError(res, status, code, message);
  }
});

// ─── GET /api/health ──────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  const provider = getProvider();
  res.json({
    status:          'ok',
    provider:        provider.name,
    providerLoaded:  true,
    apiConfigured:   provider.isConfigured(),
    sqlite:          true,
    server:          true,
  });
});

// ─── Dev / Production serving ─────────────────────────────────────────────────
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
    const provider = getProvider();
    console.log(`AQUAID server running on http://localhost:${PORT}`);
    console.log(`AI Provider : ${provider.name}`);
    console.log(`Configured  : ${provider.isConfigured()}`);
  });
}

startServer();

