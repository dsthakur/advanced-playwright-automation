const { test, expect } = require('@playwright/test');

// Capture the browser traffic during login so the test can inspect what the app requests.
test('observe all network requests during login', async ({ page }) => {
  const requests = [];

  // Intercept every request and record its method, URL, and resource type.
  await page.route('**/*', async route => {
    const request = route.request();
    requests.push({
      method: request.method(),
      url: request.url(),
      resourceType: request.resourceType(),
    });

    await route.continue();
  });

  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/.*inventory\.html/);

  console.log('\n--- All network requests during login ---');
  requests.forEach(r => {
    console.log(`  ${r.method} [${r.resourceType}] ${r.url}`);
  });
  console.log(`--- Total: ${requests.length} requests ---\n`);

  expect(requests.length).toBeGreaterThan(0);
});

// Focus on JavaScript requests to see which scripts the page loads during authentication.
test('intercept only script requests', async ({ page }) => {
  const apiRequests = [];

  // Record only script requests so the test stays focused on client-side assets.
  await page.route('**/*', async route => {
    const request = route.request();

    if (request.resourceType() === 'script') {
      apiRequests.push({
        method: request.method(),
        url: request.url(),
        type: request.resourceType(),
      });

      console.log(`Intercepted ${request.resourceType()} request: ${request.url()}`);
    }

    await route.continue();
  });

  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  console.log('\n--- API Requests ---');
  apiRequests.forEach(req => {
    console.log(`${req.method} [${req.type}] ${req.url}`);
  });

  expect(apiRequests.length).toBeGreaterThan(0);
});