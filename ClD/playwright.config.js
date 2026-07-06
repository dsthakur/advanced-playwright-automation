const { defineConfig, devices } = require('@playwright/test');
 
// Real, public e-commerce demo built by Sauce Labs specifically for automation practice.
const ENVIRONMENTS = {
  local: 'https://www.saucedemo.com',
  staging: 'https://www.saucedemo.com',
  prod: 'https://www.saucedemo.com',
};
 
const ENV = process.env.ENV || 'local';
const baseURL = ENVIRONMENTS[ENV];
 
// GitHub Actions, GitLab CI, and most other CI providers automatically set
// process.env.CI = 'true'. We don't have to set this ourselves — Playwright
// and almost every CI platform already agree on this convention.
const isCI = !!process.env.CI;
 
module.exports = defineConfig({
  testDir: './tests',
 
  use: {
    baseURL,
 
    // LOCAL: 'on-first-retry' — you're watching with --headed anyway, so only
    // capture a trace if a test actually fails and gets retried. Keeps disk light.
    // CI: same on-first-retry, but CI runs headless, so this trace is often the
    // ONLY evidence you'll have for a failure — this is non-negotiable in CI.
    trace: 'on-first-retry',
 
    // LOCAL: off — a screenshot of every passing test is pure noise, you're
    // already looking at the browser window yourself.
    // CI: only-on-failure — exactly one image per failing test, cheap and useful.
    screenshot: isCI ? 'only-on-failure' : 'off',
 
    // LOCAL: off — video recording slightly slows every test and the files
    // are large; not worth it when you can watch headed mode live.
    // CI: retain-on-failure — keeps the recording ONLY for failed tests,
    // deletes it for passing ones. Full video > trace for some teams when
    // debugging timing-sensitive UI glitches.
    video: isCI ? 'retain-on-failure' : 'off',
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
      testDir: './tests/smoke',
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
      name: 'visual',
      testDir: './tests/visual',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/problem_user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
 