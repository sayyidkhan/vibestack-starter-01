import { randomUUID } from 'node:crypto'
import { desc, eq } from 'drizzle-orm'
import { aiMessages } from '../../db/schema'
import { enforcePromptGuardrails, getModerationProfile } from '../ai/guardrails'
import { getProviderConfig, getProviderHealth, isProviderAllowed, normalizePrompt, runProvider, type AIProvider } from '../ai/provider'
import { db } from '../db'

export function getAIProviderMetadata() {
  const config = getProviderConfig()
  const health = getProviderHealth()
  const moderation = getModerationProfile()

  return {
    defaultProvider: config.defaultProvider,
    promptMaxChars: config.promptMaxChars,
    models: config.models,
    moderation,
    providers: [
      { key: 'openai' as const, configured: health.openai, allowed: config.allowedProviders.includes('openai') },
      { key: 'anthropic' as const, configured: health.anthropic, allowed: config.allowedProviders.includes('anthropic') },
      { key: 'gemini' as const, configured: health.gemini, allowed: config.allowedProviders.includes('gemini') },
      { key: 'local' as const, configured: health.local, allowed: config.allowedProviders.includes('local') },
    ],
  }
}

export async function listUserAIMessages(userId: string) {
  return db
    .select()
    .from(aiMessages)
    .where(eq(aiMessages.userId, userId))
    .orderBy(desc(aiMessages.createdAt))
}

type AIMessageResult =
  | {
      ok: false
      error: string
      auditAction: 'ai_prompt_blocked' | 'ai_provider_blocked'
      auditMetadata: Record<string, unknown>
      policyEvent: {
        type: 'ai_prompt_blocked' | 'ai_provider_blocked'
        reason: string
        metadata: Record<string, unknown>
      }
    }
  | {
      ok: true
      record: {
        id: string
        userId: string
        provider: AIProvider
        prompt: string
        response: string
      }
      auditMetadata: Record<string, unknown>
    }

export async function processAIMessage(input: {
  userId: string
  prompt: string
  providerRaw: string
}): Promise<AIMessageResult> {
  const config = getProviderConfig()
  const normalized = normalizePrompt(input.prompt, config.promptMaxChars)
  if (!normalized.ok) {
    return {
      ok: false,
      error: normalized.error,
      auditAction: 'ai_prompt_blocked',
      auditMetadata: { reason: normalized.error, category: 'validation' },
      policyEvent: {
        type: 'ai_prompt_blocked',
        reason: normalized.error,
        metadata: { category: 'validation' },
      },
    }
  }

  const guarded = enforcePromptGuardrails(normalized.value)
  if (!guarded.ok) {
    return {
      ok: false,
      error: guarded.reason,
      auditAction: 'ai_prompt_blocked',
      auditMetadata: { reason: guarded.reason, category: guarded.category },
      policyEvent: {
        type: 'ai_prompt_blocked',
        reason: guarded.reason,
        metadata: { category: guarded.category },
      },
    }
  }

  const provider: AIProvider =
    input.providerRaw === 'openai' ||
    input.providerRaw === 'anthropic' ||
    input.providerRaw === 'gemini' ||
    input.providerRaw === 'local'
      ? input.providerRaw
      : config.defaultProvider

  if (!isProviderAllowed(provider, config)) {
    const reason = `${provider} provider is disabled by policy`
    return {
      ok: false,
      error: reason,
      auditAction: 'ai_provider_blocked',
      auditMetadata: { provider },
      policyEvent: {
        type: 'ai_provider_blocked',
        reason,
        metadata: { provider },
      },
    }
  }

  const generated = await runProvider(guarded.value, provider)
  const response = `[${provider}:${generated.model}] ${generated.output}`
  const record = { id: randomUUID(), userId: input.userId, provider, prompt: guarded.value, response }
  await db.insert(aiMessages).values(record)

  return {
    ok: true,
    record,
    auditMetadata: { provider, model: generated.model, health: generated.health },
  }
}
