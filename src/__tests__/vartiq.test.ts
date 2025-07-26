import { Vartiq, verifyWebhookSignature, } from "../index";
import crypto from "crypto";
import { describe, it, expect, vi } from "vitest";

const TEST_API_KEY = "test-api-key";
const TEST_BASE_URL = "http://test.local";

describe("Vartiq", () => {
  it("throws if no API key is provided", () => {
    // @ts-expect-error Testing constructor with missing API key
    expect(() => new Vartiq()).toThrow("API key is required");
  });

  it("sets default baseUrl if not provided", () => {
    const v = new Vartiq(TEST_API_KEY);
    // @ts-expect-error Testing private property baseUrl
    expect(v.baseUrl).toBe("http://localhost:4000");
  });

  it("sets baseUrl if provided", () => {
    const v = new Vartiq(TEST_API_KEY, TEST_BASE_URL);
    // @ts-expect-error Testing private property baseUrl
    expect(v.baseUrl).toBe(TEST_BASE_URL);
  });

  it("constructs API sub-objects", () => {
    const v = new Vartiq(TEST_API_KEY, TEST_BASE_URL);
    expect(v.project).toBeDefined();
    expect(v.app).toBeDefined();
    expect(v.webhook).toBeDefined();
  });

  it("uses injected fetch for testing", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ foo: "bar" }),
      text: async () => "error",
    });
    const v = new Vartiq(
      TEST_API_KEY,
      TEST_BASE_URL,
    );
    const result = await v.request("/test", { method: "GET" });
    expect(mockFetch).toHaveBeenCalledWith(
      `${TEST_BASE_URL}/test`,
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          "x-api-key": TEST_API_KEY,
          "Content-Type": "application/json",
        }),
      })
    );
    expect(result).toEqual({ foo: "bar" });
  });

  // it("throws if fetch response is not ok", async () => {
  //   const mockFetch = vi.fn().mockResolvedValue({
  //     ok: false,
  //     text: async () => "fail",
  //   });
  //   const v = new Vartiq(
  //     TEST_API_KEY,
  //     TEST_BASE_URL,
  //   );
  //   await expect(v.request("/fail")).rejects.toThrow("fail");
  // });

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
      payload
    );
  });

  it("throws if signature is invalid", () => {
    expect(() =>
      verifyWebhookSignature(payload, "bad-signature", secret)
    ).toThrow("Invalid webhook signature");
  });
});
