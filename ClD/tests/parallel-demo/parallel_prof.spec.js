const { test, expect } = require('@playwright/test');

// ============================================================
// HOW TO USE THIS FILE
// ============================================================
// Run 1 — fullyParallel: false in playwright.parallel.config.js
//   
//   Result: ALL PASS
//   Why: Tests run in ORDER. Step 1 adds to cart first.
//        Step 2 runs after, checks the cart — finds the item.
//
// Run 2 — change fullyParallel: true in playwright.parallel.config.js, run same command
//   Result: Step 2 FAILS
//   Why: Both tests start at the same time in parallel.
//        Step 2 loads /cart BEFORE Step 1 has added anything.
//        Cart is empty → toHaveCount(1) fails.
// ============================================================

test.describe('cart flow', () => {

  test.describe.configure({ mode: 'serial' });
  // ↑ This is the key line.
  // mode: 'serial' = tests inside this describe run in ORDER, in the SAME page context.
  //
  // With fullyParallel: false → this describe block runs serially as expected. PASS.
  // With fullyParallel: true  → fullyParallel OVERRIDES mode:'serial' for scheduling,
  //                             so both tests can start simultaneously. BREAK.

  test('Step 1 — add backpack to cart', async ({ page }) => {
    // Navigate to products and add one item
    await page.goto('/products');

    // Role locator — clicking the first Add to Cart button
    await page.getByRole('button', { name: 'Add to Cart' }).first().click();

    // Wait for the confirmation message to appear — proof the API call completed
    await expect(page.locator('#msg')).toHaveText('backpack added to cart!');

    console.log('Step 1 done — backpack added');
  });

  test('Step 2 — verify cart has 1 item (depends on Step 1)', async ({ page }) => {
    // Navigate to cart and check the item is there
    await page.goto('/cart');

    // CSS class locator — .cart_item elements rendered by the page script
    await expect(page.locator('.cart_item')).toHaveCount(1);

    // ID locator — the count label
    await expect(page.locator('#cart-count')).toContainText('1 item');

    console.log('Step 2 done — cart verified');
  });

});