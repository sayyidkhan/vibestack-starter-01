import type { HttpResult } from '../runtime/http'
import { getAIProviderMetadata, listUserAIMessages, processAIMessage } from '../services/ai.service'

type SessionUserLike = { userId: string }

export async function listAIMessagesHandler(input: { user: SessionUserLike }): Promise<HttpResult> {
  const messages = await listUserAIMessages(input.user.userId)
  return { status: 200, body: messages }
}

export async function getAIProvidersHandler(): Promise<HttpResult> {
  return { status: 200, body: getAIProviderMetadata() }
}

export type CreateAIMessageHandlerResult = {
  http: HttpResult
  audit?: { action: 'ai_prompt' | 'ai_prompt_blocked' | 'ai_provider_blocked'; metadata: Record<string, unknown>; resourceId?: string }
  policy?: {
    type: 'ai_prompt_blocked' | 'ai_provider_blocked'
    reason: string
    metadata: Record<string, unknown>
  }
}

export async function createAIMessageHandler(input: {
  user: SessionUserLike
  body: { prompt?: unknown; provider?: unknown }
}): Promise<CreateAIMessageHandlerResult> {
  const result = await processAIMessage({
    userId: input.user.userId,
    prompt: String(input.body?.prompt || ''),
    providerRaw: String(input.body?.provider || ''),
  })

  if (!result.ok) {
    return {
      http: { status: 400, body: { error: result.error } },
      audit: { action: result.auditAction, metadata: result.auditMetadata },
      policy: {
        type: result.policyEvent.type,
        reason: result.policyEvent.reason,
        metadata: result.policyEvent.metadata,
      },
    }
  }

  return {
    http: { status: 201, body: result.record },
    audit: {
      action: 'ai_prompt',
      resourceId: result.record.id,
      metadata: result.auditMetadata,
    },
  }
}
