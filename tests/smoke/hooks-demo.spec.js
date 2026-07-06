const { test, expect } = require('@playwright/test');

test.describe('Practice Login Flow with Playwright Hooks', () => {

  // Runs ONCE before all tests in this describe block
  test.beforeAll(async () => {
    console.log('\n>> [Hooks Demo] Starting Login Flow Tests...');
  });

  // Runs ONCE after all tests in this describe block
  test.afterAll(async () => {
    console.log('>> [Hooks Demo] All Login Flow Tests completed!\n');
  });

  // Runs before EVERY test
  test.beforeEach(async ({ page }) => {
    console.log('>> [Hooks Demo] Preparing test environment: Navigating to login page...');
    await page.goto('https://practice.expandtesting.com/login');
  });

  // Runs after EVERY test
  test.afterEach(async ({ page }, testInfo) => {
    console.log(`>> [Hooks Demo] Finished test: "${testInfo.title}" with status: ${testInfo.status}`);
  });

  test('Test Case 1: Successful Login', async ({ page }) => {
    await page.locator('#username').fill('practice');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.locator('button[type="submit"]').click();

    // Verify redirection to secure page
    await expect(page).toHaveURL(/.*secure/);
    await expect(page.getByText('You logged into a secure area!')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
  });

  test('Test Case 2: Invalid Username', async ({ page }) => {
    await page.locator('#username').fill('wrongUser');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.locator('button[type="submit"]').click();

    // Verify error message
    await expect(page.locator('#flash')).toContainText(/is invalid!/);
    await expect(page).toHaveURL(/.*login/); // stays on login page
  });

  test('Test Case 3: Invalid Password', async ({ page }) => {
    await page.locator('#username').fill('practice');
    await page.locator('#password').fill('WrongPassword');
    await page.locator('button[type="submit"]').click();

    // Verify error message
    await expect(page.locator('#flash')).toContainText(/is invalid!/);
    await expect(page).toHaveURL(/.*login/); // stays on login page
  });
});
