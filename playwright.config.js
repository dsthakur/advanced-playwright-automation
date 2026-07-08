const { defineConfig, devices } = require('@playwright/test');
const { baseConfig, isCI } = require('./playwright.base.config');
const { defineBddConfig } = require('playwright-bdd');

const bddTestDir = defineBddConfig({
  features: 'features/*.feature',
  steps: 'steps/*.steps.js',
});

// Real, public e-commerce demo built by Sauce Labs specifically for automation practice.
const ENVIRONMENTS = {
  local: 'https://www.saucedemo.com',
  staging: 'https://www.saucedemo.com',
  prod: 'https://www.saucedemo.com',
};

const ENV = process.env.ENV || 'local';
const baseURL = ENVIRONMENTS[ENV];

module.exports = defineConfig({
  ...baseConfig,

  testDir: './tests',

  // Reporter chain — extending base reporters with allure and CI blob reporter
  reporter: [
    ...baseConfig.reporter,
    ['allure-playwright', { resultsDir: 'my-allure-results' }],
    ...(isCI ? [['blob']] : []),
  ],

  use: {
    ...baseConfig.use,
    baseURL,
  },

  projects: [
    // Runs first whenever a project depends on it. Logs in once, saves the session.
    {
      name: 'setup',
      testDir: './tests/setup',
      testMatch: /.*\.setup\.js/,
    },

    {
      name: 'smoke',
      testDir: bddTestDir,
      use: { ...devices['Desktop Chrome'] },
      // smoke intentionally does NOT depend on setup — it tests login itself,
      // including the locked_out_user negative case, so it needs to start logged OUT.
    },

    {
      name: 'regression-chromium',
      testDir: './tests/regression',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/standard_user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'regression-firefox',
      testDir: './tests/regression',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/standard_user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'regression-webkit',
      testDir: './tests/regression',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/standard_user.json',
      },
      dependencies: ['setup'],
    },

    // Different role, different storageState file — this project starts
    // pre-authenticated as problem_user instead of standard_user.
    {
      name: 'visual-checks',
      testDir: './tests/visual',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/problem_user.json',
      },
      dependencies: ['setup'],
    },

    // Dedicated project for learning fixture concepts —
    // needs access to saucedemo.com with standard_user session
    {
      name: 'fixtures-demo',
      testDir: './tests/fixtures_demo',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/standard_user.json',
      },
      dependencies: ['setup'],
    },

    // Network interception, mocking, and API testing demos
    {
      name: 'network-tests',
      testDir: './tests/network',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/standard_user.json',
      },
      dependencies: ['setup'],
    },

    // Authentication patterns at scale
    {
      name: 'auth-tests',
      testDir: './tests/auth',
      use: {
        ...devices['Desktop Chrome'],
      },
      dependencies: ['setup'],
    },

    // Parallelism, sharding and retries
    {
      name: 'sharding-tests',
      testDir: './tests/sharding',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/standard_user.json',
      },
      dependencies: ['setup'],
    },
  ],
});