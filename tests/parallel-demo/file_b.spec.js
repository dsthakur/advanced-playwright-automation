const { test, expect } = require('@playwright/test');

// FILE B — also runs serially inside itself.
// But it runs at the SAME TIME as file-a.spec.js (different worker).

test('File B — Test 1: checkout page', async ({ page }) => {
  await page.goto('/checkout');
  await expect(page.locator('#first-name')).toBeVisible();
  console.log('File B - Test 1 finished');
});

test('File B — Test 2: order confirmation page', async ({ page }) => {
  await page.goto('/order-confirmed');
  await expect(
    page.getByRole('heading', { name: 'Thank you for your order!' })
  ).toBeVisible();
  console.log('File B - Test 2 finished');
});