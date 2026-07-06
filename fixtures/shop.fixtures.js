const { test: base, expect } = require('@playwright/test');

// ================================================================
// LEVEL 1 — inventoryPage fixture
// ================================================================
// Problem it solves:
//   Every test that needs the products page does: await page.goto('/inventory.html')
//   If that URL ever changes, you update ONE place — here — not every test file.
//
// How it works:
//   The fixture receives `page` (Playwright's built-in fixture) and `use`.
//   Everything BEFORE `use(page)` is setup.
//   Everything AFTER `use(page)` is teardown — runs even if the test fails.
//   `use(page)` is where the actual test runs.

const withInventoryPage = base.extend({
  inventoryPage: async ({ page }, use) => {
    // --- SETUP ---
    await page.goto('/inventory.html');
    await expect(page.locator('.inventory_item')).toHaveCount(6);
    // Proof the page is ready before handing it to the test.
    // The test never has to wait for this — the fixture guarantees it.

    // --- HAND OFF TO TEST ---
    await use(page);
    // --- TEARDOWN (runs even if test fails) ---
    // Nothing to clean up here — page context is destroyed automatically.
    // But this is where you'd do: delete created data, reset state, etc.
  },
});

// ================================================================
// LEVEL 2 — cartPage fixture (builds ON TOP of inventoryPage)
// ================================================================
// Problem it solves:
//   Tests that test cart behavior all do:
//     goto inventory → add item → click cart icon → wait for cart page
//   That's 3-4 lines repeated in every cart test.
//   One fixture replaces all of that.
//
// Key concept: fixtures can USE other fixtures.
//   cartPage receives `page` (built-in) AND depends on inventoryPage
//   being done first — but it builds its own fresh version of what it needs.

const withCartPage = withInventoryPage.extend({
  cartPage: async ({ page }, use) => {
    // --- SETUP ---
    await page.goto('/inventory.html');

    // Add one real product using a CSS data-test locator
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // Navigate to cart using CSS class locator
    await page.locator('.shopping_cart_link').click();

    // Wait for cart page to load before handing to test
    await expect(page).toHaveURL(/.*cart\.html/);
    await expect(page.locator('.cart_item')).toHaveCount(1);

    // --- HAND OFF TO TEST ---
    // The test receives `page` already sitting on the cart page with 1 item in it.
    await use(page);

    // --- TEARDOWN ---
    // Again, no manual cleanup needed — browser context is destroyed after each test.
  },
});

// ================================================================
// LEVEL 3 — checkoutPage fixture (builds ON TOP of cartPage)
// ================================================================
// Problem it solves:
//   Checkout tests need to: land on inventory → add items → go to cart
//   → click Checkout → land on checkout info form
//   That's the same 5-step setup for every checkout test.

const withCheckoutPage = withCartPage.extend({
  checkoutPage: async ({ page }, use) => {
    // --- SETUP ---
    await page.goto('/inventory.html');
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('.shopping_cart_link').click();

    // Role locator — Checkout button has clear accessible name
    await page.getByRole('button', { name: 'Checkout' }).click();

    // Wait for checkout form to be ready
    await expect(page.locator('#first-name')).toBeVisible();

    // --- HAND OFF TO TEST ---
    // Test receives `page` already on the checkout info form, cart pre-filled
    await use(page);
  },
});

// Export all three levels so test files can import whichever they need
module.exports = { withInventoryPage, withCartPage, withCheckoutPage, expect };