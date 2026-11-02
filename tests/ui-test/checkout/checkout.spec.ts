import { expect, test } from "@playwright/test";
import { CartPage } from "../../../pages/cart.page";
import { CheckoutPage } from "../../../pages/checkout.page";
import { HomePage } from "../../../pages/home.page";
import { LoginPage } from "../../../pages/login.page";
import { ProductsPage } from "../../../pages/products.page";
import { registerUserViaApi, removeUserViaApi } from "../../../test-data/account-lifecycle";
import { generatePayment } from "../../../test-data/payment";
import { generateUser } from "../../../test-data/user";

test.describe("Automation Exercise checkout", () => {
  const buyer = generateUser();
  const payment = generatePayment();

  test.beforeAll(async ({ playwright }) => {
    await registerUserViaApi(playwright, buyer);
  });

  test.afterAll(async ({ playwright }) => {
    await removeUserViaApi(playwright, buyer);
  });

  test("guest picks a product, signs in at the cart and pays for the order", async ({ page }) => {
    test.setTimeout(60000);

    const home = new HomePage(page);
    const login = new LoginPage(page);
    const products = new ProductsPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await home.goto();
    await home.expectHomePageVisible();
    await home.openProducts();
    await products.expectVisible();
    await products.openFirstProduct();
    await products.addProductToCart();
    await products.openCartFromModal();

    await cart.expectVisible();
    await cart.proceedToCheckout();
    await cart.openLogin();

    await login.expectLoginPageVisible();
    await login.login(buyer.email, buyer.password);
    await home.expectUserLoggedIn();
    await home.openCart();
    await cart.expectVisible();
    await cart.proceedToCheckout();

    await checkout.placeOrder();
    await checkout.payAndConfirmOrder(payment);
    await checkout.expectOrderPlaced();

    const invoice = await checkout.downloadInvoice();
    expect(invoice.suggestedFilename()).toMatch(/invoice/i);

    await checkout.continueShopping();
    await home.expectHomePageVisible();
  });
});
