import { beforeAll, describe, expect, test } from "bun:test";
import { Paystack } from "../../index";

const secretKey = process.env.PAYSTACK_SECRET_KEY as string;
const shouldRun = secretKey?.startsWith("sk_test_");

// Conditionally skip the tests if the secret key is not available
const describeIf = (condition: boolean) => (condition ? describe : describe);

describeIf(shouldRun)("Transfer Module (Integration)", () => {
	let paystack: Paystack;
	let transferCode = "";

	beforeAll(() => {
		paystack = new Paystack(secretKey as string);
	});

	test.skip("should initialize a transfer", async () => {
		const input = {
			source: "balance" as const,
			amount: 5000,
			recipient: "RCP_123456", // Add a valid recipient code
			reason: "Holiday groove",
			currency: "NGN" as const,
			reference: "23fn34n",
		};
		const { data, error } = await paystack.transfer.initialize(input);

		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
		expect(data?.data?.transfer_code).toBeDefined();
		transferCode = data?.data?.transfer_code || "";
	});

	test("should handle API error for initializing a transfer with invalid recipient", async () => {
		const input = {
			source: "balance" as const,
			amount: 5000,
			recipient: "invalid-recipient",
			reason: "Holiday groove",
			currency: "NGN" as const,
			reference: "23fn34n",
		};
		const { data, error } = await paystack.transfer.initialize(input);

		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(false);
		expect(data?.message).toBe("Recipient specified is invalid");
	});

	test.skip("should finalize a transfer", async () => {
		expect(transferCode).not.toBe("");
		const input = {
			transfer_code: transferCode,
			otp: "123456", // This will likely fail with a real API call
		};
		const { data, error } = await paystack.transfer.finalize(input);
		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		// This will likely fail, but we're testing the SDK's ability to make the call
		expect(data?.status).toBe(false);
	});

	test.skip("should initiate a bulk transfer", async () => {
		const input = {
			source: "balance" as const,
			transfers: [
				{
					amount: 5000,
					recipient: "RCP_123456", // Add a valid recipient code
					reference: "23fn34n",
				},
			],
		};
		const { data, error } = await paystack.transfer.initiateBulk(input);
		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
	});

	test("should handle API error for initiating a bulk transfer with OTP enabled", async () => {
		const input = {
			source: "balance" as const,
			transfers: [
				{
					amount: 5000,
					recipient: "RCP_123456",
					reference: "23fn34n",
				},
			],
		};
		const { data, error } = await paystack.transfer.initiateBulk(input);
		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(false);
		expect(data?.message).toBe(
			"You need to disable the OTP requirement to use this feature.",
		);
	});

	test("should list transfers", async () => {
		const { data, error } = await paystack.transfer.list({
			perPage: 1,
			page: 1,
		});
		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
	});

	test.skip("should fetch a transfer", async () => {
		expect(transferCode).not.toBe("");
		const { data, error } =
			await paystack.transfer.getTransferById(transferCode);
		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
		expect(data?.data?.transfer_code).toBe(transferCode);
	});

	test.skip("should verify a transfer", async () => {
		expect(transferCode).not.toBe("");
		const { data, error } = await paystack.transfer.verify(transferCode);
		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
		expect(data?.data?.transfer_code).toBe(transferCode);
	});
});
