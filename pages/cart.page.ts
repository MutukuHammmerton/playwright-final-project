import { expect, Page } from "@playwright/test";
import { cartLocators } from "../locators/cart.locators";

export class CartPage {
  private readonly ui;

  constructor(page: Page) {
    this.ui = cartLocators(page);
  }

  async expectVisible(): Promise<void> {
    await expect(this.ui.cartTable).toBeVisible();
  }

  async expectQuantities(expected: string[]): Promise<void> {
    await expect(this.ui.quantityCells).toHaveText(expected);
  }

  async proceedToCheckout(): Promise<void> {
    await this.ui.proceedToCheckoutButton.click();
  }

  async openLogin(): Promise<void> {
    await this.ui.registerLoginLink.click();
  }
}
