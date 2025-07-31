import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { Paystack } from "../index";
import {
	mockAddSplitToVirtualAccountResponse,
	mockCreateVirtualAccountResponse,
	mockDeactivateVirtualAccountResponse,
	mockFetch,
	mockFetchProvidersResponse,
	mockFetchVirtualAccountResponse,
	mockListVirtualAccountsResponse,
	mockRemoveSplitFromVirtualAccountResponse,
} from "./mocks";

afterEach(() => {
	spyOn(global, "fetch").mockRestore();
});

describe("Virtual Account Module", () => {
	const paystack = new Paystack("sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

	describe("create", () => {
		test("should create a virtual account", async () => {
			const fetchSpy = mockFetch(mockCreateVirtualAccountResponse, true);
			const input = { customer: "CUS_123456789" };
			const { data, error } = await paystack.virtualAccount.create(input);
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(fetchSpy).toHaveBeenCalledWith(
				"https://api.paystack.co/dedicated_account",
				expect.objectContaining({ method: "POST" }),
			);
		});
	});

	describe("assign", () => {
		test("should assign a virtual account", async () => {
			const mockResponse = { status: true, message: "Assigned" };
			const fetchSpy = mockFetch(mockResponse, true);
			const input = {
				email: "test@test.com",
				first_name: "Test",
				last_name: "User",
				phone: "08012345678",
				country: "NG" as const,
			};
			const { data, error } = await paystack.virtualAccount.assign(input);
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(fetchSpy).toHaveBeenCalledWith(
				"https://api.paystack.co/dedicated_account/assign",
				expect.objectContaining({ method: "POST" }),
			);
		});
	});

	describe("list", () => {
		test("should list virtual accounts", async () => {
			const fetchSpy = mockFetch(mockListVirtualAccountsResponse, true);
			const params = { active: true, currency: "NGN" as const };
			const { data, error } = await paystack.virtualAccount.list(params);
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.data).toBeInstanceOf(Array);
			expect(fetchSpy).toHaveBeenCalledWith(
				expect.stringContaining("/dedicated_account"),
				expect.any(Object),
			);
		});
	});

	describe("fetch", () => {
		test("should fetch a virtual account", async () => {
			const accountId = "123";
			const fetchSpy = mockFetch(mockFetchVirtualAccountResponse, true);
			const { data, error } = await paystack.virtualAccount.fetch(accountId);
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.data?.id).toBe(123);
			expect(fetchSpy).toHaveBeenCalledWith(
				`https://api.paystack.co/dedicated_account/${accountId}`,
				expect.any(Object),
			);
		});
	});

	describe("requery", () => {
		test("should requery a virtual account", async () => {
			const mockResponse = { status: true, message: "Requeried" };
			const fetchSpy = mockFetch(mockResponse, true);
			const input = {
				account_number: "1234567890",
				provider_slug: "wema-bank",
			};
			const { data, error } = await paystack.virtualAccount.requery(input);
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(fetchSpy).toHaveBeenCalledWith(
				expect.stringContaining("/dedicated_account/requery"),
				expect.any(Object),
			);
		});
	});

	describe("deactivate", () => {
		test("should deactivate a virtual account", async () => {
			const accountId = "123";
			const fetchSpy = mockFetch(mockDeactivateVirtualAccountResponse, true);
			const { data, error } =
				await paystack.virtualAccount.deactivate(accountId);
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(fetchSpy).toHaveBeenCalledWith(
				`https://api.paystack.co/dedicated_account/${accountId}`,
				expect.objectContaining({ method: "DELETE" }),
			);
		});
	});

	describe("addSplit", () => {
		test("should add a split to a virtual account", async () => {
			const fetchSpy = mockFetch(mockAddSplitToVirtualAccountResponse, true);
			const input = { customer: "CUS_123456789" };
			const { data, error } = await paystack.virtualAccount.addSplit(input);
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(fetchSpy).toHaveBeenCalledWith(
				"https://api.paystack.co/dedicated_account/split",
				expect.objectContaining({ method: "POST" }),
			);
		});
	});

	describe("removeSplit", () => {
		test("should remove a split from a virtual account", async () => {
			const fetchSpy = mockFetch(
				mockRemoveSplitFromVirtualAccountResponse,
				true,
			);
			const input = { account_number: "1234567890" };
			const { data, error } = await paystack.virtualAccount.removeSplit(input);
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(fetchSpy).toHaveBeenCalledWith(
				"https://api.paystack.co/dedicated_account/split",
				expect.objectContaining({ method: "DELETE" }),
			);
		});
	});

	describe("fetchBanks", () => {
		test("should fetch available providers", async () => {
			const fetchSpy = mockFetch(mockFetchProvidersResponse, true);
			const { data, error } = await paystack.virtualAccount.fetchBanks();
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.data).toBeInstanceOf(Array);
			expect(fetchSpy).toHaveBeenCalledWith(
				"https://api.paystack.co/dedicated_account/available_providers",
				expect.any(Object),
			);
		});
	});
});
