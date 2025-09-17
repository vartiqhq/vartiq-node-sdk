import { Vartiq, verifyWebhookSignature } from "../index";
import crypto from "crypto";
import { describe, it, expect } from "vitest";

const TEST_API_KEY = "test-api-key";
const TEST_BASE_URL = "http://test.local";

describe("Vartiq", () => {
  it("throws if no API key is provided", () => {
    // @ts-expect-error Testing constructor with missing API key
    expect(() => new Vartiq()).toThrow("API key is required");
  });

  it("constructs API sub-objects", () => {
    const v = new Vartiq(TEST_API_KEY, TEST_BASE_URL);
    expect(v.project).toBeDefined();
    expect(v.app).toBeDefined();
    expect(v.webhook).toBeDefined();
  });

  it("verify() calls verifyWebhookSignature", () => {
    const payload = { foo: "bar" };
    const secret = "shhh";
    const signature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(payload))
      .digest("hex");
    const v = new Vartiq(TEST_API_KEY);
    expect(v.verify(payload, signature, secret)).toEqual(payload);
  });
});

describe("verifyWebhookSignature", () => {
  const payload = { hello: "world" };
  const secret = "mysecret";
  const validSignature = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(payload))
    .digest("hex");

  it("returns payload if signature is valid", () => {
    expect(verifyWebhookSignature(payload, validSignature, secret)).toEqual(
      payload,
    );
  });

  it("throws if signature is invalid", () => {
    expect(() =>
      verifyWebhookSignature(payload, "bad-signature", secret),
    ).toThrow("Invalid webhook signature");
  });
});
