import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { Paystack } from "../index";
import { mockChargeSuccessPayload } from "./mocks";

const generateSignature = async (secret: string, body: string) => {
	const secretKeyData = new TextEncoder().encode(secret);
	const key = await crypto.subtle.importKey(
		"raw",
		secretKeyData,
		{ name: "HMAC", hash: "SHA-512" },
		false,
		["sign"],
	);
	const signatureData = new TextEncoder().encode(body);
	const hashBuffer = await crypto.subtle.sign("HMAC", key, signatureData);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

describe("Webhook Module", () => {
	const secret = "sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
	const paystack = new Paystack(secret);

	afterEach(() => {
		// Clear all handlers after each test
		(
			paystack.webhook as unknown as { handlers: Record<string, unknown> }
		).handlers = {};
	});

	test("should register and call a webhook handler", async () => {
		const handler = spyOn(console, "log");
		paystack.webhook.on("charge.success", (data) => {
			console.log(data.reference);
		});

		const body = JSON.stringify(mockChargeSuccessPayload);
		const signature = await generateSignature(secret, body);

		await paystack.webhook.process(body, signature);

		expect(handler).toHaveBeenCalledWith("test-reference-123");
		handler.mockRestore();
	});

	test("should throw an error for invalid signature", async () => {
		const body = JSON.stringify(mockChargeSuccessPayload);
		const invalidSignature = "invalid-signature";

		const promise = paystack.webhook.process(body, invalidSignature);

		await expect(promise).rejects.toThrow("Invalid webhook signature.");
	});

	test("should throw an error for missing signature", async () => {
		const body = JSON.stringify(mockChargeSuccessPayload);
		const promise = paystack.webhook.process(body, null);
		await expect(promise).rejects.toThrow(
			"Missing 'x-paystack-signature' header.",
		);
	});

	test("should throw an error for invalid payload", async () => {
		const invalidPayload = { event: "charge.success", data: { id: 123 } };
		const body = JSON.stringify(invalidPayload);
		const signature = await generateSignature(secret, body);

		const promise = paystack.webhook.process(body, signature);

		await expect(promise).rejects.toThrow("Failed to parse webhook payload.");
	});

	test("should not throw if no handler is registered", async () => {
		const anotherPaystack = new Paystack(secret);
		const body = JSON.stringify(mockChargeSuccessPayload);
		const signature = await generateSignature(secret, body);

		const result = await anotherPaystack.webhook.process(body, signature);

		// The test passes if the promise resolves.
		// We can also assert that it returns the correct payload.
		expect(result.event).toBe("charge.success");
	});
});
