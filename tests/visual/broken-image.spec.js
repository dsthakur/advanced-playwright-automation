const { test, expect } = require('@playwright/test');

// This project starts pre-authenticated as `problem_user` via storageState —
// no login code needed here at all. problem_user is a REAL Sauce Demo account
// where product images are deliberately swapped/broken, used here to demonstrate
// testing a known-broken role separately from the normal "happy path" user.

test('problem_user sees product images, but they may be broken (known issue)', async ({ page }) => {
  await page.goto('/inventory.html');

  const images = page.locator('.inventory_item_img img');
  await expect(images.first()).toBeVisible();

  // All product images for problem_user actually point to the SAME image file —
  // this assertion documents that known bug rather than hiding it.
  const firstSrc = await images.first().getAttribute('src');
  const secondSrc = await images.nth(1).getAttribute('src');
  expect(firstSrc).toBe(secondSrc);
});