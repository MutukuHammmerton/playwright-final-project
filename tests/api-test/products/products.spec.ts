import { expect, test } from "@playwright/test";
import { ApiClient } from "../../../pages/api.client";

test.describe("Automation Exercise product endpoints", () => {
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
});
