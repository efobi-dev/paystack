import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { Paystack } from "../index";
import {
	mockFetchTransferResponse,
	mockFinalizeTransferResponse,
	mockInitiateBulkTransferResponse,
	mockInitiateTransferResponse,
	mockListTransfersResponse,
	mockTransferErrorResponse,
	mockVerifyTransferResponse,
} from "../tests/mocks/transfer";
import { mockErrorResponse, mockFetch } from "./mocks";

describe("Transfer Module", () => {
	const paystack = new Paystack("sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

	afterEach(() => {
		spyOn(global, "fetch").mockRestore();
	});

	describe("initialize", () => {
		test("should initiate a transfer", async () => {
			// Arrange
			const fetchSpy = mockFetch(mockInitiateTransferResponse, true);
			const input = {
				source: "balance" as const,
				amount: 30000,
				recipient: "RCP_123456",
				reason: "Calm down",
				currency: "NGN" as const,
				reference: "23fn34n",
			};

			// Act
			const { data, error } = await paystack.transfer.initialize(input);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.message).toBe("Transfer has been queued");
			expect(data?.data).toEqual(
				expect.objectContaining({
					...mockInitiateTransferResponse.data,
				}),
			);

			// Verify fetch was called correctly
			expect(fetchSpy).toHaveBeenCalledWith(
				"https://api.paystack.co/transfer",
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
			mockFetch(mockTransferErrorResponse, false);
			const input = {
				source: "balance" as const,
				amount: 30000,
				recipient: "RCP_123456",
				reason: "Calm down",
				currency: "NGN" as const,
				reference: "23fn34n",
			};

			// Act
			const { data, error } = await paystack.transfer.initialize(input);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(false);
			expect(data?.message).toBe("Invalid key");
		});

		test("should handle API error response", async () => {
			// Arrange
			mockFetch(mockErrorResponse, false);
			const input = {
				transfer_code: "TRF_1ptvuv321ahaa7q",
				otp: "123456",
			};

			// Act
			const { data, error } = await paystack.transfer.finalize(input);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(false);
			expect(data?.message).toBe("Invalid key");
		});
	});

	describe("finalize", () => {
		test("should finalize a transfer", async () => {
			// Arrange
			const fetchSpy = mockFetch(mockFinalizeTransferResponse, true);
			const input = {
				transfer_code: "TRF_1ptvuv321ahaa7q",
				otp: "123456",
			};

			// Act
			const { data, error } = await paystack.transfer.finalize(input);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.message).toBe("Transfer has been completed");
			expect(data?.data).toEqual(
				expect.objectContaining({
					...mockFinalizeTransferResponse.data,
				}),
			);

			// Verify fetch was called correctly
			expect(fetchSpy).toHaveBeenCalledWith(
				"https://api.paystack.co/transfer/finalize_transfer",
				expect.objectContaining({
					method: "POST",
					body: JSON.stringify(input),
				}),
			);
		});
	});

	describe("initiateBulk", () => {
		test("should initiate a bulk transfer", async () => {
			// Arrange
			const fetchSpy = mockFetch(mockInitiateBulkTransferResponse, true);
			const input = {
				source: "balance" as const,
				transfers: [
					{
						amount: 20000,
						recipient: "RCP_123456",
						reference: "ref_123",
					},
					{
						amount: 30000,
						recipient: "RCP_123456",
						reference: "ref_456",
					},
				],
			};

			// Act
			const { data, error } = await paystack.transfer.initiateBulk(input);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.message).toBe("2 transfers have been queued");
			expect(data?.data).toEqual(mockInitiateBulkTransferResponse.data);

			// Verify fetch was called correctly
			expect(fetchSpy).toHaveBeenCalledWith(
				"https://api.paystack.co/transfer/bulk",
				expect.objectContaining({
					method: "POST",
					body: JSON.stringify(input),
				}),
			);
		});

		test("should handle API error response", async () => {
			// Arrange
			mockFetch(mockTransferErrorResponse, false);
			const input = {
				source: "balance" as const,
				transfers: [
					{
						amount: 20000,
						recipient: "RCP_123456",
						reference: "ref_123",
					},
				],
			};

			// Act
			const { data, error } = await paystack.transfer.initiateBulk(input);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(false);
			expect(data?.message).toBe("Invalid key");
		});
	});

	describe("list", () => {
		test("should list transfers", async () => {
			// Arrange
			const fetchSpy = mockFetch(mockListTransfersResponse, true);
			const params = { perPage: 50, page: 1 };

			// Act
			const { data, error } = await paystack.transfer.list(params);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.message).toBe("Transfers retrieved");
			expect(data?.data).toEqual(mockListTransfersResponse.data);
			expect(data?.meta).toEqual(mockListTransfersResponse.meta);

			// Verify fetch was called correctly
			const expectedParams = new URLSearchParams({
				perPage: "50",
				page: "1",
			}).toString();
			expect(fetchSpy).toHaveBeenCalledWith(
				`https://api.paystack.co/transfer?${expectedParams}`,
				expect.any(Object),
			);
		});

		test("should handle API error response", async () => {
			// Arrange
			mockFetch(mockErrorResponse, false);
			const params = { perPage: 50, page: 1 };

			// Act
			const { data, error } = await paystack.transfer.list(params);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(false);
			expect(data?.message).toBe("Invalid key");
		});
	});

	describe("getTransferById", () => {
		test("should get a transfer by ID", async () => {
			// Arrange
			const transferId = "TRF_123456";
			const fetchSpy = mockFetch(mockFetchTransferResponse, true);

			// Act
			const { data, error } = await paystack.transfer.getTransferById(transferId);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.message).toBe("Transfer retrieved");
			expect(data?.data).toEqual(
				expect.objectContaining({
					...mockFetchTransferResponse.data,
				}),
			);

			// Verify fetch was called correctly
			expect(fetchSpy).toHaveBeenCalledWith(
				`https://api.paystack.co/transfer/${transferId}`,
				expect.any(Object),
			);
		});

		test("should handle API error response", async () => {
			// Arrange
			const transferId = "TRF_123456";
			mockFetch(mockErrorResponse, false);

			// Act
			const { data, error } = await paystack.transfer.getTransferById(transferId);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(false);
			expect(data?.message).toBe("Invalid key");
		});
	});

	describe("verify", () => {
		test("should verify a transfer", async () => {
			// Arrange
			const reference = "ref_123456";
			const fetchSpy = mockFetch(mockVerifyTransferResponse, true);

			// Act
			const { data, error } = await paystack.transfer.verify(reference);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.message).toBe("Transfer retrieved");
			expect(data?.data).toEqual(
				expect.objectContaining({
					...mockVerifyTransferResponse.data,
				}),
			);

			// Verify fetch was called correctly
			expect(fetchSpy).toHaveBeenCalledWith(
				`https://api.paystack.co/transfer/verify/${reference}`,
				expect.any(Object),
			);
		});

		test("should handle API error response", async () => {
			// Arrange
			const reference = "ref_123456";
			mockFetch(mockErrorResponse, false);

			// Act
			const { data, error } = await paystack.transfer.verify(reference);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(false);
			expect(data?.message).toBe("Invalid key");
		});
	});
});
