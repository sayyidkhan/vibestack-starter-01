import { defineConfig, devices } from '@playwright/test'

const port = 4173
const apiPort = 8788

export default defineConfig({
  testDir: './tests',
  use: { baseURL: `http://127.0.0.1:${port}` },
  webServer: {
    command:
      `APP_URL=http://127.0.0.1:${port} API_PORT=${apiPort} VITE_API_URL=http://127.0.0.1:${apiPort} AUTH_RATE_LIMIT_MAX=1000 AI_RATE_LIMIT_MAX=1000 concurrently "npm run api:dev" "npm run dev -- --host 127.0.0.1 --port ${port}"`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    timeout: 120000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
