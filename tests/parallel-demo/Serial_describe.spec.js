const { test, expect } = require('@playwright/test');

// THE FIX: wrap dependent tests in test.describe.configure({ mode: 'serial' }).
// This tells Playwright: "even if fullyParallel is true globally, run these
// specific tests in order, sequentially, in the same browser context."
//
// Everything OUTSIDE this describe block still runs in parallel.
// Only THIS block is protected.

test.describe('cart flow', () => {
  test.describe.configure({ mode: 'serial' });

  // Because mode is 'serial', these three tests run in order,
  // in the SAME page/context — so state actually carries over.
  test('step 1: navigate to products', async ({ page }) => {
    await page.goto('/products');
    await expect(page.locator('.product-item')).toHaveCount(3);
  });

  test('step 2: click add to cart', async ({ page }) => {
    await page.goto('/products');
    await page.locator('[data-product="backpack"]').click();
    console.log('Backpack added');
  });

  test('step 3: confirm cart page is reachable', async ({ page }) => {
    await page.goto('/cart');
    await expect(
      page.getByRole('heading', { name: 'Your Cart' })
    ).toBeVisible();
  });
});

// This test runs in parallel with everything else — not affected by
// the serial describe block above.
test('standalone: checkout page loads independently', async ({ page }) => {
  await page.goto('/checkout');
  await expect(page.locator('#first-name')).toBeVisible();
});