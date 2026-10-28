# Automation Exercise – Playwright Test Suite

UI and API test automation for [Automation Exercise](https://www.automationexercise.com), built with **Playwright** and **TypeScript**, using the Page Object Model, faker-generated test data, Allure reporting and a GitHub Actions pipeline.

## Project structure

```
.
├── .github/workflows/playwright.yml   # CI/CD pipeline
├── locators/                          # Selectors only, one file per page
│   ├── cart.locators.ts
│   ├── checkout.locators.ts
│   ├── home.locators.ts
│   ├── login.locators.ts
│   ├── products.locators.ts
│   └── signup.locators.ts
├── pages/                             # Page objects (actions + assertions)
│   ├── api.client.ts                  # Wrapper around the REST endpoints
│   ├── cart.page.ts
│   ├── checkout.page.ts
│   ├── home.page.ts
│   ├── login.page.ts
│   ├── products.page.ts
│   └── signup.page.ts
├── test-data/                         # faker data generators
│   ├── api-user.ts
│   ├── payment.ts
│   └── user.ts
├── tests/
│   ├── api-test/api.spec.ts           # All API tests
│   └── ui-test/ui.spec.ts             # All UI tests
└── playwright.config.ts
```

**How the layers fit together:** `locators/` knows *where* things are, `pages/` knows *what you can do* with them, and the specs only describe *scenarios*. Test data is generated fresh with faker on every run, so no credentials are stored in the repository.

## Test coverage

### UI (`tests/ui-test/ui.spec.ts`)

| Area | What is checked |
| --- | --- |
| Sign-in guards | Unknown credentials show an error; blank login form is blocked; badly formatted email is flagged; blank signup form is blocked |
| Dynamic cart behaviour | Hover overlay reveals "Add to cart" and opens a confirmation modal; quantity chosen on the product page appears in the cart |
| Storefront journey (serial) | New user signup, duplicate email rejected, login / logout / login, dashboard validation, select product → add to cart → checkout → payment → invoice download |

The storefront journey registers one faker user, reuses it across the flow and deletes it through the API when finished.

### API (`tests/api-test/api.spec.ts`)

| API | Endpoint | Checks |
| --- | --- | --- |
| 1 | `GET /api/productsList` | 200, product list returned |
| 5 | `POST /api/searchProduct` | matches returned; missing term → 400 |
| 7 | `POST /api/verifyLogin` | valid → 200; wrong password → 404; missing password → 400 |
| 11 | `POST /api/createAccount` | created → 201; duplicate email → 400 |
| 13 | `PUT /api/updateAccount` | updated → 200; unknown member → 404 |
| 12 | `DELETE /api/deleteAccount` | deleted → 200; already deleted → 404 |
| – | Unsupported methods | `POST productsList`, `DELETE verifyLogin` → 405 |

The site always answers with HTTP 200 and puts the real result in the JSON `responseCode`, so tests assert both the HTTP status and the `responseCode` / `message` in the body.

## Getting started

**Prerequisites:** Node.js 18+ and npm.

```bash
npm ci
npx playwright install --with-deps chromium
```

No `.env` file or secrets are needed.

## Running the tests

```bash
npm test                 # everything
npm run test:ui          # UI tests only
npm run test:api         # API tests only
npx playwright test --headed          # watch the browser
npx playwright test --ui              # Playwright UI mode
```

## Reports

Every run produces an HTML report and Allure results.

```bash
npx playwright show-report      # Playwright HTML report
npm run allure:generate         # build the Allure report from allure-results/
npm run allure:open             # open the generated report
npm run allure:serve            # generate and serve in one step
```

## CI/CD

`.github/workflows/playwright.yml` runs on every **push** and **pull request** to `main` / `master`:

1. Installs dependencies and the Chromium browser.
2. Runs the full suite.
3. Generates the Allure report.
4. Uploads the Playwright and Allure reports as build artifacts (30-day retention).
5. On pushes, publishes the Allure report to the `gh-pages` branch. To view it, enable **Settings → Pages → Deploy from branch → `gh-pages`** in the repository.

## Notes

- Only Chromium is enabled in `playwright.config.ts`; Firefox and WebKit are commented out and can be re-enabled there.
- The UI storefront journey is `serial` because each step depends on the account created in the first step.
