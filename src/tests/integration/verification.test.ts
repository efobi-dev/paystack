import { beforeAll, describe, expect, test } from "bun:test";
import { Paystack } from "../../index";

const secretKey = process.env.PAYSTACK_SECRET_KEY as string;
const shouldRun = secretKey?.startsWith("sk_test_");

// Conditionally skip the tests if the secret key is not available
const describeIf = (condition: boolean) =>
	condition ? describe : describe.skip;

describeIf(shouldRun)("Verification Module (Integration)", () => {
	let paystack: Paystack;

	beforeAll(() => {
		paystack = new Paystack(secretKey as string);
	});

	// Skipping this test because the bank code is not valid for the test environment.
	test.skip("should resolve an account", async () => {
		const { data, error } = await paystack.verification.resolveAccount({
			account_number: "8097633252",
			bank_code: "100004",
		});

		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
		expect(data?.data?.account_name).toBeDefined();
	});

	// Skipping this test because the resolveCardBin endpoint is not available for the test account.
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
});
