import { afterEach, describe, expect, it, vi } from 'vitest'
import { notifyPolicyEvent } from '../../server/ai/policy'

function setEnv(name: string, value: string | undefined) {
  const g = globalThis as { process?: { env?: Record<string, string | undefined> } }
  if (!g.process) g.process = { env: {} }
  if (!g.process.env) g.process.env = {}
  if (value === undefined) delete g.process.env[name]
  else g.process.env[name] = value
}

function getEnv(name: string) {
  const g = globalThis as { process?: { env?: Record<string, string | undefined> } }
  return g.process?.env?.[name]
}

describe('ai policy webhook', () => {
  const prevUrl = getEnv('AI_POLICY_WEBHOOK_URL')
  const prevTimeout = getEnv('AI_POLICY_WEBHOOK_TIMEOUT_MS')
  const originalFetch = globalThis.fetch

  afterEach(() => {
    setEnv('AI_POLICY_WEBHOOK_URL', prevUrl)
    setEnv('AI_POLICY_WEBHOOK_TIMEOUT_MS', prevTimeout)
    globalThis.fetch = originalFetch
  })

  it('does nothing when webhook url is not configured', async () => {
    setEnv('AI_POLICY_WEBHOOK_URL', undefined)
    const fetchSpy = vi.fn()
    globalThis.fetch = fetchSpy as unknown as typeof fetch
    await notifyPolicyEvent({
      type: 'ai_prompt_blocked',
      userId: 'u1',
      reason: 'blocked',
      at: new Date().toISOString(),
    })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('posts policy event when webhook url is configured', async () => {
    setEnv('AI_POLICY_WEBHOOK_URL', 'http://example.com/webhook')
    setEnv('AI_POLICY_WEBHOOK_TIMEOUT_MS', '2000')
    const fetchSpy = vi.fn().mockResolvedValue({ ok: true })
    globalThis.fetch = fetchSpy as unknown as typeof fetch

    await notifyPolicyEvent({
      type: 'ai_provider_blocked',
      userId: 'u2',
      reason: 'provider blocked',
      metadata: { provider: 'openai' },
      at: new Date().toISOString(),
    })

    expect(fetchSpy).toHaveBeenCalledTimes(1)
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('http://example.com/webhook')
    expect(init.method).toBe('POST')
    expect(String(init.body)).toContain('ai_provider_blocked')
  })
})
