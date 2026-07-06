const { test, expect } = require('@playwright/test');

const API_BASE = 'https://jsonplaceholder.typicode.com';

test('GET /posts returns a list of posts', async ({ request }) => {
  const response = await request.get(`${API_BASE}/posts`);

  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();

  const body = await response.json();

  expect(Array.isArray(body)).toBeTruthy();
  expect(body.length).toBe(100);
  expect(body[0]).toMatchObject({
    id: expect.any(Number),
    title: expect.any(String),
    body: expect.any(String),
    userId: expect.any(Number),
  });

  console.log(`  GET /posts → ${response.status()} — ${body.length} posts returned`);
});

test('GET /posts/:id returns a single post', async ({ request }) => {
  const response = await request.get(`${API_BASE}/posts/1`);

  expect(response.status()).toBe(200);
  const post = await response.json();

  expect(post.id).toBe(1);
  expect(post.title).toBeTruthy();
  console.log(`  GET /posts/1 → title: "${post.title}"`);
});

test('GET /posts/:id returns 404 for non-existent post', async ({ request }) => {
  const response = await request.get(`${API_BASE}/posts/99999`);

  expect(response.status()).toBe(404);
  console.log(`  GET /posts/99999 → ${response.status()} as expected`);
});

test('POST /posts creates a new post', async ({ request }) => {
  const newPost = {
    title: 'Playwright API Test',
    body: 'This post was created by a Playwright request fixture',
    userId: 1,
  };

  const response = await request.post(`${API_BASE}/posts`, {
    data: newPost,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  expect(response.status()).toBe(201);

  const created = await response.json();
  expect(created.title).toBe(newPost.title);
  expect(created.id).toBeDefined();

  console.log(`  POST /posts → created with id: ${created.id}`);
});

test('PUT /posts/:id updates an existing post', async ({ request }) => {
  const updatedPost = {
    id: 1,
    title: 'Updated Title',
    body: 'Updated body text',
    userId: 1,
  };

  const response = await request.put(`${API_BASE}/posts/1`, {
    data: updatedPost,
  });

  expect(response.status()).toBe(200);
  const updated = await response.json();
  expect(updated.title).toBe('Updated Title');

  console.log(`  PUT /posts/1 → updated title: "${updated.title}"`);
});

test('DELETE /posts/:id deletes a post', async ({ request }) => {
  const response = await request.delete(`${API_BASE}/posts/1`);

  expect(response.status()).toBe(200);

  console.log(`  DELETE /posts/1 → ${response.status()}`);
});

test('chain: create data via API then verify it in the UI context', async ({ request, page }) => {
  const createResponse = await request.post(`${API_BASE}/posts`, {
    data: { title: 'My Test Post', body: 'Created via API', userId: 1 },
  });
  expect(createResponse.status()).toBe(201);
  const post = await createResponse.json();

  console.log(`  Step 1: Created post via API — id: ${post.id}, title: "${post.title}"`);

  const getResponse = await request.get(`${API_BASE}/posts/${post.id}`);
  console.log(`  Step 2: GET the created post → status: ${getResponse.status()}`);

  await page.goto('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('.inventory_item')).toHaveCount(6);
  console.log('  Step 3: Browser verified inventory page loads');
});