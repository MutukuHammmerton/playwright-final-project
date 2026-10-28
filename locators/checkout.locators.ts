import { Page } from "@playwright/test";

export const checkoutLocators = (page: Page) => ({
  placeOrderLink: page.getByRole("link", { name: "Place Order", exact: true }),
  nameOnCardInput: page.locator('input[name="name_on_card"]'),
  cardNumberInput: page.locator('input[name="card_number"]'),
  cvcInput: page.locator('input[name="cvc"]'),
  expiryMonthInput: page.locator('input[name="expiry_month"]'),
  expiryYearInput: page.locator('input[name="expiry_year"]'),
  payAndConfirmButton: page.getByRole("button", { name: "Pay and Confirm Order" }),
  orderPlacedMessage: page.locator('[data-qa="order-placed"]'),
  downloadInvoiceLink: page.getByRole("link", { name: "Download Invoice", exact: true }),
  continueButton: page.locator('[data-qa="continue-button"]'),
});
