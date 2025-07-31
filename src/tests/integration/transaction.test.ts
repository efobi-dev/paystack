import { describe, expect, test } from "bun:test";
import { Paystack } from "../../index";

const secretKey = process.env.PAYSTACK_SECRET_KEY as string;
const shouldRun = secretKey?.startsWith("sk_test_");

// Conditionally skip the tests if the secret key is not available
const describeIf = (condition: boolean) =>
	condition ? describe : describe.skip;

import { beforeAll } from "bun:test";

describeIf(shouldRun)("Transaction Module (Integration)", () => {
	let paystack: Paystack;
	let reference = "";

	beforeAll(() => {
		paystack = new Paystack(secretKey as string);
	});

	test("should initialize a transaction", async () => {
		const input = {
			email: "customer@email.com",
			amount: "50000",
		};
		const { data, error } = await paystack.transaction.initialize(input);

		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
		expect(data?.data?.authorization_url).toBeDefined();
		expect(data?.data?.reference).toBeDefined();
		reference = data?.data?.reference || "";
	});

	test("should verify a transaction", async () => {
		expect(reference).not.toBe("");
		const { data, error } = await paystack.transaction.verify(reference);

		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
		expect(data?.data?.reference).toBe(reference);
	});
});
