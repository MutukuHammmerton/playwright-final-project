# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui-test/ui.spec.ts >> Automation Exercise storefront journey >> brand-new visitor can register and lands logged in
- Location: tests/ui-test/ui.spec.ts:111:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('a[href="/login"]')

```

# Test source

```ts
  1  | import { expect, Page } from "@playwright/test";
  2  | import { homeLocators } from "../locators/home.locators";
  3  | 
  4  | export class HomePage {
  5  |   private readonly ui;
  6  | 
  7  |   constructor(private readonly page: Page) {
  8  |     this.ui = homeLocators(page);
  9  |   }
  10 | 
  11 |   async goto(): Promise<void> {
  12 |     await this.page.goto("/", { waitUntil: "domcontentloaded" });
  13 |   }
  14 | 
  15 |   async expectHomePageVisible(): Promise<void> {
  16 |     await expect(this.ui.homeLink).toBeVisible();
  17 |   }
  18 | 
  19 |   async openLogin(): Promise<void> {
> 20 |     await this.ui.signupLoginLink.click({ force: true });
     |                                   ^ Error: locator.click: Test timeout of 30000ms exceeded.
  21 |   }
  22 | 
  23 |   async openProducts(): Promise<void> {
  24 |     await this.ui.productsLink.click({ force: true });
  25 |   }
  26 | 
  27 |   async openCart(): Promise<void> {
  28 |     await this.ui.cartLink.click({ force: true });
  29 |   }
  30 | 
  31 |   async expectUserLoggedIn(): Promise<void> {
  32 |     await expect(this.ui.loggedInUser).toBeVisible();
  33 |   }
  34 | 
  35 |   async expectDashboard(displayName: string): Promise<void> {
  36 |     await expect(this.ui.loggedInUser).toContainText(displayName);
  37 |     await expect(this.ui.productsLink).toBeVisible();
  38 |     await expect(this.ui.cartLink).toBeVisible();
  39 |     await expect(this.ui.logoutLink).toBeVisible();
  40 |     await expect(this.ui.deleteAccountLink).toBeVisible();
  41 |     await expect(this.ui.signupLoginLink).toBeHidden();
  42 |   }
  43 | 
  44 |   async logout(): Promise<void> {
  45 |     await this.ui.logoutLink.click({ force: true });
  46 |   }
  47 | 
  48 |   async deleteAccount(): Promise<void> {
  49 |     await this.ui.deleteAccountLink.click();
  50 |     await expect(this.ui.accountDeletedMessage).toBeVisible();
  51 |   }
  52 | 
  53 |   async continueAfterAccountDeletion(): Promise<void> {
  54 |     await this.ui.continueButton.click();
  55 |     await expect(this.ui.signupLoginLink).toBeVisible();
  56 |   }
  57 | }
  58 | 
```