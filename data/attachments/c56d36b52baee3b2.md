# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api-test/api.spec.ts >> Automation Exercise REST endpoints >> GET productsList returns the catalogue
- Location: tests/api-test/api.spec.ts:17:7

# Error details

```
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

# Test source

```ts
  1   | import { expect, test } from "@playwright/test";
  2   | import { ApiClient } from "../../pages/api.client";
  3   | import { toApiPayload } from "../../test-data/api-user";
  4   | import { generateUser } from "../../test-data/user";
  5   | 
  6   | const account = toApiPayload(generateUser());
  7   | 
  8   | test.describe("Automation Exercise REST endpoints", () => {
  9   |   test.describe.configure({ mode: "serial" });
  10  | 
  11  |   let api: ApiClient;
  12  | 
  13  |   test.beforeEach(({ request }) => {
  14  |     api = new ApiClient(request);
  15  |   });
  16  | 
  17  |   test("GET productsList returns the catalogue", async () => {
  18  |     const response = await api.getProducts();
  19  |     expect(response.status()).toBe(200);
  20  | 
> 21  |     const body = JSON.parse(await response.text());
      |                       ^ SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
  22  |     expect(body.responseCode).toBe(200);
  23  |     expect(Array.isArray(body.products)).toBe(true);
  24  |   });
  25  | 
  26  |   test("POST searchProduct returns products matching the term", async () => {
  27  |     const response = await api.searchProduct("top");
  28  |     expect(response.status()).toBe(200);
  29  | 
  30  |     const body = JSON.parse(await response.text());
  31  |     expect(body.responseCode).toBe(200);
  32  |     expect(body.products.length).toBeGreaterThan(0);
  33  |     for (const product of body.products) {
  34  |       expect(product).toHaveProperty("id");
  35  |       expect(product).toHaveProperty("name");
  36  |       expect(product).toHaveProperty("price");
  37  |     }
  38  |   });
  39  | 
  40  |   test("POST searchProduct without a term is a bad request", async () => {
  41  |     const body = JSON.parse(await (await api.searchProduct()).text());
  42  |     expect(body.responseCode).toBe(400);
  43  |     expect(body.message).toBe("Bad request, search_product parameter is missing in POST request.");
  44  |   });
  45  | 
  46  |   test("POST productsList is rejected as an unsupported method", async () => {
  47  |     const response = await api.callWithMethod("post", "/api/productsList");
  48  |     expect(response.status()).toBe(200);
  49  | 
  50  |     const body = JSON.parse(await response.text());
  51  |     expect(body.responseCode).toBe(405);
  52  |     expect(body.message).toBe("This request method is not supported.");
  53  |   });
  54  | 
  55  |   test("POST createAccount registers a new member", async () => {
  56  |     const response = await api.createAccount(account);
  57  |     expect(response.status()).toBe(200);
  58  | 
  59  |     const body = JSON.parse(await response.text());
  60  |     expect(body.responseCode).toBe(201);
  61  |     expect(body.message).toBe("User created!");
  62  |   });
  63  | 
  64  |   test("POST createAccount refuses an email that already exists", async () => {
  65  |     const body = JSON.parse(await (await api.createAccount(account)).text());
  66  |     expect(body.responseCode).toBe(400);
  67  |     expect(body.message).toBe("Email already exists!");
  68  |   });
  69  | 
  70  |   test("POST verifyLogin accepts the new member's credentials", async () => {
  71  |     const response = await api.verifyLogin(account.email, account.password);
  72  |     expect(response.status()).toBe(200);
  73  | 
  74  |     const body = JSON.parse(await response.text());
  75  |     expect(body.responseCode).toBe(200);
  76  |     expect(body.message).toBe("User exists!");
  77  |   });
  78  | 
  79  |   test("POST verifyLogin rejects a wrong password", async () => {
  80  |     const response = await api.verifyLogin(account.email, `${account.password}-wrong`);
  81  |     expect(response.status()).toBe(200);
  82  | 
  83  |     const body = JSON.parse(await response.text());
  84  |     expect(body.responseCode).toBe(404);
  85  |     expect(body.message).toBe("User not found!");
  86  |   });
  87  | 
  88  |   test("POST verifyLogin without a password is a bad request", async () => {
  89  |     const body = JSON.parse(await (await api.verifyLoginWithoutPassword(account.email)).text());
  90  |     expect(body.responseCode).toBe(400);
  91  |     expect(body.message).toBe("Bad request, email or password parameter is missing in POST request.");
  92  |   });
  93  | 
  94  |   test("DELETE verifyLogin is rejected as an unsupported method", async () => {
  95  |     const body = JSON.parse(await (await api.callWithMethod("delete", "/api/verifyLogin")).text());
  96  |     expect(body.responseCode).toBe(405);
  97  |     expect(body.message).toBe("This request method is not supported.");
  98  |   });
  99  | 
  100 |   test("PUT updateAccount changes the member's profile", async () => {
  101 |     const response = await api.updateAccount({
  102 |       ...account,
  103 |       name: `${account.name} Jr`,
  104 |       firstname: "Renamed",
  105 |     });
  106 |     expect(response.status()).toBe(200);
  107 | 
  108 |     const body = JSON.parse(await response.text());
  109 |     expect(body.responseCode).toBe(200);
  110 |     expect(body.message).toBe("User updated!");
  111 |   });
  112 | 
  113 |   test("PUT updateAccount fails for an unknown member", async () => {
  114 |     const stranger = toApiPayload(generateUser());
  115 |     const body = JSON.parse(await (await api.updateAccount(stranger)).text());
  116 |     expect(body.responseCode).toBe(404);
  117 |     expect(body.message).toBe("Account not found!");
  118 |   });
  119 | 
  120 |   test("DELETE deleteAccount removes the member", async () => {
  121 |     const response = await api.deleteAccount(account.email, account.password);
```