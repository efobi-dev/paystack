import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { Paystack } from "../index";
import {
	mockBulkCreateRecipientResponse,
	mockCreateRecipientResponse,
	mockDeleteRecipientResponse,
	mockFetchRecipientResponse,
	mockListRecipientsResponse,
	mockRecipientErrorResponse,
	mockUpdateRecipientResponse,
} from "./mocks/recipient";
import { mockFetch } from "./mocks";

describe("Recipient Module", () => {
	const paystack = new Paystack("sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

	afterEach(() => {
		spyOn(global, "fetch").mockRestore();
	});

	describe("create", () => {
		test("should create a recipient", async () => {
			// Arrange
			const fetchSpy = mockFetch(mockCreateRecipientResponse, true);
			const input = {
				type: "nuban" as const,
				name: "John Doe",
				account_number: "0000000000",
				bank_code: "058",
				currency: "NGN" as const,
			};

			// Act
			const { data, error } = await paystack.recipient.create(input);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.message).toBe("Recipient created");
			expect(data?.data).toEqual(
				expect.objectContaining({
					...mockCreateRecipientResponse.data,
				}),
			);

			// Verify fetch was called correctly
			expect(fetchSpy).toHaveBeenCalledWith(
				"https://api.paystack.co/transferrecipient",
				expect.objectContaining({
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
					},
					body: JSON.stringify(input),
				}),
			);
		});

		test("should handle API error response", async () => {
			// Arrange
			mockFetch(mockRecipientErrorResponse, false);
			const input = {
				type: "nuban" as const,
				name: "John Doe",
				account_number: "0000000000",
				bank_code: "058",
				currency: "NGN" as const,
			};

			// Act
			const { data, error } = await paystack.recipient.create(input);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(false);
			expect(data?.message).toBe("Invalid key");
		});
	});

	describe("createBulk", () => {
		test("should create bulk recipients", async () => {
			// Arrange
			const fetchSpy = mockFetch(mockBulkCreateRecipientResponse, true);
			const input = {
				batch: [
					{
						type: "nuban" as const,
						name: "John Doe",
						account_number: "0000000000",
						bank_code: "058",
						currency: "NGN" as const,
					},
				],
			};

			// Act
			const { data, error } = await paystack.recipient.createBulk(input);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.message).toBe("Recipients created");
			expect(data?.data).toEqual(mockBulkCreateRecipientResponse.data);

			// Verify fetch was called correctly
			expect(fetchSpy).toHaveBeenCalledWith(
				"https://api.paystack.co/transferrecipient/bulk",
				expect.objectContaining({
					method: "POST",
					body: JSON.stringify(input),
				}),
			);
		});
	});

	describe("list", () => {
		test("should list recipients", async () => {
			// Arrange
			const fetchSpy = mockFetch(mockListRecipientsResponse, true);
			const params = { perPage: 50, page: 1 };

			// Act
			const { data, error } = await paystack.recipient.list(params);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.message).toBe("Recipients retrieved");
			expect(data?.data).toEqual(mockListRecipientsResponse.data);
			// biome-ignore lint/style/noNonNullAssertion: <just ignore>
			expect(data?.meta).toEqual(mockListRecipientsResponse.meta!);

			// Verify fetch was called correctly
			const expectedParams = new URLSearchParams({
				perPage: "50",
				page: "1",
			}).toString();
			expect(fetchSpy).toHaveBeenCalledWith(
				`https://api.paystack.co/transferrecipient?${expectedParams}`,
				expect.any(Object),
			);
		});
	});

	describe("getRecipientById", () => {
		test("should get a recipient by ID", async () => {
			// Arrange
			const recipientId = "RCP_1a2b3c4d5e6f7g8";
			const fetchSpy = mockFetch(mockFetchRecipientResponse, true);

			// Act
			const { data, error } =
				await paystack.recipient.getRecipientById(recipientId);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.message).toBe("Recipient retrieved");
			expect(data?.data).toEqual(
				expect.objectContaining({
					...mockFetchRecipientResponse.data,
				}),
			);

			// Verify fetch was called correctly
			expect(fetchSpy).toHaveBeenCalledWith(
				`https://api.paystack.co/transferrecipient/${recipientId}`,
				expect.any(Object),
			);
		});
	});

	describe("update", () => {
		test("should update a recipient", async () => {
			// Arrange
			const fetchSpy = mockFetch(mockUpdateRecipientResponse, true);
			const input = {
				id_or_code: "RCP_1a2b3c4d5e6f7g8",
				name: "Jane Doe",
			};

			// Act
			const { data, error } = await paystack.recipient.update(input);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.message).toBe("Recipient updated");

			// Verify fetch was called correctly
			expect(fetchSpy).toHaveBeenCalledWith(
				`https://api.paystack.co/transferrecipient/${input.id_or_code}`,
				expect.objectContaining({
					method: "PUT",
					body: JSON.stringify({ name: "Jane Doe" }),
				}),
			);
		});
	});

	describe("delete", () => {
		test("should delete a recipient", async () => {
			// Arrange
			const recipientId = "RCP_1a2b3c4d5e6f7g8";
			const fetchSpy = mockFetch(mockDeleteRecipientResponse, true);

			// Act
			const { data, error } = await paystack.recipient.delete(recipientId);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.message).toBe("Recipient has been deleted");

			// Verify fetch was called correctly
			expect(fetchSpy).toHaveBeenCalledWith(
				`https://api.paystack.co/transferrecipient/${recipientId}`,
				expect.objectContaining({
					method: "DELETE",
				}),
			);
		});
	});
});
