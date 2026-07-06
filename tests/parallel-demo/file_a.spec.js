const { test, expect } = require('@playwright/test');

// FILE A — tests in this file run SERIALLY by default (one after the other).
// But THIS FILE ITSELF runs in parallel with file-b.spec.js.
// Watch the timestamps when you run with --reporter=line

test('File A — Test 1: home page', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Local Shop' })).toBeVisible();
  console.log('File A - Test 1 finished');
});

test('File A — Test 2: products page', async ({ page }) => {
  await page.goto('/products');
  await expect(page.locator('.product-item')).toHaveCount(3);
  console.log('File A - Test 2 finished');
});

test('File A — Test 3: cart page', async ({ page }) => {
  await page.goto('/cart');
  await expect(page.locator('#empty-msg')).toBeVisible();
  console.log('File A - Test 3 finished');
});