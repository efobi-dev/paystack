import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { Paystack } from "../index";
import {
	mockChargeSuccessNullBankPayload,
	mockChargeSuccessPayload,
	mockTransferFailedWebhookPayload,
	mockTransferReversedWebhookPayload,
	mockTransferSuccessWebhookPayload,
} from "./mocks";

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

	test("should parse charge.success with null authorization.bank", async () => {
		const body = JSON.stringify(mockChargeSuccessNullBankPayload);
		const signature = await generateSignature(secret, body);

		const result = await paystack.webhook.process(body, signature);

		expect(result.event).toBe("charge.success");
		if (result.event === "charge.success") {
			expect(result.data.authorization?.bank).toBeNull();
		}
	});

	test("should parse transfer.success webhook payload", async () => {
		const body = JSON.stringify(mockTransferSuccessWebhookPayload);
		const signature = await generateSignature(secret, body);

		const result = await paystack.webhook.process(body, signature);

		expect(result.event).toBe("transfer.success");
		if (result.event === "transfer.success") {
			expect(result.data.recipient.description).toBe("Test recipient");
			expect(result.data.created_at).toBe("2024-01-01T12:00:00.000Z");
		}
	});

	test("should parse transfer.failed with null description and absent timestamps", async () => {
		const body = JSON.stringify(mockTransferFailedWebhookPayload);
		const signature = await generateSignature(secret, body);

		const result = await paystack.webhook.process(body, signature);

		expect(result.event).toBe("transfer.failed");
		if (result.event === "transfer.failed") {
			expect(result.data.recipient.description).toBeNull();
			expect(result.data.created_at).toBeUndefined();
			expect(result.data.updated_at).toBeUndefined();
			expect(result.data.recipient.created_at).toBeUndefined();
			expect(result.data.recipient.updated_at).toBeUndefined();
		}
	});

	test("should parse transfer.reversed with null description and absent timestamps", async () => {
		const body = JSON.stringify(mockTransferReversedWebhookPayload);
		const signature = await generateSignature(secret, body);

		const result = await paystack.webhook.process(body, signature);

		expect(result.event).toBe("transfer.reversed");
		if (result.event === "transfer.reversed") {
			expect(result.data.recipient.description).toBeNull();
			expect(result.data.recipient.created_at).toBeUndefined();
		}
	});
});
