type PolicyEventType = 'ai_prompt_blocked' | 'ai_provider_blocked'

type PolicyEventPayload = {
  type: PolicyEventType
  userId: string
  reason: string
  metadata?: Record<string, unknown>
  at: string
}

function getEnv(name: string) {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
  return env?.[name]
}

export async function notifyPolicyEvent(payload: PolicyEventPayload) {
  const url = getEnv('AI_POLICY_WEBHOOK_URL')
  if (!url) return

  const timeoutMsRaw = Number(getEnv('AI_POLICY_WEBHOOK_TIMEOUT_MS') || 1500)
  const timeoutMs = Number.isFinite(timeoutMsRaw) && timeoutMsRaw > 100 ? timeoutMsRaw : 1500
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
  } catch {
    // Intentionally swallow webhook errors to avoid impacting user flow.
  } finally {
    clearTimeout(timer)
  }
}
