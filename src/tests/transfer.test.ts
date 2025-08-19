import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { Paystack } from "../../";
import {
	mockFinalizeTransferResponse,
	mockInitiateBulkTransferResponse,
	mockInitiateTransferResponse,
	mockListTransfersResponse,
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
			expect(data?.data?.transfer_code).toBeDefined();

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
			mockFetch(mockErrorResponse, false);
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
			expect(data?.data?.status).toBe("success");

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
			expect(data?.data).toBeInstanceOf(Array);
			expect(data?.data?.length).toBe(2);

			// Verify fetch was called correctly
			expect(fetchSpy).toHaveBeenCalledWith(
				"https://api.paystack.co/transfer/bulk",
				expect.objectContaining({
					method: "POST",
					body: JSON.stringify(input),
				}),
			);
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
			expect(data?.data).toBeInstanceOf(Array);
			expect(data?.meta?.perPage).toBe(50);

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
	});
});
