const { defineConfig, devices } = require('@playwright/test');
const { baseConfig } = require('./playwright.base.config');

module.exports = defineConfig({
  ...baseConfig,

  testDir: './tests/parallel-demo',

  use: {
    ...baseConfig.use,
    baseURL: 'http://localhost:3000',
  },

  webServer: {
    command: 'node server.js',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
    reporter:[
    ['list'],
    ['html',{outputFolder:'playwright-report', open: 'never'}],
    ['junit',{outputFile:'junit.xml'}]
  ],

  // ======================================================
  // FLIP THIS LINE to see pass vs fail:
  //   false → tests run in order  → PASS
  //   true  → tests run together  → FAIL
  // ======================================================
  fullyParallel: true,

  workers: 2,

  projects: [
    {
      name: 'parallel-demo',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});