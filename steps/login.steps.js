const { createBdd } = require('playwright-bdd');
const { expect } = require('@playwright/test');

const { Given, When, Then } = createBdd();

Given('I open the login page', async ({ page }) => {
  await page.goto('/');
});

Then('I should see the username input field', async ({ page }) => {
  await expect(page.locator('#user-name')).toBeVisible();
});

Then('I should see the password input field', async ({ page }) => {
  await expect(page.locator('#password')).toBeVisible();
});

When('I fill standard credentials', async ({ page }) => {
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
});

When('I fill locked out credentials', async ({ page }) => {
  await page.locator('#user-name').fill('locked_out_user');
  await page.locator('#password').fill('secret_sauce');
});

When('I click the login button', async ({ page }) => {
  await page.getByRole('button', { name: 'Login' }).click();
});

Then('I should be redirected to the inventory page', async ({ page }) => {
  await expect(page).toHaveURL(/.*inventory\.html/);
});

Then('I should see {int} inventory items', async ({ page }, count) => {
  await expect(page.locator('.inventory_item')).toHaveCount(count);
});

Then('I should see a login error message containing {string}', async ({ page }, errorText) => {
  await expect(page.locator('[data-test="error"]')).toContainText(errorText);
});
