const { scopeDemo, expect } = require('../../fixtures/scope.fixtures');

// Run these tests with --reporter=list so you can see the console.log output clearly:
// npx playwright test tests/fixtures-demo/scope.spec.js --project=regression-chromium --reporter=list
//
// What to look for in the output:
//
// test-scoped:
//   [test-scope] CREATE  → appears BEFORE every test
//   [test-scope] DESTROY → appears AFTER every test
//   sessionId is DIFFERENT for every test → proves a new instance each time
//
// worker-scoped:
//   [worker-scope] CREATE  → appears ONCE at the start (not before every test)
//   [worker-scope] DESTROY → appears ONCE at the very end (not after every test)
//   sessionId is SAME for all tests on same worker → proves it's shared

scopeDemo('Test 1 — reads both clients', async ({ testScopedClient, workerScopedClient }) => {
  console.log(`    Test 1 test-scope   sessionId: ${testScopedClient.sessionId}`);
  console.log(`    Test 1 worker-scope sessionId: ${workerScopedClient.sessionId}`);

  // The test-scoped client is always call #1 for this test's fresh instance
  expect(testScopedClient.type).toBe('test-scoped');
  expect(workerScopedClient.type).toBe('worker-scoped');
});

scopeDemo('Test 2 — reads both clients', async ({ testScopedClient, workerScopedClient }) => {
  console.log(`    Test 2 test-scope   sessionId: ${testScopedClient.sessionId}`);
  console.log(`    Test 2 worker-scope sessionId: ${workerScopedClient.sessionId}`);

  // testScopedClient.sessionId → DIFFERENT from Test 1 (new instance)
  // workerScopedClient.sessionId → SAME as Test 1 (shared instance)
  expect(testScopedClient.type).toBe('test-scoped');
  expect(workerScopedClient.type).toBe('worker-scoped');
});

scopeDemo('Test 3 — reads both clients', async ({ testScopedClient, workerScopedClient }) => {
  console.log(`    Test 3 test-scope   sessionId: ${testScopedClient.sessionId}`);
  console.log(`    Test 3 worker-scope sessionId: ${workerScopedClient.sessionId}`);

  expect(testScopedClient.type).toBe('test-scoped');
  expect(workerScopedClient.type).toBe('worker-scoped');
});