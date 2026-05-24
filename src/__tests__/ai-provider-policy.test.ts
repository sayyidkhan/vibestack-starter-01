import { afterEach, describe, expect, it } from 'vitest'
import { getProviderConfig, isProviderAllowed } from '../../server/ai/provider'

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

describe('ai provider policy', () => {
  const prevAllowed = getEnv('AI_ALLOWED_PROVIDERS')
  const prevDefault = getEnv('AI_PROVIDER')

  afterEach(() => {
    setEnv('AI_ALLOWED_PROVIDERS', prevAllowed)
    setEnv('AI_PROVIDER', prevDefault)
  })

  it('uses first allowed provider if configured default is blocked', () => {
    setEnv('AI_ALLOWED_PROVIDERS', 'local,gemini')
    setEnv('AI_PROVIDER', 'openai')
    const config = getProviderConfig()
    expect(config.defaultProvider).toBe('local')
    expect(config.allowedProviders).toEqual(['local', 'gemini'])
  })

  it('marks provider allow-list correctly', () => {
    setEnv('AI_ALLOWED_PROVIDERS', 'openai')
    setEnv('AI_PROVIDER', 'openai')
    const config = getProviderConfig()
    expect(isProviderAllowed('openai', config)).toBe(true)
    expect(isProviderAllowed('local', config)).toBe(false)
  })
})
