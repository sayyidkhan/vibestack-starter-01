const DEFAULT_BLOCK_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /reveal\s+(your\s+)?system\s+prompt/i,
  /(show|print|dump)\s+.*(api\s*key|secret|password|token)/i,
  /\b(begin|end)\s+(rsa|dsa|ec)\s+private\s+key\b/i,
]

const REDACTION_PATTERNS = [
  /(sk-[a-z0-9]{20,})/gi,
  /(AKIA[0-9A-Z]{16})/g,
  /(-----BEGIN [A-Z ]+PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+PRIVATE KEY-----)/g,
]

type ModerationCategory = 'violence' | 'self_harm' | 'hate' | 'sexual' | 'minors'

const CATEGORY_PATTERNS: Record<ModerationCategory, RegExp[]> = {
  violence: [/\b(kill|bomb|shoot|stab|explosive)\b/i],
  self_harm: [/\b(suicide|self[- ]?harm|kill myself)\b/i],
  hate: [/\b(genocide|ethnic cleansing|hate [a-z]+ people)\b/i],
  sexual: [/\b(explicit sex|sexual content|porn)\b/i],
  minors: [/\b(child sexual|minor sexual|underage sexual)\b/i],
}

function getEnv(name: string) {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
  return env?.[name]
}

export type PromptGuardrailResult =
  | { ok: true; value: string }
  | { ok: false; reason: string; category: 'injection' | ModerationCategory }

function parseCustomPatterns(raw: string | undefined) {
  if (!raw) return []
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((pattern) => new RegExp(pattern, 'i'))
}

function sanitizePrompt(prompt: string) {
  let next = prompt
  for (const pattern of REDACTION_PATTERNS) {
    next = next.replace(pattern, '[REDACTED]')
  }
  return next
}

function parseModerationCategories(raw: string | undefined) {
  const allCategories = Object.keys(CATEGORY_PATTERNS) as ModerationCategory[]
  if (!raw) return allCategories
  const parsed = raw
    .split(',')
    .map((value) => value.trim())
    .filter((value): value is ModerationCategory => allCategories.includes(value as ModerationCategory))
  return parsed.length ? parsed : allCategories
}

export function getModerationProfile() {
  const enabled = String(getEnv('AI_MODERATION_ENABLED') || 'true') !== 'false'
  const blockedCategories = parseModerationCategories(getEnv('AI_MODERATION_BLOCK_CATEGORIES'))
  return { enabled, blockedCategories }
}

export function enforcePromptGuardrails(prompt: string): PromptGuardrailResult {
  const enabled = String(getEnv('AI_GUARDRAILS_ENABLED') || 'true') !== 'false'
  const sanitized = sanitizePrompt(prompt)
  if (!enabled) return { ok: true, value: sanitized }

  const customPatterns = parseCustomPatterns(getEnv('AI_BLOCK_PATTERNS'))
  const patterns = [...DEFAULT_BLOCK_PATTERNS, ...customPatterns]

  for (const pattern of patterns) {
    if (pattern.test(sanitized)) {
      return { ok: false, reason: 'Prompt blocked by safety policy', category: 'injection' }
    }
  }

  const moderation = getModerationProfile()
  if (moderation.enabled) {
    for (const category of moderation.blockedCategories) {
      for (const pattern of CATEGORY_PATTERNS[category]) {
        if (pattern.test(sanitized)) {
          return { ok: false, reason: `Prompt blocked by ${category} policy`, category }
        }
      }
    }
  }

  return { ok: true, value: sanitized }
}
