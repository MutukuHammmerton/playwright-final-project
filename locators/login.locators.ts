import { Page } from "@playwright/test";

export const loginLocators = (page: Page) => {
  const loginForm = page.locator("form").filter({ hasText: "Login" }).first();

  return {
    loginForm,
    emailInput: loginForm.getByPlaceholder("Email Address"),
    passwordInput: loginForm.getByRole("textbox", { name: "Password" }),
    loginButton: loginForm.getByRole("button", { name: "Login" }),
    loginError: page.getByText("Your email or password is incorrect!"),
  };
};
