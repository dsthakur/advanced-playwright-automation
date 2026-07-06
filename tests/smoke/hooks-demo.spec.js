const { test, expect } = require('@playwright/test');

// Simple E2E login suite for practice page
test.describe('Login Tests Suite', () => {

  // Before all tests run
  test.beforeAll(async () => {
    console.log('Test suite started');
  });

  // After all tests run
  test.afterAll(async () => {
    console.log('Test suite finished');
  });

  // Open login page before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('https://practice.expandtesting.com/login');
  });

  // Simple log after each test finishes
  test.afterEach(async ({ page }) => {
    console.log('Test case execution done');
  });

  // Test Case 1: Positive login flow
  test('Successful Login with valid credentials', async ({ page }) => {
    await page.locator('#username').fill('practice');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.locator('button[type="submit"]').click();

    // Assert URL change and success message banner
    await expect(page).toHaveURL('https://practice.expandtesting.com/secure');
    await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
  });

  // Test Case 2: Negative login flow with invalid username
  test('Login failed with invalid username', async ({ page }) => {
    await page.locator('#username').fill('wrongUser');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.locator('button[type="submit"]').click();

    // Assert error message banner
    await expect(page.locator('#flash')).toContainText('invalid');
  });

  // Test Case 3: Negative login flow with invalid password
  test('Login failed with invalid password', async ({ page }) => {
    await page.locator('#username').fill('practice');
    await page.locator('#password').fill('WrongPassword');
    await page.locator('button[type="submit"]').click();

    // Assert error message banner
    await expect(page.locator('#flash')).toContainText('invalid');
  });

});
