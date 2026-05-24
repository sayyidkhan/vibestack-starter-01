import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { GoogleGenAI } from '@google/genai'

export type AIProvider = 'openai' | 'anthropic' | 'gemini' | 'local'
export type ProviderHealth = 'configured' | 'fallback'
export type ProviderConfig = {
  defaultProvider: AIProvider
  promptMaxChars: number
  models: Record<Exclude<AIProvider, 'local'>, string>
  allowedProviders: AIProvider[]
}

export type ProviderResult = {
  provider: AIProvider
  model: string
  health: ProviderHealth
  output: string
}

const DEFAULT_MODELS: ProviderConfig['models'] = {
  openai: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
  anthropic: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest',
  gemini: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
}

const ALL_PROVIDERS: AIProvider[] = ['openai', 'anthropic', 'gemini', 'local']

function parseAllowedProviders(raw: string | undefined) {
  if (!raw) return ALL_PROVIDERS
  const parsed = raw
    .split(',')
    .map((value) => value.trim())
    .filter((value): value is AIProvider => ALL_PROVIDERS.includes(value as AIProvider))
  return parsed.length ? parsed : ALL_PROVIDERS
}

export function getProviderConfig(): ProviderConfig {
  const providerRaw = String(process.env.AI_PROVIDER || 'openai')
  const configuredDefaultProvider: AIProvider =
    providerRaw === 'openai' || providerRaw === 'anthropic' || providerRaw === 'gemini' || providerRaw === 'local'
      ? providerRaw
      : 'openai'
  const allowedProviders = parseAllowedProviders(process.env.AI_ALLOWED_PROVIDERS)
  const defaultProvider = allowedProviders.includes(configuredDefaultProvider)
    ? configuredDefaultProvider
    : allowedProviders[0]

  const promptMaxCharsRaw = Number(process.env.AI_PROMPT_MAX_CHARS || 2000)
  const promptMaxChars = Number.isFinite(promptMaxCharsRaw) && promptMaxCharsRaw > 120 ? promptMaxCharsRaw : 2000

  return {
    defaultProvider,
    promptMaxChars,
    models: DEFAULT_MODELS,
    allowedProviders,
  }
}

export function isProviderAllowed(provider: AIProvider, config: ProviderConfig) {
  return config.allowedProviders.includes(provider)
}

export function normalizePrompt(prompt: string, maxChars: number) {
  const normalized = prompt.replace(/\s+/g, ' ').trim()
  if (!normalized) return { ok: false as const, error: 'prompt is required' }
  if (normalized.length > maxChars) {
    return { ok: false as const, error: `prompt exceeds ${maxChars} characters` }
  }
  return { ok: true as const, value: normalized }
}

function localFallback(prompt: string) {
  return `[local] ${prompt} -> prioritize leverage, speed, and measurable learning.`
}

async function runOpenAI(prompt: string, model: string): Promise<ProviderResult> {
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    return { provider: 'openai', model: 'local-fallback', health: 'fallback', output: localFallback(prompt) }
  }

  const client = new OpenAI({ apiKey: key })
  const response = await client.responses.create({
    model,
    input: prompt,
  })
  return {
    provider: 'openai',
    model,
    health: 'configured',
    output: response.output_text || localFallback(prompt),
  }
}

async function runAnthropic(prompt: string, model: string): Promise<ProviderResult> {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) {
    return { provider: 'anthropic', model: 'local-fallback', health: 'fallback', output: localFallback(prompt) }
  }

  const client = new Anthropic({ apiKey: key })
  const response = await client.messages.create({
    model,
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content
    .map((chunk) => ('text' in chunk ? chunk.text : ''))
    .join('')
    .trim()

  return { provider: 'anthropic', model, health: 'configured', output: text || localFallback(prompt) }
}

async function runGemini(prompt: string, model: string): Promise<ProviderResult> {
  const key = process.env.GEMINI_API_KEY
  if (!key) {
    return { provider: 'gemini', model: 'local-fallback', health: 'fallback', output: localFallback(prompt) }
  }

  const client = new GoogleGenAI({ apiKey: key })
  const response = await client.models.generateContent({
    model,
    contents: prompt,
  })

  return { provider: 'gemini', model, health: 'configured', output: response.text?.trim() || localFallback(prompt) }
}

export function getProviderHealth() {
  return {
    openai: Boolean(process.env.OPENAI_API_KEY),
    anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
    gemini: Boolean(process.env.GEMINI_API_KEY),
    local: true,
  }
}

export async function runProvider(prompt: string, provider: AIProvider): Promise<ProviderResult> {
  const config = getProviderConfig()
  if (provider === 'openai') return runOpenAI(prompt, config.models.openai)
  if (provider === 'anthropic') return runAnthropic(prompt, config.models.anthropic)
  if (provider === 'gemini') return runGemini(prompt, config.models.gemini)
  return { provider: 'local', model: 'local-fallback', health: 'configured', output: localFallback(prompt) }
}
