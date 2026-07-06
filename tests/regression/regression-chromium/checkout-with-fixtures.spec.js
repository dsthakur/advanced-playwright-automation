// Import from our fixtures file, NOT from @playwright/test directly.
// This is the standard pattern — your fixtures file becomes the new `test` object.
const { withInventoryPage, withCartPage, withCheckoutPage, expect } = require('../../../fixtures/shop.fixtures');

// ================================================================
// COMPARE THIS FILE against tests/regression/checkout.spec.js
// ================================================================
// OLD: every test does goto + setup + action + assert
// NEW: every test just declares what state it needs, then only
//      contains the assertions that are UNIQUE to that test.
//
// The fixture handles the "get me there" part.
// The test handles the "now assert this specific thing" part.
// ================================================================


// --- TEST GROUP 1: uses inventoryPage fixture ---
// Just needs to land on the products page — nothing more.

withInventoryPage('inventory page shows 6 products', async ({ inventoryPage }) => {
  // inventoryPage IS the page object — already on /inventory.html, already verified 6 items
  // Zero setup needed. Just assert the specific thing this test cares about.
  await expect(inventoryPage.locator('.title')).toHaveText('Products');});

withInventoryPage('user can see product prices', async ({ inventoryPage }) => {
  const prices = inventoryPage.locator('.inventory_item_price');
  await expect(prices.first()).toContainText('$');
});


// --- TEST GROUP 2: uses cartPage fixture ---
// Needs to start on the cart page with one item already added.

withCartPage('cart shows correct item count badge', async ({ cartPage }) => {
  // cartPage IS the page — already on cart.html with 1 item
  // No need to navigate, add items, or click anything to get here.
  await expect(cartPage.locator('.shopping_cart_badge')).toHaveText('1');
});

withCartPage('cart item has correct product name', async ({ cartPage }) => {
  await expect(
    cartPage.locator('.inventory_item_name')
  ).toHaveText('Sauce Labs Backpack');
});


// --- TEST GROUP 3: uses checkoutPage fixture ---
// Needs to start on the checkout info form with 2 items in cart.

withCheckoutPage('user can fill checkout form and see order summary', async ({ checkoutPage }) => {
  // checkoutPage IS the page — already on checkout form, 2 items in cart
  // Just fill the form and assert the summary — no cart/product setup needed here.

  // ID locators — checkout form fields
  await checkoutPage.locator('#first-name').fill('Diwakar');
  await checkoutPage.locator('#last-name').fill('Thakur');
  await checkoutPage.locator('#postal-code').fill('140301');

  // Role locator — Continue button
  await checkoutPage.getByRole('button', { name: 'Continue' }).click();

  // CSS class locator — summary is visible
  await expect(checkoutPage.locator('.summary_total_label')).toBeVisible();
});

withCheckoutPage('user can complete full order and see confirmation', async ({ checkoutPage }) => {
  await checkoutPage.locator('#first-name').fill('Diwakar');
  await checkoutPage.locator('#last-name').fill('Thakur');
  await checkoutPage.locator('#postal-code').fill('140301');
  await checkoutPage.getByRole('button', { name: 'Continue' }).click();
  await checkoutPage.getByRole('button', { name: 'Finish' }).click();

  // Role locator on heading — the real confirmation heading on saucedemo.com
  await expect(
    checkoutPage.getByRole('heading', { name: 'Thank you for your order!' })
  ).toBeVisible();
});