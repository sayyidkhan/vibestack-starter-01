import { expect, test } from '@playwright/test'

test('security headers are present on health endpoint', async ({ request }) => {
  const apiPort = process.env.API_PORT || '8788'
  const res = await request.get(`http://127.0.0.1:${apiPort}/api/health`)
  expect(res.status()).toBe(200)
  expect(res.headers()['x-content-type-options']).toBe('nosniff')
  expect(res.headers()['x-frame-options']).toBe('DENY')
  expect(res.headers()['referrer-policy']).toBe('no-referrer')
})

test('csrf is required for unsafe endpoints', async ({ request }) => {
  const apiPort = process.env.API_PORT || '8788'
  const endpoint = `http://127.0.0.1:${apiPort}/api/auth/login`
  let res: Awaited<ReturnType<typeof request.post>> | null = null

  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      res = await request.post(endpoint, {
        data: { email: 'user@vibestack.dev', password: 'user12345' },
      })
      break
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250))
    }
  }

  if (!res) throw new Error(`API not reachable at ${endpoint}`)

  expect(res.status()).toBe(403)
  const body = await res.json()
  expect(body.error).toContain('csrf')
})

test('unsafe auth request succeeds with valid csrf token', async ({ request }) => {
  const apiPort = process.env.API_PORT || '8788'
  const baseUrl = `http://127.0.0.1:${apiPort}`

  const csrfResponse = await request.get(`${baseUrl}/api/csrf`)
  expect(csrfResponse.status()).toBe(200)
  const csrfBody = (await csrfResponse.json()) as { csrfToken: string }
  const csrfToken = csrfBody.csrfToken
  expect(csrfToken.length).toBeGreaterThan(10)

  const email = `csrf_${Date.now()}_${Math.floor(Math.random() * 10000)}@vibestack.dev`
  const signupResponse = await request.post(`${baseUrl}/api/auth/signup`, {
    headers: { 'x-csrf-token': csrfToken },
    data: { name: 'CSRF User', email, password: 'user12345' },
  })

  expect(signupResponse.status()).toBe(201)
  const payload = (await signupResponse.json()) as { user: { email: string } }
  expect(payload.user.email).toBe(email)
})
