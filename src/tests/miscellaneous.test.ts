import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { Paystack } from "../index";
import {
	mockListBanksResponse,
	mockListCountriesResponse,
	mockListStatesResponse,
} from "./mocks";

const mockFetch = (response: any, ok: boolean) => {
	return spyOn(global, "fetch").mockResolvedValue(
		new Response(JSON.stringify(response), {
			status: ok ? 200 : 400,
			headers: { "Content-Type": "application/json" },
		}),
	);
};

afterEach(() => {
	spyOn(global, "fetch").mockRestore();
});

describe("Miscellaneous Module", () => {
	const paystack = new Paystack("sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

	describe("listBanks", () => {
		test("should list all banks", async () => {
			const fetchSpy = mockFetch(mockListBanksResponse, true);
			const params = {
				country: "nigeria" as const,
				perPage: 50,
				use_cursor: false,
			};
			const { data, error } = await paystack.miscellaneous.listBanks(params);
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.data).toBeInstanceOf(Array);
			const expectedParams = new URLSearchParams({
				country: "nigeria",
				perPage: "50",
				use_cursor: "false",
			}).toString();
			expect(fetchSpy).toHaveBeenCalledWith(
				`https://api.paystack.co/bank?${expectedParams}`,
				expect.any(Object),
			);
		});
	});

	describe("listCountries", () => {
		test("should list all countries", async () => {
			const fetchSpy = mockFetch(mockListCountriesResponse, true);
			const { data, error } = await paystack.miscellaneous.listCountries();
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.data).toBeInstanceOf(Array);
			expect(fetchSpy).toHaveBeenCalledWith(
				"https://api.paystack.co/country",
				expect.any(Object),
			);
		});
	});

	describe("listStates", () => {
		test("should list all states in a country", async () => {
			const fetchSpy = mockFetch(mockListStatesResponse, true);
			const params = { country: "NG" };
			const { data, error } = await paystack.miscellaneous.listStates(params);
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.data).toBeInstanceOf(Array);
			const expectedParams = new URLSearchParams(params).toString();
			expect(fetchSpy).toHaveBeenCalledWith(
				`https://api.paystack.co/address_verification/states?${expectedParams}`,
				expect.any(Object),
			);
		});
	});
});
