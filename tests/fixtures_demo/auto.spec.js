const { withAutoFixtures, expect } = require('../../fixtures/auto.fixtures');

withAutoFixtures('Test 1 — passes cleanly, no console errors', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await expect(page.locator('#user-name')).toBeVisible();
});

withAutoFixtures('Test 2 — also passes, check timing output', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/.*inventory\.html/);
});

withAutoFixtures('Test 3 — intentionally fails to trigger screenshotOnFailure', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  await expect(
    page.getByRole('heading', { name: 'This heading does not exist' })
  ).toBeVisible({ timeout: 2000 });
});