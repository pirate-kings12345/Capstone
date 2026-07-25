/**
 * ClaudeProvider.ts
 * Anthropic Claude AI implementation of AIProvider.
 * Reads CLAUDE_API_KEY from process.env.
 */

import Anthropic from '@anthropic-ai/sdk';
import { AIProvider, ScanRequest, ScanResult, validateScanResult } from './AIProvider';

const SYSTEM_PROMPT = `You are a marine biology identification agent for AQUAID.
Identify the marine species from the image or name provided.
You MUST respond ONLY with a valid JSON object — no markdown, no preamble, no explanation.
sustainabilityStatus must be exactly one of: "Sustainable", "Caution", or "Protected".
confidence must be an integer between 60 and 100.`;

const JSON_SCHEMA = `Return exactly this JSON structure and nothing else:
{
  "commonName": "string — common English name",
  "scientificName": "string — Latin binomial",
  "family": "string — biological family",
  "habitat": "string — ocean zone or environment",
  "diet": "string — Carnivore / Herbivore / Omnivore",
  "dietDetail": "string — specific prey or food sources",
  "distribution": "string — general range",
  "distributionDetail": "string — detailed geographic range",
  "conservationStatus": "string — IUCN status",
  "confidence": integer between 60 and 100,
  "sustainabilityStatus": "Sustainable" or "Caution" or "Protected",
  "sustainabilityDescription": "string — sourcing and conservation guidance"
}`;

export class ClaudeProvider implements AIProvider {
  readonly name = 'claude' as const;
  private client: Anthropic | null = null;

  constructor() {
    const apiKey = process.env.CLAUDE_API_KEY;
    if (apiKey && apiKey !== 'YOUR_CLAUDE_API_KEY' && apiKey !== 'sk-ant-placeholder') {
      this.client = new Anthropic({ apiKey });
    }
  }

  isConfigured(): boolean {
    return this.client !== null;
  }

  async scan(request: ScanRequest): Promise<ScanResult> {
    if (!this.client) {
      throw Object.assign(new Error('CLAUDE_API_KEY is not configured. Add it to .env'), { code: 'MISSING_API_KEY' });
    }

    const userContent: Anthropic.MessageParam['content'] = [];

    if (request.base64Image) {
      const pureBase64 = request.base64Image.replace(/^data:image\/\w+;base64,/, '');
      // Detect MIME type from base64 magic bytes
      const mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' =
        pureBase64.startsWith('/9j/')   ? 'image/jpeg'
        : pureBase64.startsWith('iVBOR') ? 'image/png'
        : pureBase64.startsWith('R0lGO') ? 'image/gif'
        : pureBase64.startsWith('UklGR') ? 'image/webp'
        : 'image/jpeg';

      userContent.push({
        type: 'image',
        source: { type: 'base64', media_type: mediaType, data: pureBase64 },
      });
      userContent.push({
        type: 'text',
        text: `Identify the fish or marine species in this image.\n\n${JSON_SCHEMA}`,
      });
    } else if (request.speciesName) {
      userContent.push({
        type: 'text',
        text: `Identify and profile this marine species: "${request.speciesName}".\n\n${JSON_SCHEMA}`,
      });
    } else {
      throw Object.assign(new Error('No image or species name provided.'), { code: 'INVALID_REQUEST' });
    }

    const message = await this.client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text' || !textBlock.text.trim()) {
      throw Object.assign(new Error('Claude returned no text content.'), { code: 'EMPTY_RESPONSE' });
    }

    // Strip accidental markdown fences
    const clean = textBlock.text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(clean);
    } catch {
      throw Object.assign(new Error(`Claude returned invalid JSON: ${clean.slice(0, 120)}`), { code: 'INVALID_JSON' });
    }

    return validateScanResult(parsed);
  }
}
