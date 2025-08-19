import { afterEach, describe, expect, spyOn, test } from "bun:test";
import type { z } from "zod";
import { Paystack } from "../index";
import type { txnInitializeSuccess } from "../zod/transaction";
import { mockErrorResponse, mockFetch } from "./mocks";
import {
	mockChargeAuthorizationResponse,
	mockExportTransactionsResponse,
	mockListTransactionsResponse,
	mockPartialDebitResponse,
	mockSingleTransactionResponse,
	mockTransactionTotalsResponse,
	mockVerifySuccessResponse,
	mockViewTimelineResponse,
} from "./mocks/transaction";

// Restore all mocks after each test
afterEach(() => {
	spyOn(global, "fetch").mockRestore();
});

describe("Transaction Module", () => {
	const paystack = new Paystack("sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

	describe("initialize", () => {
		test("should return authorization URL on success", async () => {
			// Arrange
			const mockResponse: z.infer<typeof txnInitializeSuccess> = {
				status: true,
				message: "Authorization URL created",
				data: {
					authorization_url: "https://checkout.paystack.com/h63s32gdw",
					access_code: "h63s32gdw",
					reference: "test-reference-123",
				},
			};
			const fetchSpy = mockFetch(mockResponse, true);

			const input = {
				email: "customer@email.com",
				amount: "50000",
			};

			// Act
			const { data, error } = await paystack.transaction.initialize(input);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.data?.authorization_url).toBe(
				"https://checkout.paystack.com/h63s32gdw",
			);

			// Verify fetch was called correctly
			expect(fetchSpy).toHaveBeenCalledWith(
				"https://api.paystack.co/transaction/initialize",
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
			const mockErrorResponse = {
				status: false,
				message: "Invalid key",
			};
			mockFetch(mockErrorResponse, false);

			const input = {
				email: "customer@email.com",
				amount: "50000",
			};

			// Act
			const { data, error } = await paystack.transaction.initialize(input);

			// Assert
			expect(error).toBeUndefined(); // Zod validation of the error response should pass
			expect(data).toBeDefined();
			expect(data?.status).toBe(false); // The API call failed
			expect(data?.message).toBe("Invalid key");
		});
	});

	describe("verify", () => {
		test("should return transaction details on successful verification", async () => {
			// Arrange
			const reference = "test-reference-123";
			const fetchSpy = mockFetch(mockVerifySuccessResponse, true);

			// Act
			const { data, error } = await paystack.transaction.verify(reference);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.data?.reference).toBe(reference);
			expect(data?.data?.status).toBe("success");

			// Verify fetch was called correctly
			expect(fetchSpy).toHaveBeenCalledWith(
				`https://api.paystack.co/transaction/verify/${reference}`,
				expect.any(Object),
			);
		});

		test("should handle API error for invalid reference", async () => {
			// Arrange
			const reference = "invalid-reference";
			mockFetch(mockErrorResponse, false);

			// Act
			const { data, error } = await paystack.transaction.verify(reference);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(false);
			expect(data?.message).toBe("Invalid transaction reference");
		});
	});

	describe("list", () => {
		test("should return a list of transactions", async () => {
			// Arrange
			const fetchSpy = mockFetch(mockListTransactionsResponse, true);
			const params = { perPage: 50, page: 1 };

			// Act
			const { data, error } = await paystack.transaction.list(params);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.data).toBeInstanceOf(Array);
			expect(data?.data?.length).toBe(1);
			expect(data?.meta?.perPage).toBe(50);

			// Verify fetch was called correctly
			const expectedParams = new URLSearchParams({
				perPage: "50",
				page: "1",
			}).toString();
			expect(fetchSpy).toHaveBeenCalledWith(
				`https://api.paystack.co/transaction?${expectedParams}`,
				expect.any(Object),
			);
		});
	});

	describe("getTransactionById", () => {
		test("should return a single transaction by ID", async () => {
			// Arrange
			const transactionId = 316712345;
			const fetchSpy = mockFetch(mockSingleTransactionResponse, true);

			// Act
			const { data, error } =
				await paystack.transaction.getTransactionById(transactionId);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.data?.id).toBe(transactionId);

			// Verify fetch was called correctly
			expect(fetchSpy).toHaveBeenCalledWith(
				`https://api.paystack.co/transaction/${transactionId}`,
				expect.any(Object),
			);
		});
	});

	describe("chargeAuthorization", () => {
		test("should successfully charge an authorization", async () => {
			// Arrange
			const fetchSpy = mockFetch(mockChargeAuthorizationResponse, true);
			const input = {
				email: "customer@email.com",
				amount: 50000,
				authorization_code: "AUTH_123456789",
			};

			// Act
			const { data, error } =
				await paystack.transaction.chargeAuthorization(input);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.data?.status).toBe("success");
			expect(data?.data?.amount).toBe(50000);

			// Verify fetch was called correctly
			expect(fetchSpy).toHaveBeenCalledWith(
				"https://api.paystack.co/transaction/charge_authorization",
				expect.objectContaining({
					method: "POST",
					body: JSON.stringify(input),
				}),
			);
		});
	});

	describe("viewTxnTimeline", () => {
		test("should return the timeline for a transaction", async () => {
			// Arrange
			const reference = "test-reference-123";
			const fetchSpy = mockFetch(mockViewTimelineResponse, true);

			// Act
			const { data, error } =
				await paystack.transaction.viewTxnTimeline(reference);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.data?.history).toBeInstanceOf(Array);

			// Verify fetch was called correctly
			expect(fetchSpy).toHaveBeenCalledWith(
				`https://api.paystack.co/transaction/timeline/${reference}`,
				expect.any(Object),
			);
		});
	});

	describe("getTxnTotals", () => {
		test("should return transaction totals", async () => {
			// Arrange
			const fetchSpy = mockFetch(mockTransactionTotalsResponse, true);
			const params = { perPage: 50, page: 1 };

			// Act
			const { data, error } = await paystack.transaction.getTxnTotals(params);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.data?.total_transactions).toBe(100);

			// Verify fetch was called correctly
			const expectedParams = new URLSearchParams({
				perPage: "50",
				page: "1",
			}).toString();
			expect(fetchSpy).toHaveBeenCalledWith(
				`https://api.paystack.co/transaction/totals?${expectedParams}`,
				expect.any(Object),
			);
		});
	});

	describe("exportTxns", () => {
		test("should return an export link", async () => {
			// Arrange
			const fetchSpy = mockFetch(mockExportTransactionsResponse, true);
			const params = { perPage: 100, page: 1 };

			// Act
			const { data, error } = await paystack.transaction.exportTxns(params);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.data?.path).toBe("https://example.com/export.csv");

			// Verify fetch was called correctly
			const expectedParams = new URLSearchParams({
				perPage: "100",
				page: "1",
			}).toString();
			expect(fetchSpy).toHaveBeenCalledWith(
				`https://api.paystack.co/transaction/export?${expectedParams}`,
				expect.any(Object),
			);
		});
	});

	describe("partialDebit", () => {
		test("should perform a partial debit successfully", async () => {
			// Arrange
			const fetchSpy = mockFetch(mockPartialDebitResponse, true);
			const input = {
				authorization_code: "AUTH_123456789",
				currency: "NGN" as const,
				amount: 50000,
				email: "customer@email.com",
			};

			// Act
			const { data, error } = await paystack.transaction.partialDebit(input);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.data?.status).toBe("success");
			expect(data?.data?.amount).toBe(50000);

			// Verify fetch was called correctly
			expect(fetchSpy).toHaveBeenCalledWith(
				"https://api.paystack.co/transaction/partial_debit",
				expect.objectContaining({
					method: "POST",
					body: JSON.stringify(input),
				}),
			);
		});
	});
});
