import { Download, expect, Page } from "@playwright/test";
import { checkoutLocators } from "../locators/checkout.locators";
import { PaymentData } from "../test-data/payment";

export class CheckoutPage {
  private readonly ui;

  constructor(private readonly page: Page) {
    this.ui = checkoutLocators(page);
  }

  async placeOrder(): Promise<void> {
    await this.ui.placeOrderLink.click();
  }

  async payAndConfirmOrder(payment: PaymentData): Promise<void> {
    await this.ui.nameOnCardInput.fill(payment.nameOnCard);
    await this.ui.cardNumberInput.fill(payment.cardNumber);
    await this.ui.cvcInput.fill(payment.cvc);
    await this.ui.expiryMonthInput.fill(payment.expiryMonth);
    await this.ui.expiryYearInput.fill(payment.expiryYear);
    await this.ui.payAndConfirmButton.click();
  }

  async expectOrderPlaced(): Promise<void> {
    await expect(this.ui.orderPlacedMessage).toBeVisible({ timeout: 10000 });
  }

  async downloadInvoice(): Promise<Download> {
    const downloadPromise = this.page.waitForEvent("download");
    await this.ui.downloadInvoiceLink.click();
    return downloadPromise;
  }

  async continueShopping(): Promise<void> {
    await this.ui.continueButton.waitFor({ state: "visible", timeout: 10000 });
    await this.ui.continueButton.click();
  }
}
