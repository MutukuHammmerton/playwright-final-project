import { expect, Page } from "@playwright/test";
import { signupLocators } from "../locators/signup.locators";
import { UserData } from "../test-data/user";

export class SignupPage {
  readonly ui;

  constructor(page: Page) {
    this.ui = signupLocators(page);
  }

  async attemptSignup(name: string, email: string): Promise<void> {
    await this.ui.nameInput.fill(name);
    await this.ui.emailInput.fill(email);
    await this.ui.signupButton.click();
  }

  async startSignup(name: string, email: string): Promise<void> {
    await this.attemptSignup(name, email);
    await expect(this.ui.accountInformationHeading).toBeVisible();
  }

  async completeSignup(user: UserData): Promise<void> {
    await this.ui.titleRadio(user.title).check();
    await this.ui.password.fill(user.password);
    await this.ui.days.selectOption(user.birthDay, { force: true });
    await this.ui.months.selectOption(user.birthMonth, { force: true });
    await this.ui.years.selectOption(user.birthYear, { force: true });
    await this.ui.newsletter.check({ force: true });
    await this.ui.optin.check({ force: true });
    await this.ui.firstName.fill(user.firstName);
    await this.ui.lastName.fill(user.lastName);
    await this.ui.company.fill(user.company);
    await this.ui.address.fill(user.address);
    await this.ui.address2.fill(user.address2);
    await this.ui.country.selectOption({ label: user.country });
    await this.ui.state.fill(user.state);
    await this.ui.city.fill(user.city);
    await this.ui.zipcode.fill(user.zipcode);
    await this.ui.mobileNumber.fill(user.phone);
    await this.ui.createAccountButton.click({ force: true });
    await expect(this.ui.accountCreatedMessage).toBeVisible();
  }

  async continueToApplication(): Promise<void> {
    await this.ui.continueButton.click();
  }

  async submitEmpty(): Promise<void> {
    await this.ui.signupButton.click();
  }

  async expectStillOnSignupForm(): Promise<void> {
    await expect(this.ui.accountInformationHeading).toBeHidden();
    const nameMissing = await this.ui.nameInput.evaluate((el) => (el as HTMLInputElement).validity.valueMissing);
    expect(nameMissing).toBe(true);
  }

  async expectEmailAlreadyExists(): Promise<void> {
    await expect(this.ui.emailAlreadyExistsError).toBeVisible();
  }
}
