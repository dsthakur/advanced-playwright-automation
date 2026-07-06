const { test, expect } = require('@playwright/test');

// Block image requests to keep the page load faster and reduce noise in the test.
test('block all image requests to speed up test execution', async ({ page }) => {
  let blockedCount = 0;

  await page.route('**/*.{png,jpg,jpeg,gif,svg,webp,ico}', async route => {
    blockedCount++;
    await route.abort();
  });

  await page.goto('https://www.saucedemo.com/inventory.html');

  await expect(page.locator('.inventory_item')).toHaveCount(6);
  await expect(
    page.getByRole('button', { name: 'Add to cart' }).first()
  ).toBeVisible();

  console.log(`  Blocked ${blockedCount} image requests — page still functional`);
});

// Abort analytics requests to mimic a third-party service outage without affecting the main app flow.
test('simulate analytics service being down', async ({ page }) => {
  const blockedUrls = [];

  await page.route('**/*google-analytics*', async route => {
    blockedUrls.push(route.request().url());
    await route.abort();
  });

  await page.route('**/*googletagmanager*', async route => {
    blockedUrls.push(route.request().url());
    await route.abort();
  });

  await page.goto('https://www.saucedemo.com');
  await expect(page.locator('#user-name')).toBeVisible();

  console.log(`  Blocked ${blockedUrls.length} analytics requests`);
});

// Simulate a timeout for a specific navigation request to test retry and error handling.
test('simulate network timeout on a specific request', async ({ page }) => {
  await page.route('**/inventory.html', async route => {
    await route.continue();
  });

  await page.goto('https://www.saucedemo.com/inventory.html');

  let requestCount = 0;
  await page.route('**/inventory.html', async route => {
    requestCount++;
    if (requestCount === 1) {
      await route.abort('timedout');
    } else {
      await route.continue();
    }
  });

  try {
    await page.reload({ timeout: 3000 });
  } catch (e) {
    console.log(`  Navigation timed out as expected: ${e.message.split('\n')[0]}`);
  }
});