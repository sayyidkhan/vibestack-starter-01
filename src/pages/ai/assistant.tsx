import { useEffect, useMemo, useState } from 'react'
import { AIAssistantSkeleton, EmptyState, ErrorState } from '../../components/shared/States'
import { Button, Card, SectionHeader, Select, Textarea } from '../../components/ui/primitives'
import { useToast } from '../../context/toast'
import { api, type AIProviderInfo, type FeatureFlag } from '../../lib/api'

type ChatMessage = { id: string; prompt: string; response: string; provider: string; createdAt: string }
type Provider = 'openai' | 'anthropic' | 'gemini' | 'local'

export function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[] | null>(null)
  const [flags, setFlags] = useState<FeatureFlag[] | null>(null)
  const [providerInfo, setProviderInfo] = useState<AIProviderInfo | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [provider, setProvider] = useState<Provider>('openai')
  const [prompt, setPrompt] = useState('Plan this week for maximum leverage')
  const { pushToast } = useToast()

  const promptTemplates = [
    {
      id: 'operator-week',
      title: 'Operator Weekly Plan',
      prompt: 'Plan this week for maximum leverage as a solo founder moving from builder to operator.',
    },
    {
      id: 'idea-stress-test',
      title: 'Idea Stress Test',
      prompt: 'Stress test this idea: [insert idea]. Give assumptions, risks, and a 7-day validation sprint.',
    },
    {
      id: 'distribution-plan',
      title: 'Distribution First',
      prompt: 'Create a distribution-first launch plan with channels, content cadence, and measurable leading indicators.',
    },
    {
      id: 'pricing',
      title: 'Pricing Draft',
      prompt: 'Propose pricing tiers for an AI SaaS tool with value metrics, upgrade triggers, and churn guardrails.',
    },
  ] as const

  useEffect(() => {
    Promise.all([api.listAIMessages(), api.listFeatureFlags(), api.getAIProviders()])
      .then(([messagesResult, flagsResult, providerResult]) => {
        setMessages(messagesResult)
        setFlags(flagsResult)
        setProviderInfo(providerResult)
        setProvider(providerResult.defaultProvider)
      })
      .catch(() => setError('Unable to load AI history'))
  }, [])

  const aiEnabled = useMemo(
    () => flags?.find((flag) => flag.key === 'AI_ASSISTANT')?.enabled ?? false,
    [flags],
  )

  if (error) return <ErrorState message={error} />
  if (!messages || !flags || !providerInfo) return <AIAssistantSkeleton />

  if (!aiEnabled) {
    return <EmptyState title="AI Assistant Disabled" description="Enable AI_ASSISTANT in admin feature flags." />
  }
  const allowedProviderMap = new Map(providerInfo.providers.map((entry) => [entry.key, entry.allowed]))
  const providerAllowed = allowedProviderMap.get(provider) ?? true
  const promptTooLong = prompt.trim().length > providerInfo.promptMaxChars

  return (
    <Card>
      <SectionHeader title="AI Assistant" eyebrow="AI Module" />
      <p className="muted">Provider-adapter routing with persisted history from `ai_messages`.</p>
      <div className="row" style={{ marginTop: '.7rem' }}>
        <label>
          Provider
          <Select value={provider} onChange={(event) => setProvider(event.target.value as Provider)}>
            <option value="openai" disabled={!allowedProviderMap.get('openai')}>OpenAI</option>
            <option value="anthropic" disabled={!allowedProviderMap.get('anthropic')}>Claude</option>
            <option value="gemini" disabled={!allowedProviderMap.get('gemini')}>Gemini</option>
            <option value="local" disabled={!allowedProviderMap.get('local')}>Local Fallback</option>
          </Select>
        </label>
      </div>
      <p className="muted" style={{ marginTop: '.5rem' }}>
        Prompt limit: {providerInfo.promptMaxChars} chars. Active model:{' '}
        {provider === 'local' ? 'local-fallback' : providerInfo.models[provider]}.
      </p>
      <p className="muted">
        Provider status:{' '}
        {providerInfo.providers
          .map((p) => `${p.key}:${p.allowed ? 'allowed' : 'blocked'}:${p.configured ? 'configured' : 'fallback'}`)
          .join(' · ')}
      </p>
      <p className="muted">
        Moderation: {providerInfo.moderation.enabled ? 'enabled' : 'disabled'} · Blocked categories:{' '}
        {providerInfo.moderation.blockedCategories.join(', ')}
      </p>
      <div className="chat">
        <div className="template-grid">
          {promptTemplates.map((template) => (
            <button
              key={template.id}
              className="template-btn"
              type="button"
              onClick={() => setPrompt(template.prompt)}
            >
              <strong>{template.title}</strong>
              <span>{template.prompt}</span>
            </button>
          ))}
        </div>
        <label>
          Prompt
          <Textarea
            rows={4}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Describe the task you want the assistant to handle."
          />
        </label>
        <p className="muted">
          {prompt.trim().length}/{providerInfo.promptMaxChars} characters
        </p>
        <Button
          disabled={busy || !prompt.trim() || promptTooLong || !providerAllowed}
          onClick={async () => {
            setBusy(true)
            try {
              const result = await api.sendAIPrompt(prompt.trim(), provider)
              setMessages((prev) => (prev ? [result, ...prev] : [result]))
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Prompt blocked or failed. Adjust wording and try again.'
              pushToast(message)
            } finally {
              setBusy(false)
            }
          }}
        >
          {busy ? 'Generating...' : 'Run Prompt'}
        </Button>
        {messages.length === 0 && <div className="bubble">No messages yet.</div>}
        {messages.map((message) => (
          <div key={message.id}>
            <div className="bubble">{message.prompt}</div>
            <div className="bubble ai">{message.response}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}
