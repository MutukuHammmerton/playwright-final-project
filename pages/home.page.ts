import { expect, Page } from "@playwright/test";
import { homeLocators } from "../locators/home.locators";

export class HomePage {
  private readonly ui;

  constructor(private readonly page: Page) {
    this.ui = homeLocators(page);
  }

  async goto(): Promise<void> {
    await this.page.goto("/", { waitUntil: "domcontentloaded" });
  }

  async expectHomePageVisible(): Promise<void> {
    await expect(this.ui.homeLink).toBeVisible();
  }

  async openLogin(): Promise<void> {
    await this.ui.signupLoginLink.click({ force: true });
  }

  async openProducts(): Promise<void> {
    await this.ui.productsLink.click({ force: true });
  }

  async openCart(): Promise<void> {
    await this.ui.cartLink.click({ force: true });
  }

  async expectUserLoggedIn(): Promise<void> {
    await expect(this.ui.loggedInUser).toBeVisible();
  }

  async expectDashboard(displayName: string): Promise<void> {
    await expect(this.ui.loggedInUser).toContainText(displayName);
    await expect(this.ui.productsLink).toBeVisible();
    await expect(this.ui.cartLink).toBeVisible();
    await expect(this.ui.logoutLink).toBeVisible();
    await expect(this.ui.deleteAccountLink).toBeVisible();
    await expect(this.ui.signupLoginLink).toBeHidden();
  }

  async logout(): Promise<void> {
    await this.ui.logoutLink.click({ force: true });
  }

  async deleteAccount(): Promise<void> {
    await this.ui.deleteAccountLink.click();
    await expect(this.ui.accountDeletedMessage).toBeVisible();
  }

  async continueAfterAccountDeletion(): Promise<void> {
    await this.ui.continueButton.click();
    await expect(this.ui.signupLoginLink).toBeVisible();
  }
}
