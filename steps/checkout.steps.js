const { createBdd } = require('playwright-bdd');
const { test, expect } = require('../fixtures/shop.fixtures');

const { Given, When, Then } = createBdd(test);

// Standard steps (no custom fixtures, using page directly)
Given('I open the inventory page', async ({ page }) => {
  await page.goto('/inventory.html');
});

When('I add {string} to the cart', async ({ page }, product) => {
  const dataTestId = product === 'Backpack' 
    ? 'add-to-cart-sauce-labs-backpack' 
    : 'add-to-cart-sauce-labs-bike-light';
  await page.locator(`[data-test="${dataTestId}"]`).click();
});

Then('the shopping cart badge should show {string}', async ({ page }, count) => {
  await expect(page.locator('.shopping_cart_badge')).toHaveText(count);
});

When('I click the shopping cart link', async ({ page }) => {
  await page.locator('.shopping_cart_link').click();
});

Then('I should be redirected to the cart page', async ({ page }) => {
  await expect(page).toHaveURL(/.*cart\.html/);
});

Then('I should see {int} item in the cart', async ({ page }, count) => {
  await expect(page.locator('.cart_item')).toHaveCount(count);
});

When('I click the checkout button', async ({ page }) => {
  await page.getByRole('button', { name: 'Checkout' }).click();
});

When('I fill the checkout form with {string}, {string}, {string}', async ({ page }, firstName, lastName, postalCode) => {
  await page.locator('#first-name').fill(firstName);
  await page.locator('#last-name').fill(lastName);
  await page.locator('#postal-code').fill(postalCode);
});

When('I click the continue button', async ({ page }) => {
  await page.getByRole('button', { name: 'Continue' }).click();
});

Then('the order summary total should be visible', async ({ page }) => {
  await expect(page.locator('.summary_total_label')).toBeVisible();
});

When('I click the finish button', async ({ page }) => {
  await page.getByRole('button', { name: 'Finish' }).click();
});

Then('I should see the order confirmation message {string}', async ({ page }, message) => {
  await expect(page.getByRole('heading', { name: message })).toBeVisible();
});

// Custom fixture steps (using custom fixtures as arguments)
Given('I am on the inventory page via fixture', async ({ inventoryPage }) => {
  // inventoryPage fixture runs setup automatically
});

Then('the page title should be {string}', async ({ inventoryPage }, title) => {
  await expect(inventoryPage.locator('.title')).toHaveText(title);
});

Then('I should see {string} in the first product price', async ({ inventoryPage }, currency) => {
  const prices = inventoryPage.locator('.inventory_item_price');
  await expect(prices.first()).toContainText(currency);
});

Given('I am on the cart page via fixture', async ({ cartPage }) => {
  // cartPage fixture runs setup automatically
});

Then('the cart item name should be {string}', async ({ cartPage }, name) => {
  await expect(cartPage.locator('.inventory_item_name')).toHaveText(name);
});

Given('I am on the checkout info page via fixture', async ({ checkoutPage }) => {
  // checkoutPage fixture runs setup automatically
});
