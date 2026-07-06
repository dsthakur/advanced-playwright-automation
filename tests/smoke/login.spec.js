const { test, expect } = require('@playwright/test');

test('login page loads with username and password fields', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('#user-name')).toBeVisible();
  await expect(page.locator('#password')).toBeVisible();
});

test('standard_user can log in using a role-based locator for the button', async ({ page }) => {
  await page.goto('/');

  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/.*inventory\.html/);
  await expect(page.locator('.inventory_item')).toHaveCount(6);
});

test('locked_out_user is blocked with an error message', async ({ page }) => {
  await page.goto('/');
  await page.locator('#user-name').fill('locked_out_user');
  await page.locator('#password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.locator('[data-test="error"]')).toContainText('locked out');
});