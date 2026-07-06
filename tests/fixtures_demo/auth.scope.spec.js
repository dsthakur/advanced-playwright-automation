const { withAuth, expect } = require('../../fixtures/auth.fixtures');

withAuth('Test 1 — inventory page is visible when authenticated', async ({ authenticatedPage }) => {
  await expect(authenticatedPage.locator('.title')).toHaveText('Products');
  console.log('    Test 1 running — already authenticated');
});

withAuth('Test 2 — product prices are visible', async ({ authenticatedPage }) => {
  const prices = authenticatedPage.locator('.inventory_item_price');
  await expect(prices.first()).toContainText('$');
  console.log('    Test 2 running — same worker session, no new login');
});

withAuth('Test 3 — can navigate to cart', async ({ authenticatedPage }) => {
  await authenticatedPage.locator('.shopping_cart_link').click();
  await expect(authenticatedPage).toHaveURL(/.*cart\.html/);
  console.log('    Test 3 running — same worker session, no new login');
});