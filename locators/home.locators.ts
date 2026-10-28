import { Page } from "@playwright/test";

export const homeLocators = (page: Page) => ({
  homeLink: page.getByRole("link", { name: /Home/ }),
  signupLoginLink: page.locator('a[href="/login"]'),
  loggedInUser: page.getByText(/Logged in as/),
  deleteAccountLink: page.getByRole("link", { name: /Delete Account/ }),
  accountDeletedMessage: page.getByText("Account Deleted!"),
  continueButton: page.locator('[data-qa="continue-button"]'),
  logoutLink: page.locator('a[href="/logout"]'),
  productsLink: page.locator('a[href="/products"]').first(),
  cartLink: page.locator('a[href="/view_cart"]').first(),
});
