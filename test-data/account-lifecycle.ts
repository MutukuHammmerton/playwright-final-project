import { APIRequestContext, PlaywrightWorkerArgs } from "@playwright/test";
import { ApiClient } from "../pages/api.client";
import { toApiPayload } from "./api-user";
import { UserData } from "./user";

type Playwright = PlaywrightWorkerArgs["playwright"];

const SITE_URL = "https://www.automationexercise.com";

async function withApi<T>(playwright: Playwright, run: (api: ApiClient) => Promise<T>): Promise<T> {
  const context: APIRequestContext = await playwright.request.newContext({ baseURL: SITE_URL });
  try {
    return await run(new ApiClient(context));
  } finally {
    await context.dispose();
  }
}

/** Registers the user straight through the API so a UI spec can start from an existing account. */
export async function registerUserViaApi(playwright: Playwright, user: UserData): Promise<void> {
  await withApi(playwright, (api) => api.createAccount(toApiPayload(user)));
}

/** Removes the user through the API; safe to call even if the account no longer exists. */
export async function removeUserViaApi(playwright: Playwright, user: UserData): Promise<void> {
  await withApi(playwright, (api) => api.deleteAccount(user.email, user.password));
}
