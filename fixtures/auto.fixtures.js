const { test: base, expect } = require('@playwright/test');

const withAutoFixtures = base.extend({
  // Attach browser console errors to the test output for easier debugging.
  consoleLogger: [async ({ page }, use, testInfo) => {
    const errors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(`[${msg.type()}] ${msg.text()}`);
      }
    });

    page.on('pageerror', err => {
      errors.push(`[pageerror] ${err.message}`);
    });

    await use();

    if (errors.length > 0) {
      await testInfo.attach('browser-console-errors', {
        body: errors.join('\n'),
        contentType: 'text/plain',
      });
      console.log(`  Console errors captured (${errors.length}):\n  ${errors.join('\n  ')}`);
    } else {
      console.log('  No console errors detected');
    }
  }, { auto: true }],

  // Record how long each test takes and attach the timing information to the report.
  testTimer: [async ({}, use, testInfo) => {
    const startTime = Date.now();
    console.log(`  Test starting: "${testInfo.title}"`);

    await use();

    const duration = Date.now() - startTime;
    console.log(`  Test finished in ${duration}ms`);

    await testInfo.attach('test-timing', {
      body: `Test: ${testInfo.title}\nDuration: ${duration}ms\nStatus: ${testInfo.status}`,
      contentType: 'text/plain',
    });
  }, { auto: true }],

  // Capture a screenshot when a test fails so the report contains visual context.
  screenshotOnFailure: [async ({ page }, use, testInfo) => {
    await use();

    if (testInfo.status === 'failed') {
      const screenshotPath = testInfo.outputPath('failure-screenshot.png');
      await page.screenshot({ path: screenshotPath, fullPage: true });

      await testInfo.attach('failure-screenshot', {
        path: screenshotPath,
        contentType: 'image/png',
      });

      console.log(`  Screenshot taken for failed test: ${testInfo.title}`);
    }
  }, { auto: true }],
});

module.exports = { withAutoFixtures, expect };