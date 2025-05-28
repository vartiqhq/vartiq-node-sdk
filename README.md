# Vartiq Node SDK

A TypeScript/JavaScript SDK for interacting with the Vartiq API.

## Installation

```bash
npm install vartiq
```

## Requirements

- Node.js 14+
- Your Vartiq API key

## Usage

### Import and Initialize

```ts
import { Vartiq } from "vartiq";

const vartiq = new Vartiq("YOUR_API_KEY");
```

### TypeScript Types

You can import types for strong typing:

```ts
import type { Project, App, Webhook, WebhookMessage } from "vartiq";
```

## API

### Project

```ts
// Create a project
const project = await vartiq.project.create({
  name: "Test",
  description: "desc",
});

// Get all projects
const projects = await vartiq.project.list();

// Get a single project
const project = await vartiq.project.get("PROJECT_ID");

// Update a project
const updated = await vartiq.project.update("PROJECT_ID", { name: "New Name" });

// Delete a project
await vartiq.project.delete("PROJECT_ID");
```

### App

```ts
// Create an app
const app = await vartiq.app.create({
  name: "App Name",
  projectId: "PROJECT_ID",
});

// Get all apps
const apps = await vartiq.app.list("PROJECT_ID");

// Get a single app
const app = await vartiq.app.get("APP_ID");

// Update an app
const updated = await vartiq.app.update("APP_ID", { name: "New App Name" });

// Delete an app
await vartiq.app.delete("APP_ID");
```

### Webhook

```ts
// Create a webhook
const webhook = await vartiq.webhook.create({
  url: "https://your-webhook-url.com",
  appId: "APP_ID",
  customHeaders: [{ key: "x-app", value: "x-value" }], // optional
});

// Get all webhooks for an app
const webhooks = await vartiq.webhook.list("APP_ID");

// Get a single webhook
const webhook = await vartiq.webhook.get("WEBHOOK_ID");

// Update a webhook
const updated = await vartiq.webhook.update("WEBHOOK_ID", {
  name: "New Webhook Name",
});

// Delete a webhook
await vartiq.webhook.delete("WEBHOOK_ID");
```

### Webhook Message

```ts
// Create a webhook message
const message = await vartiq.webhook.message.create("APP_ID", {
  hello: "world",
});
```

## Webhook Signature Verification

You can verify webhook signatures using the Vartiq instance method:

### Using the Vartiq instance method

```js
import { Vartiq } from "your-sdk-path";

const vartiq = new Vartiq("YOUR_API_KEY");

try {
  const webhookSecret = process.env.WEBHOOK_SECRET;

  const verifiedPayload = vartiq.verify(payload, signature, webhookSecret);
  // Signature is valid, returns verified payload
} catch (err) {
  // Signature is invalid
}
```

## Error Handling

All methods throw on HTTP/network errors. Use try/catch for error handling.

```ts
try {
  const project = await vartiq.project.create(...);
} catch (err) {
  console.error('API error:', err);
}
```

## License

ISC
