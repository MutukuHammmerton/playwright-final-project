import { APIRequestContext, APIResponse } from "@playwright/test";

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  getProducts(): Promise<APIResponse> {
    return this.request.get("/api/productsList");
  }

  searchProduct(searchTerm?: string): Promise<APIResponse> {
    return this.request.post("/api/searchProduct", {
      form: searchTerm === undefined ? {} : { search_product: searchTerm },
    });
  }

  verifyLoginWithoutPassword(email: string): Promise<APIResponse> {
    return this.request.post("/api/verifyLogin", { form: { email } });
  }

  verifyLogin(email: string, password: string): Promise<APIResponse> {
    return this.request.post("/api/verifyLogin", { form: { email, password } });
  }

  createAccount(payload: Record<string, string>): Promise<APIResponse> {
    return this.request.post("/api/createAccount", { form: payload });
  }

  updateAccount(payload: Record<string, string>): Promise<APIResponse> {
    return this.request.put("/api/updateAccount", { form: payload });
  }

  deleteAccount(email: string, password: string): Promise<APIResponse> {
    return this.request.delete("/api/deleteAccount", { form: { email, password } });
  }

  /** Calls an endpoint with an HTTP method it does not support. */
  callWithMethod(method: "post" | "put" | "delete" | "get", path: string): Promise<APIResponse> {
    return this.request[method](path);
  }
}
