const { test, expect } = require('@playwright/test');

test.describe('Browser Permissions & Geolocation Mocking', () => {

  test('mock geolocation and verify browser API returns mocked coordinates', async ({ context, page }) => {
    // 1. Grant geolocation permissions to the browser context
    await context.grantPermissions(['geolocation']);

    // 2. Set mock coordinates to Paris (Eiffel Tower)
    const mockedCoordinates = { latitude: 48.8584, longitude: 2.2945 };
    await context.setGeolocation(mockedCoordinates);

    // 3. Navigate to a secure origin to query window.navigator
    await page.goto('https://example.com');

    // 4. Request current coordinates using browser's geolocation API
    const coords = await page.evaluate(() => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }),
          (error) => reject(new Error(error.message))
        );
      });
    });

    // 5. Assert the browser returns mocked geolocation
    expect(coords.latitude).toBeCloseTo(mockedCoordinates.latitude, 4);
    expect(coords.longitude).toBeCloseTo(mockedCoordinates.longitude, 4);
  });

  test('verify permission queries return granted state', async ({ context, page }) => {
    // 1. Grant notifications permission to the context
    await context.grantPermissions(['notifications']);

    await page.goto('https://example.com');

    // 2. Query notifications permission status in the browser
    const status = await page.evaluate(async () => {
      const permission = await navigator.permissions.query({ name: 'notifications' });
      return permission.state;
    });

    // 3. Assert the state is "granted"
    expect(status).toBe('granted');
  });

});
