# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: network\2-mock.spec.js >> mock a 404 on a specific product page
- Location: tests\network\2-mock.spec.js:60:1

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: locator('#not-found')
Expected: "Product Not Found"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveText" with timeout 5000ms
  - waiting for locator('#not-found')

```

```yaml
- button "Open Menu"
- img "Open Menu"
- text: Swag Labs
- button "Go back Back to products":
  - img "Go back"
  - text: Back to products
- img "Sauce Labs Backpack"
- text: Sauce Labs Backpack carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection. $29.99
- button "Add to cart"
- contentinfo:
  - list:
    - listitem:
      - link "Twitter":
        - /url: https://twitter.com/saucelabs
    - listitem:
      - link "Facebook":
        - /url: https://www.facebook.com/saucelabs
    - listitem:
      - link "LinkedIn":
        - /url: https://www.linkedin.com/company/sauce-labs/
  - text: © 2026 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy
```

# Test source

```ts
  1   | const { test, expect } = require('@playwright/test');
  2   | 
  3   | // ================================================================
  4   | // PART 2: route.fulfill() — return fake responses
  5   | // ================================================================
  6   | // The real power move: intercept a request and hand back
  7   | // whatever response you want — no real server needed.
  8   | 
  9   | test('mock a slow network response to test loading state', async ({ page }) => {
  10  |   // Intercept the inventory page and add a 2-second delay.
  11  |   // This tests whether your app shows a loading indicator.
  12  |   // You control the delay — no need to throttle real network.
  13  |   await page.route('**/inventory.html', async route => {
  14  |     // Simulate a slow server — 2000ms delay before responding
  15  |     await new Promise(resolve => setTimeout(resolve, 2000));
  16  |     await route.continue(); // still serve the real page, just delayed
  17  |   });
  18  | 
  19  |   const start = Date.now();
  20  |   await page.goto('https://www.saucedemo.com/inventory.html');
  21  |   const duration = Date.now() - start;
  22  | 
  23  |   // Proves the delay was applied — took at least 2 seconds
  24  |   console.log(`  Page loaded in ${duration}ms (delay was applied)`);
  25  |   expect(duration).toBeGreaterThan(1500);
  26  | 
  27  |   // Page still loaded correctly
  28  |   await expect(page.locator('.inventory_item')).toHaveCount(6);
  29  | });
  30  | 
  31  | 
  32  | test('mock a 500 server error on the inventory page', async ({ page }) => {
  33  |   // Intercept the inventory page and return a 500 error.
  34  |   // In a real app this tests: does your error boundary component render?
  35  |   // Does the user see a friendly message instead of a blank screen?
  36  |   await page.route('**/cart.html', async route => {
  37  |     await route.fulfill({
  38  |       status: 500,
  39  |       contentType: 'text/html',
  40  |       body: `
  41  |         <html>
  42  |           <body>
  43  |             <h1 id="error-heading">Server Error</h1>
  44  |             <p id="error-msg">Something went wrong. Please try again later.</p>
  45  |           </body>
  46  |         </html>
  47  |       `,
  48  |     });
  49  |   });
  50  | 
  51  |   await page.goto('https://www.saucedemo.com/cart.html');
  52  | 
  53  |   // Assert your error UI is shown — the REAL server never responded
  54  |   await expect(page.locator('#error-heading')).toHaveText('Server Error');
  55  |   await expect(page.locator('#error-msg')).toContainText('Something went wrong');
  56  |   console.log('  500 error was returned and UI handled it correctly');
  57  | });
  58  | 
  59  | 
  60  | test('mock a 404 on a specific product page', async ({ page }) => {
  61  |   // Only mock ONE specific URL — let everything else through.
  62  |   // SauceDemo item navigation does NOT reliably request
  63  |   // `inventory-item.html` (so the mock never hits).
  64  |   // Intercept the cart/item page request instead.
  65  |   await page.route('**/cart.html**', async route => {
  66  |     // If the app doesn't navigate here, this won't run.
  67  |     // Keep a clear failure signal in the logs.
  68  |     console.log('  [mock] intercepted navigation to cart.html and returned 404');
  69  |     await route.fulfill({
  70  |       status: 404,
  71  |       contentType: 'text/html',
  72  |       body: '<html><body><h1 id="not-found">Product Not Found</h1></body></html>',
  73  |     });
  74  |   });
  75  | 
  76  |   // Log all navigation/file requests so we know what URL is actually hit
  77  |   await page.route('**/*', async route => {
  78  |     const url = route.request().url();
  79  |     if (url.includes('/inventory-item') || url.includes('/cart.html')) {
  80  |       console.log('  [observed request]', route.request().method(), url);
  81  |     }
  82  |     await route.continue();
  83  |   });
  84  | 
  85  |   // Visit the real inventory page — this loads normally
  86  |   await page.goto('https://www.saucedemo.com/inventory.html');
  87  |   await expect(page.locator('.inventory_item')).toHaveCount(6);
  88  | 
  89  |   // Click a product — mock expects a navigation/request that serves our 404 body
  90  |   await page.locator('.inventory_item_name').first().click();
> 91  |   await expect(page.locator('#not-found')).toHaveText('Product Not Found');
      |                                            ^ Error: expect(locator).toHaveText(expected) failed
  92  |   console.log('  Product page returned 404 — only that one URL was mocked');
  93  | });
  94  | 
  95  | 
  96  | test('mock an API response with custom JSON data', async ({ page }) => {
  97  |   // This is the most common real-world mocking scenario:
  98  |   // your app fetches data from an API, and you want to control
  99  |   // exactly what data it gets without seeding a real database.
  100 |   //
  101 |   // Sauce Demo doesn't have a real JSON API, so we intercept
  102 |   // a fetch call that the page makes and return our own data.
  103 |   // In your real job (HYLA, IHG), this would be:
  104 |   //   page.route('**/api/devices', ...) or page.route('**/api/hotels', ...)
  105 | 
  106 |   await page.route('**/api/products', async route => {
  107 |     await route.fulfill({
  108 |       status: 200,
  109 |       contentType: 'application/json',
  110 |       body: JSON.stringify([
  111 |         { id: 1, name: 'Test Product A', price: 9.99 },
  112 |         { id: 2, name: 'Test Product B', price: 19.99 },
  113 |       ]),
  114 |     });
  115 |   });
  116 | 
  117 |   // Inject a script that makes the fetch call and renders the result
  118 |   await page.goto('https://www.saucedemo.com');
  119 |   const result = await page.evaluate(async () => {
  120 |     const res = await fetch('/api/products');
  121 |     return res.json();
  122 |   });
  123 | 
  124 |   // Our mocked data came back — real server never involved
  125 |   expect(result).toHaveLength(2);
  126 |   expect(result[0].name).toBe('Test Product A');
  127 |   console.log('  API mock returned our custom JSON data');
  128 | });
```