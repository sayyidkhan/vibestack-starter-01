import type { HttpResult } from '../runtime/http'
import { getDashboardData } from '../services/dashboard.service'

export async function getDashboardHandler(): Promise<HttpResult> {
  return { status: 200, body: await getDashboardData() }
}
