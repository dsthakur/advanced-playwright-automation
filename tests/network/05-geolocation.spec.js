const { test, expect } = require('@playwright/test');

test.describe('Browser Permissions & Geolocation Mocking', () => {

  test('mock geolocation and verify browser API returns mocked coordinates', async ({ context, page }) => {
    // 1. Grant geolocation permissions to the browser context
    await context.grantPermissions(['geolocation']);

    // 2. Set mock coordinates to Paris (Eiffel Tower)
    const mockedCoordinates = { latitude: 48.8584, longitude: 2.2945 };
    await context.setGeolocation(mockedCoordinates);

    // 3. Navigate to a secure origin to query window.navigator
    await page.goto('https://google.com');

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

  test('verify mocked location is reflected on gps-coordinates.net/my-location', async ({ context, page }) => {
    // 1. Grant geolocation permissions to the browser context
    await context.grantPermissions(['geolocation']);

    // 2. Set mock coordinates to Paris (Eiffel Tower)
    const mockedCoordinates = { latitude: 48.8584, longitude: 2.2945 };
    await context.setGeolocation(mockedCoordinates);

    // 3. Navigate to the coordinates verification website
    await page.goto('https://www.gps-coordinates.net/my-location');

    // 4. Assert that the page display elements display the correct latitude and longitude
    const latSpan = page.locator('#lat');
    const lngSpan = page.locator('#lng');

    // Wait for the client-side geolocation script to resolve and update the text
    await expect(latSpan).toContainText(mockedCoordinates.latitude.toString(), { timeout: 10000 });
    await expect(lngSpan).toContainText(mockedCoordinates.longitude.toString(), { timeout: 10000 });
  });

});
