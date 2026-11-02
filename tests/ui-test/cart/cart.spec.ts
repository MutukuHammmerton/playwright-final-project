import { test } from "@playwright/test";
import { CartPage } from "../../../pages/cart.page";
import { HomePage } from "../../../pages/home.page";
import { ProductsPage } from "../../../pages/products.page";

test.describe("Automation Exercise dynamic cart behaviour", () => {
  let products: ProductsPage;
  let cart: CartPage;

  test.beforeEach(async ({ page }) => {
    const home = new HomePage(page);
    products = new ProductsPage(page);
    cart = new CartPage(page);
    await home.goto();
    await home.openProducts();
    await products.expectVisible();
  });

  test("hovering a product reveals an add-to-cart overlay that opens a confirmation modal", async () => {
    await products.addFirstProductFromOverlay();
    await products.expectCartModalVisible();
    await products.dismissCartModal();
  });

  test("quantity chosen on the product page carries into the cart", async () => {
    await products.openFirstProduct();
    await products.setQuantity(3);
    await products.addProductToCart();
    await products.openCartFromModal();
    await cart.expectVisible();
    await cart.expectQuantities(["3"]);
  });
});
