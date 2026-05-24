import type { IncomingMessage, ServerResponse } from 'node:http'
import { bootstrapDatabase } from '../server/bootstrap'
import { createApiApp } from '../server/app'

let bootPromise: Promise<void> | null = null

function ensureBootstrap() {
  if (!bootPromise) {
    bootPromise = bootstrapDatabase()
  }
  return bootPromise
}

const app = createApiApp()

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await ensureBootstrap()
  return app(req as never, res as never)
}

