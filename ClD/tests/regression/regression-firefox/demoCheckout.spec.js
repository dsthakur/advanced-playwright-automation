const { test, expect } = require('@playwright/test');

test('user can add a product to cart and see the cart badge update', async ({ page }) => {
  await page.goto('/inventory.html');

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(/.*cart\.html/);
  await expect(page.locator('.cart_item')).toHaveCount(1);
});

test('user can complete the full checkout flow', async ({ page }) => {
  await page.goto('/inventory.html');

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('.shopping_cart_link').click();

  await page.getByRole('button', { name: 'Checkout' }).click();

  await page.locator('#first-name').fill('Diwakar');
  await page.locator('#last-name').fill('Thakur');
  await page.locator('#postal-code').fill('140301');

  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.locator('.summary_total_label')).toBeVisible();

  await page.getByRole('button', { name: 'finish' }).click();

  await expect(page.getByRole('heading', { name: 'Thank you for your abstract' })).toBeVisible();
});