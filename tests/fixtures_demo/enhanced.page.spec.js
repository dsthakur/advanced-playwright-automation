const { withEnhancedPage, expect } = require('../../fixtures/enhanced-page.fixtures');

// ================================================================
// KEY THING TO NOTICE:
// These tests look COMPLETELY NORMAL — they just use { page }.
// They have zero knowledge that `page` has been overridden.
// Yet console capture, network failure tracking, and navigation
// logging all happen automatically behind the scenes.
// ================================================================

withEnhancedPage('login flow — page fixture is secretly enhanced', async ({ page }) => {
  // This test just uses `page` normally.
  // But our overridden fixture is silently:
  //   - Logging every console message
  //   - Tracking every failed network request
  //   - Printing every navigation to the terminal

  await page.goto('https://www.saucedemo.com');

  // ID locators — stable input identifiers
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');

  // Role locator — accessible button name
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/.*inventory\.html/);
  await expect(page.locator('.inventory_item')).toHaveCount(6);
});

withEnhancedPage('product page — navigation is automatically logged', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // Click the first product — triggers another navigation
  await page.locator('.inventory_item_name').first().click();
  await expect(page).toHaveURL(/.*inventory-item\.html/);

  // Role locator — back button
  await page.getByRole('button', { name: 'Back to products' }).click();
  await expect(page).toHaveURL(/.*inventory\.html/);

  // Check the HTML report after this test — you'll see a "console-log"
  // attachment showing every console message that occurred during this test.
});