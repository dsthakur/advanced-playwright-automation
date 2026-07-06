const { defineConfig, devices } = require('@playwright/test');
//npx playwright test --config=playwright.local.config.js --headed     
// This config is for testing against our OWN local server (server.js).
const isCI = !!process.env.CI;

module.exports = defineConfig({
  testDir: './tests/local',

  use: {
    // This matches the PORT in server.js — all tests use page.goto('/products')
    // and Playwright prepends this automatically via baseURL.
    baseURL: 'http://localhost:3000',

    trace: 'on-first-retry',
    screenshot: isCI ? 'only-on-failure' : 'off',
    video: isCI ? 'retain-on-failure' : 'off',
  },

  webServer: {
    // The command to start your server.
    command: 'node server.js',

    // The URL Playwright polls until it gets a 200 response.
    // Only after this succeeds will any test start running.
    // This is critical — without it, tests would start before the server
    // is ready and immediately fail with "connection refused".
    url: 'http://localhost:3000',

    // LOCAL: true — if you already have `node server.js` running in another
    // terminal (which you will during active development), don't start another
    // one. Just use the existing one.
    // CI: false (default) — CI always starts fresh, so always launch it.
    reuseExistingServer: !isCI,

    // Optional: if the server takes more than 10 seconds to start, fail fast.
    // Useful for catching a broken build before tests even begin.
    timeout: 10 * 1000,

    // Optional: if you want to see the server's console.log output
    // in your terminal alongside test output, set this to true.
    stdout: 'pipe',
    stderr: 'pipe',
  },

  projects: [
    {
      name: 'local-chrome',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});