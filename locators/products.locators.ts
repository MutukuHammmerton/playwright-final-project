import { Page } from "@playwright/test";

export const productsLocators = (page: Page) => ({
  productsHeading: page.getByRole("heading", { name: "All Products", exact: true }),
  firstViewProductLink: page.locator('a[href^="/product_details/"]').first(),
  productInformation: page.locator(".product-information"),
  addToCartButton: page.getByRole("button", { name: /Add to cart/ }),
  firstProductCard: page.locator(".product-image-wrapper").first(),
  firstProductOverlayAdd: page.locator(".product-image-wrapper").first().locator(".product-overlay .add-to-cart"),
  cartModal: page.locator("#cartModal"),
  modalContinueButton: page.locator("#cartModal").getByRole("button", { name: "Continue Shopping" }),
  quantityInput: page.locator("#quantity"),
  viewCartLink: page.getByRole("link", { name: "View Cart", exact: true }),
});
