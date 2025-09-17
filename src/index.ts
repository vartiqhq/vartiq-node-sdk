import type {
  Project,
  App,
  Webhook,
  WebhookMessage,
  CreateWebhookInput,
  UpdateWebhookInput,
  WebhookMessageTarget,
  ApiErrorResponse,
  ApiSuccessResponse,
} from "./types/index";
import crypto from "crypto";
import axios, { AxiosInstance } from "axios";

export * from "./types/index";

class ProjectAPI {
  constructor(private sdk: Vartiq) {}

  async create(data: { name: string; description: string }): Promise<ApiSuccessResponse<Project>> {
    const res = await this.sdk.request<ApiSuccessResponse<Project>>(`/projects`, {
      method: "POST",
      data: JSON.stringify(data),
    });
    return res;
  }

  async list(): Promise<ApiSuccessResponse<Project[]>> {
    const res = await this.sdk.request<ApiSuccessResponse<Project[]>>(`/projects`, {
      method: "GET",
    });
    return res;
  }

  async get(id: string): Promise<ApiSuccessResponse<Project>> {
    const res = await this.sdk.request<ApiSuccessResponse<Project>>(`/projects/${id}`);
    return res;
  }

  async update(id: string, data: Partial<Project>): Promise<ApiSuccessResponse<Project>> {
    const res = await this.sdk.request<ApiSuccessResponse<Project>>(`/projects/${id}`, {
      method: "PUT",
      data: JSON.stringify(data),
    });
    return res;
  }

  async delete(id: string): Promise<{ message: string; success: boolean }> {
    return this.sdk.request(`/projects/${id}`, { method: "DELETE" });
  }
}

class AppAPI {
  constructor(private sdk: Vartiq) {}

  async create(data: {
    name: string;
    projectId: string;
    description?: string;
  }): Promise<ApiSuccessResponse<App>> {
    const res = await this.sdk.request<ApiSuccessResponse<App>>(`/apps`, {
      method: "POST",
      data: JSON.stringify(data),
    });
    return res;
  }

  async list(projectId: string): Promise<ApiSuccessResponse<App[]>> {
    const res = await this.sdk.request<ApiSuccessResponse<App[]>>(
      `/apps?projectId=${projectId}`,
      {
        method: "GET",.
      },
    );
    return res;
  }

  async get(id: string): Promise<ApiSuccessResponse<App>> {
    const res = await this.sdk.request<ApiSuccessResponse<App>>(`/apps/${id}`);
    return res;
  }

  async update(id: string, data: Partial<App>): Promise<ApiSuccessResponse<App>> {
    const res = await this.sdk.request<ApiSuccessResponse<App>>(`/apps/${id}`, {
      method: "PUT",
      data: JSON.stringify(data),
    });
    return res;
  }

  async delete(id: string): Promise<{ message: string; success: boolean }> {
    return this.sdk.request(`/apps/${id}`, { method: "DELETE" });
  }
}

class WebhookAPI {
  public message: WebhookMessageAPI;
  constructor(private sdk: Vartiq) {
    this.message = new WebhookMessageAPI(sdk);
  }

  async create(data: CreateWebhookInput): Promise<ApiSuccessResponse<Webhook>> {
    // Runtime validation
    if (data.authMethod === "basic" && (!data.userName || !data.password)) {
      throw new Error("For basic auth, userName and password are required");
    }

    if (data.authMethod === "hmac" && (!data.hmacHeader || !data.hmacSecret)) {
      throw new Error("For hmac auth, hmacHeader and hmacSecret are required");
    }

    if (data.authMethod === "apiKey" && (!data.apiKey || !data.apiKeyHeader)) {
      throw new Error("For apiKey auth, apiKey and apiKeyHeader are required");
    }

    const basePayload = {
      name: data.name,
      url: data.url,
      appId: data.appId,
      customHeaders: data.customHeaders || [],
      authMethod: data.authMethod,
    };

    let authPayload = {};

    if (data.authMethod === "basic") {
      authPayload = {
        userName: data.userName,
        password: data.password,
      };
    } else if (data.authMethod === "hmac") {
      authPayload = {
        hmacHeader: data.hmacHeader,
        hmacSecret: data.hmacSecret,
      };
    } else if (data.authMethod === "apiKey") {
      authPayload = {
        apiKey: data.apiKey,
        apiKeyHeader: data.apiKeyHeader,
      };
    }

    const res = await this.sdk.request<ApiSuccessResponse<Webhook>>(`/webhooks`, {
      method: "POST",
      data: JSON.stringify({
        ...basePayload,
        ...authPayload,
      }),
    });
    return res;
  }
  
  async list(appId: string): Promise<ApiSuccessResponse<Webhook[]>> {
    const res = await this.sdk.request<ApiSuccessResponse<Webhook[]>>(
      `/webhooks?appId=${appId}`,
    );
    return res;
  }

  async get(id: string): Promise<ApiSuccessResponse<Webhook>> {
    const res = await this.sdk.request<ApiSuccessResponse<Webhook>>(`/webhooks/${id}`);
    return res;
  }

