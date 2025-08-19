import { describe, expect, test } from "bun:test";
import { Paystack } from "../../index";
import { beforeAll } from "bun:test";

const secretKey = "sk_test_b23360f4c35f1fb79f9c51a3fc707326750d88d8";
const shouldRun = secretKey?.startsWith("sk_test_");

// Conditionally skip the tests if the secret key is not available
const describeIf = (condition: boolean) =>
	condition ? describe : describe.skip;

describeIf(shouldRun)("Transfer Module (Integration)", () => {
	let paystack: Paystack;
	let transfer_code = "";
	let transfer_recipient_code = "";

	beforeAll(() => {
		paystack = new Paystack(secretKey as string);
	});

	test("should create a transfer recipient", async () => {
		const input = {
			type: "nuban",
			name: "John Doe",
			account_number: "0000000000",
			bank_code: "057",
			currency: "NGN",
		};
		const { data, error } = await paystack.transfer.createRecipient(input);

		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
		expect(data?.data?.recipient_code).toBeDefined();
		transfer_recipient_code = data?.data?.recipient_code || "";
	});

	test("should initialize a transfer", async () => {
		const input = {
			source: "balance",
			amount: "5000",
			recipient: transfer_recipient_code,
			reason: "Holiday groove",
		};
		const { data, error } = await paystack.transfer.initialize(input);

		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(false);
	});

	test.skip("should finalize a transfer", async () => {
		const input = {
			transfer_code: transfer_code,
			otp: "123456",
		};
		const { data, error } = await paystack.transfer.finalize(input);
		expect(error).toBeUndefined();
		expect(data).toBeDefined();
	});

	test("should initiate a bulk transfer", async () => {
		const input = {
			source: "balance",
			transfers: [
				{
					amount: "5000",
					recipient: transfer_recipient_code,
				},
			],
		};
		const { data, error } = await paystack.transfer.initiateBulk(input);
		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(false);
	});

	test.skip("should get a transfer by id", async () => {
		const { data, error } = await paystack.transfer.getTransferById(
			transfer_code,
		);
		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
		expect(data?.data?.transfer_code).toBe(transfer_code);
	});

	test("should list transfers", async () => {
		const { data, error } = await paystack.transfer.list({ perPage: "1" });
		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
	});

	test.skip("should verify a transfer", async () => {
		const { data, error } = await paystack.transfer.verify(transfer_code);
		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
		expect(data?.data?.transfer_code).toBe(transfer_code);
	});
});
