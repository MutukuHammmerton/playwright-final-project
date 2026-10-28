import { expect, test } from "@playwright/test";
import { CartPage } from "../../pages/cart.page";
import { CheckoutPage } from "../../pages/checkout.page";
import { HomePage } from "../../pages/home.page";
import { LoginPage } from "../../pages/login.page";
import { ProductsPage } from "../../pages/products.page";
import { SignupPage } from "../../pages/signup.page";
import { ApiClient } from "../../pages/api.client";
import { generatePayment } from "../../test-data/payment";
import { generateUser } from "../../test-data/user";

// One faker-generated shopper is shared by the whole flow and removed at the end.
const shopper = generateUser();
const payment = generatePayment();

test.describe("Automation Exercise sign-in guards", () => {
  let home: HomePage;
  let login: LoginPage;
  let signup: SignupPage;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    login = new LoginPage(page);
    signup = new SignupPage(page);
    await home.goto();
    await home.openLogin();
    await login.expectLoginPageVisible();
  });

  test("unknown email and password is turned away with an error", async () => {
    const stranger = generateUser();
    await login.attemptLogin(stranger.email, stranger.password);
    await login.expectLoginRejected();
  });

  test("login form will not submit when left blank", async () => {
    await login.submitEmpty();
    await login.expectEmailFieldInvalid("valueMissing");
    await login.expectLoginPageVisible();
  });

  test("login form flags an email without a proper address format", async () => {
    await login.attemptLogin("not-an-email", generateUser().password);
    await login.expectEmailFieldInvalid("typeMismatch");
  });

  test("signup form will not submit when left blank", async () => {
    await signup.submitEmpty();
    await signup.expectStillOnSignupForm();
  });
});

test.describe("Automation Exercise dynamic cart behaviour", () => {
  let home: HomePage;
  let products: ProductsPage;
  let cart: CartPage;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    products = new ProductsPage(page);
    cart = new CartPage(page);
    await home.goto();
    await home.openProducts();
    await products.expectVisible();
  });

  test("hovering a product reveals an add-to-cart overlay that opens a confirmation modal", async () => {
    await products.hoverFirstProduct();
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

test.describe("Automation Exercise storefront journey", () => {
  test.describe.configure({ mode: "serial" });

  let home: HomePage;
  let login: LoginPage;
  let signup: SignupPage;
  let products: ProductsPage;
  let cart: CartPage;
  let checkout: CheckoutPage;

  test.beforeEach(({ page }) => {
    home = new HomePage(page);
    login = new LoginPage(page);
    signup = new SignupPage(page);
    products = new ProductsPage(page);
    cart = new CartPage(page);
    checkout = new CheckoutPage(page);
  });

  test.afterAll(async ({ playwright }) => {
    const api = await playwright.request.newContext({
      baseURL: "https://www.automationexercise.com",
    });
    await new ApiClient(api).deleteAccount(shopper.email, shopper.password);
    await api.dispose();
  });

  test("brand-new visitor can register and lands logged in", async () => {
    await home.goto();
    await home.openLogin();
    await signup.startSignup(shopper.name, shopper.email);
    await signup.completeSignup(shopper);
    await signup.continueToApplication();
    await home.expectUserLoggedIn();
    await home.logout();
  });

  test("registering with an email that is taken shows an error", async () => {
    await home.goto();
    await home.openLogin();
    await signup.attemptSignup(shopper.name, shopper.email);
    await signup.expectEmailAlreadyExists();
  });

  test("registered shopper can sign in, sign out and sign in again", async () => {
    await home.goto();
    await home.expectHomePageVisible();
    await home.openLogin();
    await login.expectLoginPageVisible();
    await login.login(shopper.email, shopper.password);
    await home.expectUserLoggedIn();
    await login.expectNoLoginError();

    await home.logout();
    await login.expectLoginPageVisible();
    await login.login(shopper.email, shopper.password);
    await home.expectUserLoggedIn();
    await home.logout();
  });

  test("dashboard shows the member's name and account navigation after sign-in", async () => {
    await home.goto();
    await home.openLogin();
    await login.login(shopper.email, shopper.password);
    await home.expectDashboard(shopper.name);
    await home.logout();
  });

  test("guest picks a product, signs in at the cart and pays for the order", async () => {
    test.setTimeout(60000);

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
    await login.login(shopper.email, shopper.password);
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
