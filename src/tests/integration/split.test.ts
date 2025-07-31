import { beforeAll, describe, expect, test } from "bun:test";
import { Paystack } from "../../index";

const secretKey = process.env.PAYSTACK_SECRET_KEY as string;
const _shouldRun = secretKey?.startsWith("sk_test_");

// Conditionally skip the tests if the secret key is not available
const describeIf = (condition: boolean) =>
	condition ? describe : describe.skip;

// Skipping these tests because the test account does not have a subaccount.
// The SDK does not have a method to create a subaccount, so this test cannot be run.
describeIf(false)("Split Module (Integration)", () => {
	let paystack: Paystack;
	let splitId: number | undefined;

	beforeAll(() => {
		paystack = new Paystack(secretKey as string);
	});

	test("should create a transaction split", async () => {
		const subaccount = "ACCT_pwwualp2m35s3x4";
		const { data, error } = await paystack.split.create({
			name: "Test Split",
			type: "percentage",
			currency: "NGN",
			subaccounts: [
				{
					subaccount: subaccount,
					share: 50,
				},
			],
			bearer_type: "subaccount",
			bearer_subaccount: subaccount,
		});

		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
		expect(data?.data?.id).toBeDefined();
		splitId = data?.data?.id;
	});

	test("should list the transaction splits", async () => {
		const { data, error } = await paystack.split.list({
			name: "Test Split",
			active: true,
			perPage: 10,
			page: 1,
		});

		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
		expect(data?.data).toBeArray();
		expect(data?.data?.length).toBeGreaterThan(0);
	});

	test("should get details of a split", async () => {
		if (!splitId) {
			throw new Error("splitId is not defined");
		}
		const { data, error } = await paystack.split.getSplitById(String(splitId));

		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
		expect(data?.data?.id).toBe(splitId);
	});

	test("should update a split", async () => {
		if (!splitId) {
			throw new Error("splitId is not defined");
		}
		const newName = "Updated Test Split";
		const { data, error } = await paystack.split.update({
			id: String(splitId),
			name: newName,
			active: false,
		});

		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
		expect(data?.data?.name).toBe(newName);
		expect(data?.data?.active).toBe(false);
	});
});
