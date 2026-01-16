import { beforeAll, describe, expect, test } from "bun:test";
import { Paystack } from "../../index";

const secretKey = process.env.PAYSTACK_SECRET_KEY as string;
const shouldRun = secretKey?.startsWith("sk_test_");

// Conditionally skip the tests if the secret key is not available
const describeIf = (condition: boolean) =>
	condition ? describe : describe.skip;

describeIf(shouldRun)("Recipient Module (Integration)", () => {
	let paystack: Paystack;
	let recipientCode = "";
	const recipientName = "John Doe";
	const updatedRecipientName = "Jane Doe";

	beforeAll(() => {
		paystack = new Paystack(secretKey);
	});

	test("should create a recipient", async () => {
		const input = {
			type: "nuban" as const,
			name: recipientName,
			account_number: "0000000000",
			bank_code: "057", // Zenith Bank
			currency: "NGN" as const,
		};
		const { data, error } = await paystack.recipient.create(input);

		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
		expect(data?.data?.recipient_code).toBeDefined();
		recipientCode = data?.data?.recipient_code || "";
	});

	test("should list recipients", async () => {
		const { data, error } = await paystack.recipient.list({
			perPage: 1,
			page: 1,
		});
		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
	});

	test("should fetch a recipient", async () => {
		expect(recipientCode).not.toBe("");
		const { data, error } =
			await paystack.recipient.getRecipientById(recipientCode);
		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
		expect(data?.data?.recipient_code).toBe(recipientCode);
	});

	test("should update a recipient", async () => {
		expect(recipientCode).not.toBe("");
		const input = {
			id_or_code: recipientCode,
			name: updatedRecipientName,
		};
		const { data, error } = await paystack.recipient.update(input);
		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
		expect(data?.message).toBe("Recipient updated");
	});

	test("should delete a recipient", async () => {
		expect(recipientCode).not.toBe("");
		const { data, error } = await paystack.recipient.delete(recipientCode);
		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
		expect(data?.message).toBe("Transfer recipient set as inactive");
	});
});
