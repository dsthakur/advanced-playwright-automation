const { test, expect } = require('@playwright/test');

test('home page loads with login form', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Local Shop' })).toBeVisible();
  await expect(page.locator('#username')).toBeVisible();
  await expect(page.locator('#password')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});

test('products page shows all 3 items', async ({ page }) => {
  await page.goto('/products');

  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();

  const items = page.locator('.product-item');
  await expect(items).toHaveCount(3);
  await expect(page.locator('.product-name').first()).toHaveText('Backpack');
  await expect(page.locator('.product-price').first()).toHaveText('$29.99');
});

test('cart page shows empty state', async ({ page }) => {
  await page.goto('/cart');

  await expect(page.getByRole('heading', { name: 'Your Cart' })).toBeVisible();
  await expect(page.locator('#empty-msg')).toHaveText('Your cart is empty.');
  await expect(page.getByRole('button', { name: 'Proceed to Checkout' })).toBeVisible();
});

test('checkout page has all form fields', async ({ page }) => {
  await page.goto('/checkout');

  await expect(page.locator('#first-name')).toBeVisible();
  await expect(page.locator('#last-name')).toBeVisible();
  await expect(page.locator('#postal')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Place Order' })).toBeVisible();
});

test('order confirmation page shows success message', async ({ page }) => {
  await page.goto('/order-confirmed');

  await expect(
    page.getByRole('heading', { name: 'Thank you for your order!' })
  ).toBeVisible();
  await expect(page.locator('#confirm-msg')).toHaveText(
    'Your order has been placed successfully.'
  );
});