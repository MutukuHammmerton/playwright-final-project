import { test } from "@playwright/test";
import { HomePage } from "../../../pages/home.page";
import { LoginPage } from "../../../pages/login.page";
import { registerUserViaApi, removeUserViaApi } from "../../../test-data/account-lifecycle";
import { generateUser } from "../../../test-data/user";

test.describe("Automation Exercise member dashboard", () => {
  const member = generateUser();

  test.beforeAll(async ({ playwright }) => {
    await registerUserViaApi(playwright, member);
  });

  test.afterAll(async ({ playwright }) => {
    await removeUserViaApi(playwright, member);
  });

  test("dashboard shows the member's name and account navigation after sign-in", async ({ page }) => {
    const home = new HomePage(page);
    const login = new LoginPage(page);

    await home.goto();
    await home.openLogin();
    await login.login(member.email, member.password);
    await home.expectDashboard(member.name);
    await home.logout();
  });
});
