const { test: base, expect } = require('@playwright/test');

const withEnhancedPage = base.extend({
  page: async ({ page }, use, testInfo) => {
    const consoleMessages = [];
    const networkFailures = [];

    page.on('console', msg => {
      consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
    });

    page.on('requestfailed', request => {
      networkFailures.push(`FAILED: ${request.method()} ${request.url()} — ${request.failure().errorText}`);
    });

    page.on('framenavigated', frame => {
      if (frame === page.mainFrame()) {
        console.log(`  → navigated to: ${frame.url()}`);
      }
    });

    await use(page);

    if (consoleMessages.length > 0) {
      await testInfo.attach('console-log', {
        body: consoleMessages.join('\n'),
        contentType: 'text/plain',
      });
    }

    if (networkFailures.length > 0) {
      await testInfo.attach('network-failures', {
        body: networkFailures.join('\n'),
        contentType: 'text/plain',
      });
    }
  },
});

module.exports = { withEnhancedPage, expect };