import { test, expect, spyOn, afterEach, describe } from "bun:test";
import { Paystack } from "../index";
import {
	mockCreateSplitResponse,
	mockErrorResponse,
	mockListSplitsResponse,
	mockSingleSplitResponse,
	mockUpdateSplitSubaccountResponse,
} from "./mocks";

/**
 * Mock for the global fetch function
 * @param response - The response body to return
 * @param ok - Whether the response should be successful (status 200) or not (status 400)
 * @returns A spy on the global fetch function
 */
const mockFetch = (response: any, ok: boolean) => {
	return spyOn(global, "fetch").mockResolvedValue(
		new Response(JSON.stringify(response), {
			status: ok ? 200 : 400,
			headers: { "Content-Type": "application/json" },
		}),
	);
};

// Restore all mocks after each test
afterEach(() => {
	spyOn(global, "fetch").mockRestore();
});

describe("Split Module", () => {
	const paystack = new Paystack("sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

	describe("create", () => {
		test("should create a new split", async () => {
			// Arrange
			const fetchSpy = mockFetch(mockCreateSplitResponse, true);
			const input = {
				name: "Test Split",
				type: "percentage",
				currency: "NGN",
				subaccounts: [
					{
						subaccount: "ACCT_123456789",
						share: 50,
					},
				],
				bearer_type: "subaccount",
				bearer_subaccount: "ACCT_123456789",
			};

			// Act
			const { data, error } = await paystack.split.create(input);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.data.name).toBe("Test Split");

			// Verify fetch was called correctly
			expect(fetchSpy).toHaveBeenCalledWith(
				"https://api.paystack.co/split",
				expect.objectContaining({
					method: "POST",
					body: JSON.stringify(input),
				}),
			);
		});
	});

	describe("list", () => {
		test("should list all splits", async () => {
			// Arrange
			const fetchSpy = mockFetch(mockListSplitsResponse, true);
			const params = { name: "Test", active: true };

			// Act
			const { data, error } = await paystack.split.list(params);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.data).toBeInstanceOf(Array);

			// Verify fetch was called correctly
			const expectedParams = new URLSearchParams({
				name: "Test",
				active: "true",
			}).toString();
			expect(fetchSpy).toHaveBeenCalledWith(
				`https://api.paystack.co/split?${expectedParams}`,
				expect.any(Object),
			);
		});
	});

	describe("getSplitById", () => {
		test("should retrieve a single split by ID", async () => {
			// Arrange
			const splitId = "SPL_123456789";
			const fetchSpy = mockFetch(mockSingleSplitResponse, true);

			// Act
			const { data, error } = await paystack.split.getSplitById(splitId);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.data.split_code).toBe(splitId);

			// Verify fetch was called correctly
			expect(fetchSpy).toHaveBeenCalledWith(
				`https://api.paystack.co/split/${splitId}`,
				expect.any(Object),
			);
		});
	});

	describe("update", () => {
		test("should update a split", async () => {
			// Arrange
			const fetchSpy = mockFetch(mockSingleSplitResponse, true);
			const input = {
				id: "SPL_123456789",
				name: "New Name",
				active: false,
			};

			// Act
			const { data, error } = await paystack.split.update(input);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);

			// Verify fetch was called correctly
			const { id, ...body } = input;
			expect(fetchSpy).toHaveBeenCalledWith(
				`https://api.paystack.co/split/${id}`,
				expect.objectContaining({
					method: "PUT",
					body: JSON.stringify(body),
				}),
			);
		});
	});

	describe("addOrUpdateSubaccount", () => {
		test("should add or update a subaccount in a split", async () => {
			// Arrange
			const fetchSpy = mockFetch(mockUpdateSplitSubaccountResponse, true);
			const input = {
				id: "SPL_123456789",
				subaccount: "ACCT_987654321",
				share: 30,
			};

			// Act
			const { data, error } = await paystack.split.addOrUpdateSubaccount(input);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);

			// Verify fetch was called correctly
			const { id, ...body } = input;
			expect(fetchSpy).toHaveBeenCalledWith(
				`https://api.paystack.co/split/${id}/subaccount/add`,
				expect.objectContaining({
					method: "POST",
					body: JSON.stringify(body),
				}),
			);
		});
	});

	describe("removeSubaccount", () => {
		test("should remove a subaccount from a split", async () => {
			// Arrange
			const mockResponse = { status: true, message: "Subaccount removed" };
			const fetchSpy = mockFetch(mockResponse, true);
			const input = {
				id: "SPL_123456789",
				subaccount: "ACCT_987654321",
			};

			// Act
			const { data, error } = await paystack.split.removeSubaccount(input);

			// Assert
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);

			// Verify fetch was called correctly
			const { id, ...body } = input;
			expect(fetchSpy).toHaveBeenCalledWith(
				`https://api.paystack.co/split/${id}/subaccount/remove`,
				expect.objectContaining({
					method: "POST",
					body: JSON.stringify({ subaccount: body.subaccount }),
				}),
			);
		});
	});
});
