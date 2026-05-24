import type { HttpResult } from '../runtime/http'
import { listFeatureFlags } from '../services/feature-flags.service'

export async function listFeatureFlagsHandler(): Promise<HttpResult> {
  return { status: 200, body: await listFeatureFlags() }
}
