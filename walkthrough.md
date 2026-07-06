# Playwright Demo & Tutorial Project Walkthrough

This project serves as a comprehensive training and reference codebase for Playwright. Below is a detailed breakdown of all the core concepts, patterns, and features demonstrated across the codebase.

---

## 1. Project Structure & Configurations

The project contains multiple configuration files configured to demonstrate different execution environments and parameters:

*   **[playwright.config.js](file:///c:/Users/dsthakur/Desktop/ClD/playwright.config.js)**: Runs tests against a public live demo application ([Sauce Demo](https://www.saucedemo.com/)). Features:
    *   **Global Setup**: Configured via a `setup` project that runs once beforehand.
    *   **Multiple Browsers**: Chromium, Firefox, and WebKit (Safari).
    *   **Storage State / Reusing Login Sessions**: Starts tests authenticated under specific user personas (`standard_user` or `problem_user`).
    *   **Trace & Video Attachments**: Configured to record traces and videos only on failure to keep local dev lightweight but fully documented in CI.
*   **[playwright.local.config.js](file:///c:/Users/dsthakur/Desktop/ClD/playwright.local.config.js)**: Runs tests against a local Node.js server (`server.js` on port `3000`). Demonstrates the `webServer` option to automatically start the server, verify its health before starting tests, and reuse it during local development.
*   **[Playwright.parallel.config.js](file:///c:/Users/dsthakur/Desktop/ClD/Playwright.parallel.config.js)**: Runs parallel demonstration tests against `server.js`.
*   **[Playwright.parallels.config.js](file:///c:/Users/dsthakur/Desktop/ClD/Playwright.parallels.config.js)**: Runs parallel validation tests against `server2.js` (port `3002`).

---

## 2. Core Concepts Covered

### A. Pre-Authentication Setup & Session Reuse
Rather than logging in during every single test, the project logs in once and saves the state to disk:
*   **Global Setup Project**: Defined in [playwright.config.js](file:///c:/Users/dsthakur/Desktop/ClD/playwright.config.js).
*   **Auth Script**: [tests/setup/auth.setup.js](file:///c:/Users/dsthakur/Desktop/ClD/tests/setup/auth.setup.js) logs in as `standard_user` and `problem_user`, saving the state to `playwright/.auth/*.json`.
*   **Usage**: Regression and Visual testing projects specify `storageState` to load these authenticated sessions instantly.

### B. Custom Playwright Fixtures
Fixtures are isolated, reusable environments built for tests. The project demonstrates advanced fixture patterns:
*   **Fixture Inheritance (Layering)**: [fixtures/shop.fixtures.js](file:///c:/Users/dsthakur/Desktop/ClD/fixtures/shop.fixtures.js) defines a 3-tier inheritance chain:
    1.  `inventoryPage`: Navigates to inventory and validates loading.
    2.  `cartPage` *(inherits `inventoryPage`)*: Adds a backpack to the cart and navigates to the cart.
    3.  `checkoutPage` *(inherits `cartPage`)*: Adds multiple items, navigates to cart, and clicks "Checkout" to load the checkout info form.
*   **Automatic Fixtures (`{ auto: true }`)**: [fixtures/auto.fixtures.js](file:///c:/Users/dsthakur/Desktop/ClD/fixtures/auto.fixtures.js) hooks automatically into tests without being declared as arguments:
    *   `consoleLogger`: Records console errors and page errors, attaching them to the final test report.
    *   `testTimer`: Logs start time, duration, and test status.
    *   `screenshotOnFailure`: Takes a full-page screenshot when a test fails and attaches it to the report.
*   **Fixture Scopes**: [fixtures/scope.fixtures.js](file:///c:/Users/dsthakur/Desktop/ClD/fixtures/scope.fixtures.js) demonstrates the difference between:
    *   `scope: 'test'`: Destroys and recreates the state for every individual test.
    *   `scope: 'worker'`: Creates state once per worker thread, sharing it across all tests assigned to that worker.
*   **Page Enhancement**: [fixtures/enhanced-page.fixtures.js](file:///c:/Users/dsthakur/Desktop/ClD/fixtures/enhanced-page.fixtures.js) extends the standard page fixture to capture console messages and track network failures.

### C. Network Interception, Mocking & API Testing
Playwright excels at controlling network operations. The project demonstrates four key network strategies:
*   **Observation**: [tests/network/01-observe.spec.js](file:///c:/Users/dsthakur/Desktop/ClD/tests/network/01-observe.spec.js) observes and records all outgoing network traffic.
*   **Mocking**: [tests/network/02-mock.spec.js](file:///c:/Users/dsthakur/Desktop/ClD/tests/network/02-mock.spec.js) modifies server responses to test client-side resilience:
    *   Mocking custom JSON payloads.
    *   Simulating slow APIs (adding a delay) to test UI loading states.
    *   Simulating server errors (500) and page not found errors (404).
*   **Aborting Requests**: [tests/network/03-abort.spec.js](file:///c:/Users/dsthakur/Desktop/ClD/tests/network/03-abort.spec.js):
    *   Blocking image requests to speed up test execution.
    *   Blocking specific domains (e.g., analytics services) to test offline fallback behavior.
    *   Simulating connection timeouts.
*   **API CRUD & Integration Testing**: [tests/network/04-api.spec.js](file:///c:/Users/dsthakur/Desktop/ClD/tests/network/04-api.spec.js) performs standard REST HTTP operations (`GET`, `POST`, `PUT`, `DELETE`) via Playwright's `request` context, and demonstrates seeding data via an API endpoint before validating it inside a browser UI context.

### D. Parallelism & Test Isolation
Playwright enforces strict context isolation by default to avoid shared state bugs:
*   **Shared Context Failures**: [tests/parallel-demo/file_c.spec.js](file:///c:/Users/dsthakur/Desktop/ClD/tests/parallel-demo/file_c.spec.js) shows that trying to split a linear process (add to cart -> check cart) into separate test blocks will fail because each test runs in a clean, isolated context.
*   **Serial Mode**: [tests/parallel-demo/Serial_describe.spec.js](file:///c:/Users/dsthakur/Desktop/ClD/tests/parallel-demo/Serial_describe.spec.js) and [tests/parallel_proof/parallel_prof.spec.js](file:///c:/Users/dsthakur/Desktop/ClD/tests/parallel_proof/parallel_prof.spec.js) show how to configure tests sequentially inside a `test.describe.configure({ mode: 'serial' })` block or run them sequentially by disabling `fullyParallel` and using 1 worker.

---

## 3. Running the Code & Verifying Results

### A. Local Shop Test Run
Tests the custom local server:
```bash
npx playwright test --config=playwright.local.config.js
```
*All 5 tests pass.*

### B. Saucedemo Test Run
Runs the full suite against the live demo app:
```bash
npx playwright test
```
*All 52 tests pass.*

### C. Parallel Demonstrations
Runs tests specifically designed to highlight execution timing and context separation:
```bash
# Demonstrates failure-by-design due to test isolation:
npx playwright test --config=Playwright.parallel.config.js

# Demonstrates serial execution proof:
npx playwright test --config=Playwright.parallels.config.js
```
