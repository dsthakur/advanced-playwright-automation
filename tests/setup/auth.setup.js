const { test: setup, expect } = require('@playwright/test');

// This file is NOT a feature test. It has one job: log in for real, then save
// the resulting cookies/session to a file other projects can load instantly.

const standardAuthFile = 'playwright/.auth/standard_user.json';
const problemAuthFile = 'playwright/.auth/problem_user.json';

setup('authenticate as standard_user', async ({ page }) => {
  await page.goto('/');

  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/.*inventory\.html/);

  await page.context().storageState({ path: standardAuthFile });
});

setup('authenticate as problem_user', async ({ page }) => {
  await page.goto('/');

  await page.locator('#user-name').fill('problem_user');
  await page.locator('#password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/.*inventory\.html/);

  await page.context().storageState({ path: problemAuthFile });
});