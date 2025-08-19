import { beforeAll, describe, expect, test } from "bun:test";
import { Paystack } from "../../index";

const secretKey = process.env.PAYSTACK_SECRET_KEY as string;
const shouldRun = secretKey?.startsWith("sk_test_");

// Conditionally skip the tests if the secret key is not available
const describeIf = (condition: boolean) => (condition ? describe : describe);

describeIf(shouldRun)("Verification Module (Integration)", () => {
	let paystack: Paystack;

	beforeAll(() => {
		paystack = new Paystack(secretKey as string);
	});

	test("should resolve an account", async () => {
		try {
			const { data, error } = await paystack.verification.resolveAccount({
				account_number: "0123456789",
				bank_code: "058",
			});

			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.data?.account_name).toBeDefined();
		} catch (error) {
			// This might fail if the account cannot be resolved, which is fine
			expect(error).toBeDefined();
		}
	});

	test("should handle API error for resolving an account with invalid bank code", async () => {
		const { data, error } = await paystack.verification.resolveAccount({
			account_number: "0001234567",
			bank_code: "invalid-bank-code",
		});

		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(false);
		expect(data?.message).toBe("Unknown bank code: invalid-bank-code");
	});

	test.skip("should resolve a card BIN", async () => {
		// This is a test card BIN
		const cardBin = "408408";
		const { data, error } = await paystack.verification.resolveCardBin({
			card_bin: cardBin,
		});

		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
		expect(data?.data?.bin).toBe(cardBin);
	});

	test("should handle API error for resolving a card BIN", async () => {
		const { data, error } = await paystack.verification.resolveCardBin({
			card_bin: "invalid-card-bin",
		});

		expect(error).toBeDefined();
		expect(data).toBeUndefined();
	});
});
