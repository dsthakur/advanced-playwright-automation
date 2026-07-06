const { defineConfig, devices } = require('@playwright/test');
//kill node
//taskkill /F /IM node.exe   
module.exports = defineConfig({
  testDir: './tests/parallel_proof',

  use: {
    baseURL: 'http://localhost:3002',
  },
  webServer: {
   command: 'node server2.js',
   url: 'http://localhost:3002/products',
   reuseExistingServer: true,
   timeout: 10000
 },

   reporter:[
    ['list'],
    ['html',{outputFolder:'playwright-report', open: 'on-failure'}],
    ['junit',{outputFile:'junit.xml'}]
  ],
//npx playwright test --config=playwright.parallel.config.js --reporter=list
  // ---- STEP 3: workers ----
  // How many tests can physically run at the same time.
  // Default is: 50% of your CPU cores (so 4 cores = 2 workers).
  // Set to 1 to force everything to run sequentially — useful to understand
  // the DEFAULT behavior before adding parallelism.
  workers: 3,

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