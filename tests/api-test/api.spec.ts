import { expect, test } from "@playwright/test";
import { ApiClient } from "../../pages/api.client";
import { toApiPayload } from "../../test-data/api-user";
import { generateUser } from "../../test-data/user";

const account = toApiPayload(generateUser());

test.describe("Automation Exercise REST endpoints", () => {
  test.describe.configure({ mode: "serial" });

  let api: ApiClient;

  test.beforeEach(({ request }) => {
    api = new ApiClient(request);
  });

  test("GET productsList returns the catalogue", async () => {
    const response = await api.getProducts();
    expect(response.status()).toBe(200);

    const body = JSON.parse(await response.text());
    expect(body.responseCode).toBe(200);
    expect(Array.isArray(body.products)).toBe(true);
  });

  test("POST searchProduct returns products matching the term", async () => {
    const response = await api.searchProduct("top");
    expect(response.status()).toBe(200);

    const body = JSON.parse(await response.text());
    expect(body.responseCode).toBe(200);
    expect(body.products.length).toBeGreaterThan(0);
    for (const product of body.products) {
      expect(product).toHaveProperty("id");
      expect(product).toHaveProperty("name");
      expect(product).toHaveProperty("price");
    }
  });

  test("POST searchProduct without a term is a bad request", async () => {
    const body = JSON.parse(await (await api.searchProduct()).text());
    expect(body.responseCode).toBe(400);
    expect(body.message).toBe("Bad request, search_product parameter is missing in POST request.");
  });

  test("POST productsList is rejected as an unsupported method", async () => {
    const response = await api.callWithMethod("post", "/api/productsList");
    expect(response.status()).toBe(200);

    const body = JSON.parse(await response.text());
    expect(body.responseCode).toBe(405);
    expect(body.message).toBe("This request method is not supported.");
  });

  test("POST createAccount registers a new member", async () => {
    const response = await api.createAccount(account);
    expect(response.status()).toBe(200);

    const body = JSON.parse(await response.text());
    expect(body.responseCode).toBe(201);
    expect(body.message).toBe("User created!");
  });

  test("POST createAccount refuses an email that already exists", async () => {
    const body = JSON.parse(await (await api.createAccount(account)).text());
    expect(body.responseCode).toBe(400);
    expect(body.message).toBe("Email already exists!");
  });

  test("POST verifyLogin accepts the new member's credentials", async () => {
    const response = await api.verifyLogin(account.email, account.password);
    expect(response.status()).toBe(200);

    const body = JSON.parse(await response.text());
    expect(body.responseCode).toBe(200);
    expect(body.message).toBe("User exists!");
  });

  test("POST verifyLogin rejects a wrong password", async () => {
    const response = await api.verifyLogin(account.email, `${account.password}-wrong`);
    expect(response.status()).toBe(200);

    const body = JSON.parse(await response.text());
    expect(body.responseCode).toBe(404);
    expect(body.message).toBe("User not found!");
  });

  test("POST verifyLogin without a password is a bad request", async () => {
    const body = JSON.parse(await (await api.verifyLoginWithoutPassword(account.email)).text());
    expect(body.responseCode).toBe(400);
    expect(body.message).toBe("Bad request, email or password parameter is missing in POST request.");
  });

  test("DELETE verifyLogin is rejected as an unsupported method", async () => {
    const body = JSON.parse(await (await api.callWithMethod("delete", "/api/verifyLogin")).text());
    expect(body.responseCode).toBe(405);
    expect(body.message).toBe("This request method is not supported.");
  });

  test("PUT updateAccount changes the member's profile", async () => {
    const response = await api.updateAccount({
      ...account,
      name: `${account.name} Jr`,
      firstname: "Renamed",
    });
    expect(response.status()).toBe(200);

    const body = JSON.parse(await response.text());
    expect(body.responseCode).toBe(200);
    expect(body.message).toBe("User updated!");
  });

  test("PUT updateAccount fails for an unknown member", async () => {
    const stranger = toApiPayload(generateUser());
    const body = JSON.parse(await (await api.updateAccount(stranger)).text());
    expect(body.responseCode).toBe(404);
    expect(body.message).toBe("Account not found!");
  });

  test("DELETE deleteAccount removes the member", async () => {
    const response = await api.deleteAccount(account.email, account.password);
    expect(response.status()).toBe(200);

    const body = JSON.parse(await response.text());
    expect(body.responseCode).toBe(200);
    expect(body.message).toBe("Account deleted!");
  });

  test("DELETE deleteAccount fails once the member is gone", async () => {
    const body = JSON.parse(await (await api.deleteAccount(account.email, account.password)).text());
    expect(body.responseCode).toBe(404);
    expect(body.message).toBe("Account not found!");
  });
});
