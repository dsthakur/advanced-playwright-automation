const { test, expect } = require('@playwright/test');

// WHY THIS FAILS — even with fullyParallel: false:
//
// fullyParallel: false only controls WHEN tests run (ordering/timing).
// It does NOT make tests share a browser context.
//
// Playwright's core rule, which NEVER changes regardless of any config:
//   Every test() block gets its own brand new browser context.
//   When that test finishes, that context is destroyed.
//
// So:
//   Test 1 opens Context A → adds backpack → Context A is destroyed when test ends
//   Test 2 opens Context B → goes to /cart  → Context B has no cart data → FAILS
//
// This is actually a FEATURE not a bug — it guarantees test isolation.
// The WRONG fix is to try to share context between tests.
// The RIGHT fix is to make each test self-contained (shown below in the fix file).

test('Test 1: add backpack to cart', async ({ page }) => {
  await page.goto('/products');
  await page.locator('[data-product="backpack"]').click();
  console.log('Test 1 context ID (unique per test):', page.context());
  // This item exists ONLY in this test's context.
  // When this test ends, context is gone. Test 2 never sees this.
});

test('Test 2: verify cart has 1 item (ALWAYS FAILS — by design)', async ({ page }) => {
  // `page` here is a completely different context from Test 1.
  // Going to /cart gives you an empty cart — always.
  await page.goto('/cart');
  await expect(page.locator('.cart_item')).toHaveCount(1); // ← Always 0
});