import serverModule from '../server-dist/app.cjs'

const { createApiApp, ensureApiBootstrapped } = serverModule
const app = createApiApp()

export default async function handler(req, res) {
  await ensureApiBootstrapped()
  return app(req, res)
}

