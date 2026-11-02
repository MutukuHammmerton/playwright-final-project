import { test } from "@playwright/test";
import { HomePage } from "../../../pages/home.page";
import { LoginPage } from "../../../pages/login.page";
import { SignupPage } from "../../../pages/signup.page";
import { removeUserViaApi } from "../../../test-data/account-lifecycle";
import { generateUser } from "../../../test-data/user";

test.describe("Automation Exercise registration", () => {
  test.describe.configure({ mode: "serial" });

  const newcomer = generateUser();
  let home: HomePage;
  let signup: SignupPage;

  test.beforeEach(({ page }) => {
    home = new HomePage(page);
    signup = new SignupPage(page);
  });

  test.afterAll(async ({ playwright }) => {
    await removeUserViaApi(playwright, newcomer);
  });

  test("brand-new visitor can register and lands logged in", async () => {
    await home.goto();
    await home.openLogin();
    await signup.startSignup(newcomer.name, newcomer.email);
    await signup.completeSignup(newcomer);
    await signup.continueToApplication();
    await home.expectUserLoggedIn();
    await home.logout();
  });

  test("registering with an email that is taken shows an error", async () => {
    await home.goto();
    await home.openLogin();
    await signup.attemptSignup(newcomer.name, newcomer.email);
    await signup.expectEmailAlreadyExists();
  });
});

test.describe("Automation Exercise registration form guard", () => {
  test("signup form will not submit when left blank", async ({ page }) => {
    const home = new HomePage(page);
    const login = new LoginPage(page);
    const signup = new SignupPage(page);

    await home.goto();
    await home.openLogin();
    await login.expectLoginPageVisible();
    await signup.submitEmpty();
    await signup.expectStillOnSignupForm();
  });
});
