import { beforeAll, describe, expect, test } from "bun:test";
import { Paystack } from "../../index";

const secretKey = process.env.PAYSTACK_SECRET_KEY as string;
const _shouldRun = secretKey?.startsWith("sk_test_");

// Conditionally skip the tests if the secret key is not available
const describeIf = (condition: boolean) =>
	condition ? describe : describe.skip;

// Skipping these tests because the test account does not have the Dedicated NUBAN feature enabled.
describeIf(false)("Virtual Account Module (Integration)", () => {
	let paystack: Paystack;
	let virtualAccountId: number | undefined;

	beforeAll(() => {
		paystack = new Paystack(secretKey as string);
	});

	test("should create a virtual account", async () => {
		const { data, error } = await paystack.virtualAccount.create({
			customer: "CUS_2v3s1y8xjv382s9",
			preferred_bank: "wema-bank",
		});

		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
		expect(data?.data?.id).toBeDefined();
		virtualAccountId = data?.data?.id;
	});

	test("should list virtual accounts", async () => {
		const { data, error } = await paystack.virtualAccount.list({
			active: true,
			currency: "NGN",
		});

		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
		expect(data?.data).toBeArray();
	});

	test("should fetch details of a virtual account", async () => {
		if (!virtualAccountId) {
			throw new Error("virtualAccountId is not defined");
		}
		const { data, error } = await paystack.virtualAccount.fetch(
			String(virtualAccountId),
		);

		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect.objectContaining({
			status: true,
			message: "Dedicated account retrieved",
		});
	});
});
