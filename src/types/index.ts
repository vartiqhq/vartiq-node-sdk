export interface Project {
  success: boolean;
  message: string;
  data: {  
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface App {
  success: boolean;
  message: string;
  data: {
  id: string;
  name: string;
  description: string;
  environment: string;
  createdAt: string;
  updatedAt: string;
  };
}

export interface Webhook {
  success: boolean;
  message: string;
  data: {
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
  };
}

export interface WebhookMessage {
  success: boolean;
  message: string;
  data: {
  id: string;
  webhook: string;
  payload: string;
  signature: string;
  headers: Array<{ key: string; value: string; _id?: string }>;
  isDelivered: boolean;
  createdAt: string;
  updatedAt: string;
  };
}

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

export type ApiErrorResponse =
| { errors: { message: string }[]; status: number; type: string }
| { message: string }
| unknown;
