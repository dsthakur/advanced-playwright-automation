const { test, expect } = require('@playwright/test');

// These tests run against OUR OWN server.js — not an external site.
// Playwright starts server.js automatically via webServer config,
// waits for http://localhost:3000 to respond, then runs these tests.

test('home page loads with login form', async ({ page }) => {
  await page.goto('/');

  // Role locator — <h1> is a real heading role
  await expect(page.getByRole('heading', { name: 'Local Shop' })).toBeVisible();

  // ID locators — we built these IDs ourselves in server.js
  await expect(page.locator('#username')).toBeVisible();
  await expect(page.locator('#password')).toBeVisible();

  // Role locator — real button with visible label text
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});

test('products page shows all 3 items', async ({ page }) => {
  await page.goto('/products');

  // Role locator — the <h1> on the products page
  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();

  // CSS class locator — we wrote .product-item in server.js
  const items = page.locator('.product-item');
  await expect(items).toHaveCount(3);

  // CSS class locator — check specific product names
  await expect(page.locator('.product-name').first()).toHaveText('Backpack');
  await expect(page.locator('.product-price').first()).toHaveText('$29.99');
});

test('cart page shows empty state', async ({ page }) => {
  await page.goto('/cart');

  // Role locator — <h1> heading
  await expect(page.getByRole('heading', { name: 'Your Cart' })).toBeVisible();

  // ID locator — the empty state message we wrote in server.js
  await expect(page.locator('#empty-msg')).toHaveText('Your cart is empty.');

  // Role locator — checkout button visible even in empty state
  await expect(page.getByRole('button', { name: 'Proceed to Checkout' })).toBeVisible();
});

test('checkout page has all form fields', async ({ page }) => {
  await page.goto('/checkout');

  // ID locators — we gave these exact IDs in server.js
  await expect(page.locator('#first-name')).toBeVisible();
  await expect(page.locator('#last-name')).toBeVisible();
  await expect(page.locator('#postal')).toBeVisible();

  // Role locator — the submit button
  await expect(page.getByRole('button', { name: 'Place Order' })).toBeVisible();
});

test('order confirmation page shows success message', async ({ page }) => {
  await page.goto('/order-confirmed');

  // Role locator — the <h1> confirmation heading
  await expect(
    page.getByRole('heading', { name: 'Thank you for your order!' })
  ).toBeVisible();

  // ID locator — the confirmation message paragraph
  await expect(page.locator('#confirm-msg')).toHaveText(
    'Your order has been placed successfully.'
  );
  
});