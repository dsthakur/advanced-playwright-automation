const { test: base, expect } = require('@playwright/test');

const withAuth = base.extend({
  // Log in once per worker and reuse the resulting browser state for all tests on that worker.
  authToken: [async ({ browser }, use) => {
    console.log('  Worker logging in — will be shared across all tests on this worker');

    const context = await browser.newContext();
    const loginPage = await context.newPage();

    await loginPage.goto('https://www.saucedemo.com');
    await loginPage.locator('#user-name').fill('standard_user');
    await loginPage.locator('#password').fill('secret_sauce');
    await loginPage.getByRole('button', { name: 'Login' }).click();
    await expect(loginPage).toHaveURL(/.*inventory\.html/);

    const storageState = await context.storageState();
    await context.close();

    console.log('  Worker login complete — session captured');

    await use(storageState);

    console.log('  Worker shutting down — session released');
  }, { scope: 'worker' }],

  // Create a fresh test page that starts from the shared authenticated state.
  authenticatedPage: async ({ browser, authToken }, use) => {
    const context = await browser.newContext({ storageState: authToken });
    const page = await context.newPage();

    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('.inventory_item')).toHaveCount(6);

    await use(page);

    await context.close();
  },
});

module.exports = { withAuth, expect };