import { test } from "@playwright/test";
import { HomePage } from "../../../pages/home.page";
import { LoginPage } from "../../../pages/login.page";
import { registerUserViaApi, removeUserViaApi } from "../../../test-data/account-lifecycle";
import { generateUser } from "../../../test-data/user";

test.describe("Automation Exercise sign-in guards", () => {
  let login: LoginPage;

  test.beforeEach(async ({ page }) => {
    const home = new HomePage(page);
    login = new LoginPage(page);
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
});

test.describe("Automation Exercise member sign-in", () => {
  const member = generateUser();

  test.beforeAll(async ({ playwright }) => {
    await registerUserViaApi(playwright, member);
  });

  test.afterAll(async ({ playwright }) => {
    await removeUserViaApi(playwright, member);
  });

  test("registered shopper can sign in, sign out and sign in again", async ({ page }) => {
    const home = new HomePage(page);
    const login = new LoginPage(page);

    await home.goto();
    await home.expectHomePageVisible();
    await home.openLogin();
    await login.expectLoginPageVisible();
    await login.login(member.email, member.password);
    await home.expectUserLoggedIn();
    await login.expectNoLoginError();

    await home.logout();
    await login.expectLoginPageVisible();
    await login.login(member.email, member.password);
    await home.expectUserLoggedIn();
    await home.logout();
  });
});
