export interface Project {
  company: string;
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  appCount: number;
  webhookMessageCount: number;
  failedWebhookMessageCount: number;
}

export interface App {
  company: string;
  description: string;
  environment: {
    _id: string;
    name: string;
  };
  id: string;
  name: string;
  project: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface WebhookHeader {
  key: string;
  value: string;
  _id?: string;
}
export interface Webhook {
  company: string;
  customHeaders: WebhookHeader[];
  headers: WebhookHeader[];
  id: string;
  project: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  authMethod?: {
    method: WebhookAuthMethod;
    hmacHeader?: string;
    hmacSecret?: string;
    userName?: string;
    password?: string;
    apiKey?: string;
    apiKeyHeader?: string;
  };
}

export interface WebhookMessageAttempt {
  _id: string;
  awsMessageId: string | null;
  reqHeaders: WebhookHeader[];
  resHeaders: WebhookHeader[];
  id: string;
  isProcessed: boolean;
  isResend: boolean;
  response: string;
  statusCode: number;
  webhookMessage: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface WebhookMessage {
  company: string;
  id: string;
  project: string;
  environment: string;
  headers: WebhookHeader[];
  status: string;
  attempts: WebhookMessageAttempt[];
  webhook: string;
  payload: string;
  signature: string;
  isDelivered: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
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
  message?: string;
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
