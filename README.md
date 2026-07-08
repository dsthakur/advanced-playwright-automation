# Playwright E2E Automation Tutorial & Demo Suite

This repository is a comprehensive showcase and learning suite for **Playwright End-to-End (E2E) automation**. It covers advanced Playwright patterns, including user state reuse, custom test-scoped and worker-scoped fixtures, network interception/mocking/aborting, API integration testing, and test isolation design.

---

## 🚀 Key Concepts Covered

### 1. Reusing Authentication Sessions
Instead of logging in before every test, the suite logs in once during a global setup phase and stores state JSON files:
*   **Global Setup Configuration**: Defined as a setup dependency in `playwright.config.js`.
*   **Auth Setup Script**: Logs in as multiple personas (e.g., `standard_user` and `problem_user`) and saves cookies/session states.
*   **Persona Testing**: Regression and visual tests load these storage states to immediately start pre-authenticated, drastically speeding up execution.

### 2. Custom Playwright Fixtures
Fixtures encapsulate environment setup and teardown cleanly:
*   **Hierarchical Fixtures**: Multi-level inheritance (`withInventoryPage` ➔ `withCartPage` ➔ `withCheckoutPage`).
*   **Auto-Run Fixtures**: Setup tasks that run automatically (e.g., capturing console/page errors, timing test durations, and automatically saving screenshots on failure).
*   **Scoped Fixtures**: Demonstrations of test-scoped (created per test) vs. worker-scoped (shared across a worker thread) fixtures.
*   **Enhanced Pages**: Extending Playwright's default page object to hook console listener and network failure tracking into reports.

### 3. Network Interception & Mocking
Fine-grained control over network requests to simulate complex edge cases:
*   **Observe**: Tracking and printing outgoing requests.
*   **Mock**: Returning custom JSON mock payloads, introducing network latency/delays, and simulating server errors (500) and resources not found (404).
*   **Abort**: Blocking image categories to speed up execution, blocking third-party tracking/analytics, and simulating request timeouts.
*   **API Testing**: Performing CRUD REST calls using the `request` context and combining API state seeding with browser-based UI validation.

### 4. Parallelism & Context Isolation
*   **Context Isolation**: Shows that every test block has a unique, isolated browser context by default.
*   **Serial Execution**: Shows how to run sequential steps safely using `test.describe.configure({ mode: 'serial' })` or configuring single worker sequential flows.

### 5. Automated CI/CD (GitHub Actions)
*   **Strategy Matrix**: Automatically executes test suites across different configurations in parallel:
    *   `main-regression-suite` (against Saucedemo live site)
    *   `local-shop-suite` (against the local `server.js` server)
    *   `parallel-proof-suite` (against `server2.js`)
    *   `parallel-demo-suite` (parallel demo tests)
*   **Unified Artifact Merging**: Individual jobs run in parallel, and a final step automatically downloads, consolidates, and uploads a single unified artifact (`combined-playwright-html-report`) containing the HTML reports for all executed suites, making report downloads from GitHub runs extremely simple.

---

## 📁 Repository Structure

```text
├── .github/                 # GitHub CI actions configuration
├── features/                # Cucumber Gherkin feature files (login, checkout, etc.)
├── fixtures/                # Custom Playwright fixtures (auth, auto, scope, shop, etc.)
├── steps/                   # BDD step definition files
├── playwright/              # Auth storage files (.auth/standard_user.json, problem_user.json)
├── tests/
│   ├── setup/               # Auth setup scripts (runs first)
│   ├── local/               # Tests targeting our local shop server
│   ├── network/             # Network mocking, API testing, permissions, and location mocking
│   ├── fixtures_demo/       # Verifying custom fixtures and scopes
│   ├── parallel-demo/       # Demystifying parallel scheduling and context isolation
│   └── parallel_proof/      # Verification of sequential vs parallel test behavior
├── server.js                # Local shop Node.js server (Port 3000)
├── server2.js               # Parallel proof mock server (Port 3002)
├── playwright.config.js     # Default config (runs against live Saucedemo site)
├── playwright.local.config.js# Local app config (spawns and queries server.js)
├── Playwright.parallel.config.js  # Parallel demo config
└── Playwright.parallels.config.js # Parallel proof config
```

---

## 🛠️ Setup & Installation

1. Install project dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browser engines:
   ```bash
   npx playwright install
   ```

---

## 💻 Command Reference

Run the tests using the appropriate configuration file depending on what you want to verify. Note that since we use **playwright-bdd**, you must compile feature files using `npx bddgen` before executing BDD tests.

### 1. Run Main Test Suite (Against Saucedemo)
Executes all regression, smoke, BDD, visual, network, and fixture tests.
```bash
npx bddgen
npx playwright test
```

### 2. Run Only Smoke (BDD) Tests
```bash
npx bddgen
npx playwright test --project=smoke
```

### 3. Run Only Regression (BDD) Tagged Tests
```bash
npx bddgen
npx playwright test --grep "@regression"
```

### 3. Run Local Server Tests
Spawns the local Node.js web server (`server.js`) on port `3000` and runs the local test suite.
```bash
npx playwright test --config=playwright.local.config.js
```

### 4. Run Parallelism & Context Isolation Tests
*   Run the parallel demo showing context isolation and failure-by-design:
    ```bash
    npx playwright test --config=Playwright.parallel.config.js
    ```
*   Run the parallel proof confirming sequential dependencies:
    ```bash
    npx playwright test --config=Playwright.parallels.config.js
    ```

### 5. Start Web Servers Manually
```bash
# Start local shop (Port 3000)
node server.js

# Start local server 2 (Port 3002)
node server2.js
```

### 6. Allure Reporting Reference
After running tests (which outputs raw reports to `my-allure-results`), you can generate and view HTML reports:

*   **Generate Report**:
    ```bash
    npm run allure:generate
    ```
*   **Open Report**:
    ```bash
    npm run allure:open
    ```
*   **Clear Results/Report**:
    ```bash
    npm run allure:clear
    ```

> [!NOTE]
> The Allure command-line tools (`allure-commandline`) require **Java (JRE/JDK)** to be installed on your system and available in your `PATH` or configured via `JAVA_HOME`.

