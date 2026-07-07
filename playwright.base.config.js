const { devices } = require('@playwright/test');

const isCI = !!process.env.CI;

const baseConfig = {
  // Global test execution timeout: 30 seconds
  timeout: 30 * 1000,

  // Assertion timeout: 5 seconds
  expect: {
    timeout: 5 * 1000,
  },

  // CI safety net for infra hiccups
  retries: isCI ? 2 : 0,

  // Control worker threads relative to Environment
  workers: isCI ? 4 : 2,

  // Default execution inside file is serial, files run in parallel
  fullyParallel: false,

  // Default reporter setup
  reporter: [
    ['list'],
    ['html', { open: isCI ? 'never' : 'on-failure' }],
  ],

  use: {
    // Action and navigation timeouts: 10 seconds
    actionTimeout: 10 * 1000,
    navigationTimeout: 10 * 1000,

    // Diagnostics, screenshots, and videos configurations
    trace: 'on-first-retry',
    screenshot: isCI ? 'only-on-failure' : 'off',
    video: isCI ? 'retain-on-failure' : 'off',
  },
};

module.exports = {
  baseConfig,
  isCI,
};
