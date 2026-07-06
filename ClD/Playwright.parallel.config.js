const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/parallel-demo',

  use: {
    baseURL: 'http://localhost:3000',
  },
//npx playwright test --config=playwright.parallel.config.js --reporter=list
  // ---- STEP 3: workers ----
  // How many tests can physically run at the same time.
  // Default is: 50% of your CPU cores (so 4 cores = 2 workers).
  // Set to 1 to force everything to run sequentially — useful to understand
  // the DEFAULT behavior before adding parallelism.
  workers: 2,

  // fullyParallel: true — NOW every individual test is eligible to run in parallel.
  // With workers: 2, Playwright can pick ANY 2 tests from EITHER file at any moment.
  // Tests no longer wait for their file-siblings to finish first.
  fullyParallel: false,

  projects: [
    {
      name: 'parallel-demo',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});