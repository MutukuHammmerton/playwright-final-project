import { expect, Page } from "@playwright/test";
import { loginLocators } from "../locators/login.locators";

export class LoginPage {
  readonly ui;

  constructor(private readonly page: Page) {
    this.ui = loginLocators(page);
  }

  async login(email: string, password: string): Promise<void> {
    await this.ui.emailInput.fill(email);
    await this.ui.passwordInput.fill(password);
    await Promise.all([
      this.page.waitForURL((url) => url.pathname === "/", { waitUntil: "domcontentloaded" }),
      this.ui.loginButton.click(),
    ]);
  }

  async attemptLogin(email: string, password: string): Promise<void> {
    await this.ui.emailInput.fill(email);
    await this.ui.passwordInput.fill(password);
    await this.ui.loginButton.click();
  }

  async submitEmpty(): Promise<void> {
    await this.ui.loginButton.click();
  }

  async expectLoginRejected(): Promise<void> {
    await expect(this.ui.loginError).toBeVisible();
  }

  async expectEmailFieldInvalid(reason: "valueMissing" | "typeMismatch"): Promise<void> {
    const flagged = await this.ui.emailInput.evaluate(
      (el, key) => (el as HTMLInputElement).validity[key as "valueMissing"],
      reason,
    );
    expect(flagged).toBe(true);
  }

  async expectPasswordFieldMissing(): Promise<void> {
    const missing = await this.ui.passwordInput.evaluate((el) => (el as HTMLInputElement).validity.valueMissing);
    expect(missing).toBe(true);
  }

  async expectLoginPageVisible(): Promise<void> {
    await expect(this.ui.loginForm).toBeVisible();
  }

  async expectNoLoginError(): Promise<void> {
    await expect(this.ui.loginError).toBeHidden();
  }
}
