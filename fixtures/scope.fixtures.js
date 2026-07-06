const { test: base, expect } = require('@playwright/test');

let testScopeCallCount = 0;
let workerScopeCallCount = 0;

const scopeDemo = base.extend({
  testScopedClient: [async ({}, use) => {
    testScopeCallCount++;
    const callNumber = testScopeCallCount;

    console.log(`  [test-scope]   CREATE — call #${callNumber}`);

    const client = {
      type: 'test-scoped',
      callNumber,
      sessionId: `session-${callNumber}-${Date.now()}`,
    };

    await use(client);

    console.log(`  [test-scope]   DESTROY — call #${callNumber}`);
  }, { scope: 'test' }],

  workerScopedClient: [async ({}, use) => {
    workerScopeCallCount++;
    const callNumber = workerScopeCallCount;

    console.log(`  [worker-scope] CREATE — call #${callNumber} (shared across all tests on this worker)`);

    const client = {
      type: 'worker-scoped',
      callNumber,
      sessionId: `worker-session-${callNumber}-${Date.now()}`,
    };

    await use(client);

    console.log(`  [worker-scope] DESTROY — call #${callNumber}`);
  }, { scope: 'worker' }],
});

module.exports = { scopeDemo, expect };