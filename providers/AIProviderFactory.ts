/**
 * AIProviderFactory.ts
 * Reads AI_PROVIDER from .env and returns the correct provider instance.
 *
 * Usage in server.ts:
 *   import { getProvider } from './providers/AIProviderFactory';
 *   const provider = getProvider();
 *
 * Switch providers by changing .env:
 *   AI_PROVIDER=gemini   (default)
 *   AI_PROVIDER=claude
 */

import { AIProvider } from './AIProvider';
import { GeminiProvider } from './GeminiProvider';
import { ClaudeProvider } from './ClaudeProvider';

let _provider: AIProvider | null = null;

export function getProvider(): AIProvider {
  if (_provider) return _provider;

  const name = (process.env.AI_PROVIDER ?? 'gemini').toLowerCase().trim();

  if (name === 'claude') {
    _provider = new ClaudeProvider();
  } else {
    // Default: gemini
    _provider = new GeminiProvider();
  }

  return _provider;
}

/** Reset cached provider — used in tests or after .env hot-reload. */
export function resetProvider(): void {
  _provider = null;
}
