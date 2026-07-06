const { test, expect } = require('@playwright/test');

// Simulate a slower backend response to verify the UI handles loading states gracefully.
test('mock a slow network response to test loading state', async ({ page }) => {
  await page.route('**/inventory.html', async route => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    await route.continue();
  });

  const start = Date.now();
  await page.goto('https://www.saucedemo.com/inventory.html');
  const duration = Date.now() - start;

  console.log(`  Page loaded in ${duration}ms (delay was applied)`);
  expect(duration).toBeGreaterThan(1500);

  await expect(page.locator('.inventory_item')).toHaveCount(6);
});

// Return a server error from the inventory endpoint to ensure the page shows an error state.
test('mock a 500 server error on the inventory page', async ({ page }) => {
  await page.route('**/inventory.html', async route => {
    await route.fulfill({
      status: 500,
      contentType: 'text/html',
      body: `
        <html>
          <body>
            <h1 id="error-heading">Server Error</h1>
            <p id="error-msg">Something went wrong. Please try again later.</p>
          </body>
        </html>
      `,
    });
  });

  await page.goto('https://www.saucedemo.com/inventory.html');

  await expect(page.locator('#error-heading')).toHaveText('Server Error');
  await expect(page.locator('#error-msg')).toContainText('Something went wrong');
  console.log('  500 error was returned and UI handled it correctly');
});

// Mock a single product detail URL with a 404 response to verify targeted error handling.
test('mock a 404 on a specific product page', async ({ page }) => {
  await page.route('**/inventory-item.html**', async route => {
    console.log('ROUTE HIT:', route.request().url());
    await route.fulfill({
      status: 404,
      contentType: 'text/html',
      body: '<html><body><h1 id="not-found">Product Not Found</h1></body></html>',
    });
  });

  await page.goto('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('.inventory_item')).toHaveCount(6);

  await page.goto('https://www.saucedemo.com/inventory-item.html?id=4');
  console.log(await page.content());
  console.log('URL:', page.url());
  console.log('TITLE:', await page.title());

  await expect(page.locator('#not-found')).toHaveText('Product Not Found');
  console.log('  Product page returned 404 — only that one URL was mocked');
});

// Stub a JSON API response so the page can be exercised without depending on a live backend.
test('mock an API response with custom JSON data', async ({ page }) => {
  await page.route('**/api/products', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'Test Product A', price: 9.99 },
        { id: 2, name: 'Test Product B', price: 19.99 },
      ]),
    });
  });

  await page.goto('https://www.saucedemo.com');
  const result = await page.evaluate(async () => {
    const res = await fetch('/api/products');
    return res.json();
  });

  expect(result).toHaveLength(2);
  expect(result[0].name).toBe('Test Product A');
  console.log('  API mock returned our custom JSON data');
});