  async update(id: string, data: UpdateWebhookInput): Promise<ApiSuccessResponse<Webhook>> {
    const basePayload: {
      name?: string;
      url?: string;
      customHeaders?: Array<{ key: string; value: string }>;
      authMethod?: "basic" | "hmac" | "apiKey";
    } = {};

    const { name, url, customHeaders } = data;
    if (typeof name !== "undefined") basePayload.name = name;
    if (typeof url !== "undefined") basePayload.url = url;
    if (typeof customHeaders !== "undefined")
      basePayload.customHeaders = customHeaders || [];

    let authPayload: Record<string, unknown> = {};

    if ("authMethod" in data && data.authMethod) {
      basePayload.authMethod = data.authMethod;
      switch (data.authMethod) {
        case "basic": {
          const { userName, password } = data;
          if (!userName || !password) {
            throw new Error(
              "For basic auth, userName and password are required",
            );
          }
          authPayload = { userName, password };
          break;
        }
        case "hmac": {
          const { hmacHeader, hmacSecret } = data;
          if (!hmacHeader || !hmacSecret) {
            throw new Error(
              "For hmac auth, hmacHeader and hmacSecret are required",
            );
          }
          authPayload = { hmacHeader, hmacSecret };
          break;
        }
        case "apiKey": {
          const { apiKey, apiKeyHeader } = data;
          if (!apiKey || !apiKeyHeader) {
            throw new Error(
              "For apiKey auth, apiKey and apiKeyHeader are required",
            );
          }
          authPayload = { apiKey, apiKeyHeader };
          break;
        }
      }
    }

    const res = await this.sdk.request<ApiSuccessResponse<Webhook>>(`/webhooks/${id}`, {
      method: "PUT",
      data: JSON.stringify({
        ...basePayload,
        ...authPayload,
      }),
    });
    return res;
  }

  async delete(id: string): Promise<{ message: string; success: boolean }> {
    return this.sdk.request(`/webhooks/${id}`, { method: "DELETE" });
  }
}

class WebhookMessageAPI {
  constructor(private sdk: Vartiq) {}

  async create(
    target: WebhookMessageTarget,
    payload: object,
  ): Promise<ApiSuccessResponse<WebhookMessage>> {
    // Normalize target to object shape the API expects
    let body: Record<string, unknown>;
    if ("appId" in target) {
      body = { appId: target.appId, payload };
    } else if ("webhookId" in target) {
      body = { webhookId: target.webhookId, payload };
    } else {
      throw new Error(
        "Invalid target provided. Use { appId } or { webhookId }.",
      );
    }

    const res = await this.sdk.request<ApiSuccessResponse<WebhookMessage>>(`/webhook-messages`, {
      method: "POST",
      data: JSON.stringify(body),
    });
    return res;
  }
}

const _testFetchSymbol = Symbol("testFetch");

export class Vartiq {
  private apiKey: string;
  private axiosInstance: AxiosInstance;

  public project: ProjectAPI;
  public app: AppAPI;
  public webhook: WebhookAPI;

  constructor(apiKey: string, baseUrl?: string) {
    if (!apiKey) throw new Error("API key is required");

    this.apiKey = apiKey;

    this.axiosInstance = axios.create({
      baseURL: (baseUrl || "https://api.us.vartiq.com").replace(/\/$/, ""),
      headers: {
        "x-api-key": this.apiKey,
        "Content-Type": "application/json",
      },
    });

    this.project = new ProjectAPI(this);
    this.app = new AppAPI(this);
    this.webhook = new WebhookAPI(this);
  }

  async request<T>(
    path: string,
    options: { method?: string; data?: unknown } = {},
  ): Promise<T> {
    try {
      const { method = "GET", data } = options;
      const response = await this.axiosInstance.request<T>({
        url: path,
        method,
        data,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data: ApiErrorResponse | undefined = error.response?.data;

      let message: string | undefined;

      if (
        data &&
        typeof data === "object" &&
        "errors" in data &&
        Array.isArray(data.errors) &&
        data.errors.length > 0
      ) {
        message = data.errors[0].message;
      } else if (data && typeof data === "object" && "message" in data) {
        const msg = (data as { message?: unknown }).message;
        message = typeof msg === "string" ? msg : String(msg);
      } else {
        message = error instanceof Error ? error.message : String(error);
      }

      return new Error(
        `Vartiq Error ${status ? ` (${status})` : ""}: ${message}`,
      );
    }

    return new Error("Unknown error occurred");
  }

  public verify(
    payload: object,
    signature: string,
    webhookSecret: string,
  ): object {
    return verifyWebhookSignature(payload, signature, webhookSecret);
  }
}

// For test use only
export const __internal = { _testFetchSymbol };

/**
 * Verifies a webhook signature.
 * @param payload The payload object received.
 * @param signature The signature string to verify.
 * @param webhookSecret The secret used to generate the signature.
 * @throws Error if verification fails.
 */
export function verifyWebhookSignature(
  payload: object,
  signature: string,
  webhookSecret: string,
): object {
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(JSON.stringify(payload))
    .digest("hex");
  if (signature !== expectedSignature) {
    throw new Error("Invalid webhook signature");
  }
  return payload;
}
