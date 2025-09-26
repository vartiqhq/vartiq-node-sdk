export interface Project {
  id: string;
  appCount: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface App {
  id: string;
  name: string;
  description: string;
  environment: string;
  createdAt: string;
  updatedAt: string;
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  customHeaders: Array<{ key: string; value: string; _id?: string }>;
  headers: Array<{ key?: string; value?: string; _id?: string }>;
  authMethod: {
    method: WebhookAuthMethod;
    hmacHeader?: string;
    hmacSecret?: string;
    userName?: string;
    password?: string;
    apiKey?: string;
    apiKeyHeader?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WebhookMessage {
  id: string;
  webhook: string;
  payload: string;
  signature: string;
  headers: Array<{ key: string; value: string; _id?: string }>;
  isDelivered: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookMessageAttempt {
  _id: string;
  response: string;
  statusCode: number;
  createdAt: string;
}

export type WebhookMessageTarget = { appId: string } | { webhookId: string };

export type WebhookAuthMethod = "apiKey" | "basic" | "hmac";

interface BaseWebhookInput {
  name: string;
  url: string;
  appId: string;
  customHeaders?: Array<{ key: string; value: string }>;
}

interface BasicAuthWebhookInput extends BaseWebhookInput {
  authMethod: "basic";
  userName: string;
  password: string;
}

interface HmacAuthWebhookInput extends BaseWebhookInput {
  authMethod: "hmac";
  hmacHeader: string;
  hmacSecret: string;
}

interface ApiKeyAuthWebhookInput extends BaseWebhookInput {
  authMethod: "apiKey";
  apiKey: string;
  apiKeyHeader: string;
}

export type CreateWebhookInput =
  | BasicAuthWebhookInput
  | HmacAuthWebhookInput
  | ApiKeyAuthWebhookInput;

export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Update payload mirrors create but fields are optional and
// excludes immutable `appId`.
interface BaseUpdateWebhookInput {
  name?: string;
  url?: string;
  customHeaders?: Array<{ key: string; value: string }>;
}

interface BasicAuthUpdateWebhookInput extends BaseUpdateWebhookInput {
  authMethod: "basic";
  userName: string;
  password: string;
}

interface HmacAuthUpdateWebhookInput extends BaseUpdateWebhookInput {
  authMethod: "hmac";
  hmacHeader: string;
  hmacSecret: string;
}

interface ApiKeyAuthUpdateWebhookInput extends BaseUpdateWebhookInput {
  authMethod: "apiKey";
  apiKey: string;
  apiKeyHeader: string;
}

export type UpdateWebhookInput =
  | BaseUpdateWebhookInput // allows updating only basic fields with no auth change
  | BasicAuthUpdateWebhookInput
  | HmacAuthUpdateWebhookInput
  | ApiKeyAuthUpdateWebhookInput;

export type ApiErrorResponse =
  | { errors: { message: string }[]; status: number; type: string }
  | { message: string }
  | unknown;
