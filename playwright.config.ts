import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: './tests',

  // Run all tests in parallel.
  fullyParallel: true,

  timeout: 45000,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Retry on CI only.
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,

  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: 'http://localhost:61000',

    // Collect trace when retrying the failed test.
    trace: 'on-first-retry',
  },
  // Configure projects for major browsers.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop firefox'] },
    },
  ],
  // Run your local dev server before starting the tests.
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:61000',
    reuseExistingServer: !process.env.CI,
  },
});
