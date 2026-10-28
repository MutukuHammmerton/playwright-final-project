import { Page } from "@playwright/test";

export const cartLocators = (page: Page) => ({
  cartTable: page.locator("#cart_info_table"),
  proceedToCheckoutButton: page.getByText("Proceed To Checkout", { exact: true }),
  quantityCells: page.locator(".cart_quantity button"),
  registerLoginLink: page.getByRole("link", { name: "Register / Login", exact: true }),
});
