import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // Sequential execution to avoid side effects on the shared backend simulator state
  fullyParallel: false, 
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
