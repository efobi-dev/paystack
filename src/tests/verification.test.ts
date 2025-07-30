import { test, expect, spyOn, afterEach, describe } from "bun:test";
import { Paystack } from "../index";
import {
	mockErrorResponse,
	mockResolveAccountResponse,
	mockResolveCardBinResponse,
	mockValidateAccountResponse,
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

describe("Verification Module", () => {
	const paystack = new Paystack("sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

	describe("resolveAccount", () => {
		test("should resolve an account number", async () => {
			const fetchSpy = mockFetch(mockResolveAccountResponse, true);
			const input = { account_number: "0123456789", bank_code: "058" };
			const { data, error } = await paystack.verification.resolveAccount(input);
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.data.account_name).toBe("John Doe");
			const expectedParams = new URLSearchParams(input).toString();
			expect(fetchSpy).toHaveBeenCalledWith(
				`https://api.paystack.co/bank/resolve?${expectedParams}`,
				expect.any(Object),
			);
		});
	});

	describe("validateAccount", () => {
		test("should validate an account", async () => {
			const fetchSpy = mockFetch(mockValidateAccountResponse, true);
			const input = {
				account_name: "John Doe",
				account_number: "0123456789",
				account_type: "personal",
				bank_code: "058",
				country_code: "NG",
				document_type: "identityNumber",
			};
			const { data, error } = await paystack.verification.validateAccount(
				input,
			);
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.data.verified).toBe(true);
			expect(fetchSpy).toHaveBeenCalledWith(
				"https://api.paystack.co/bank/validate",
				expect.objectContaining({ method: "POST" }),
			);
		});
	});

	describe("resolveCardBin", () => {
		test("should resolve a card BIN", async () => {
			const cardBin = "408408";
			const fetchSpy = mockFetch(mockResolveCardBinResponse, true);
			const { data, error } = await paystack.verification.resolveCardBin({
				card_bin: cardBin,
			});
			expect(error).toBeUndefined();
			expect(data).toBeDefined();
			expect(data?.status).toBe(true);
			expect(data?.data.bin).toBe(cardBin);
			expect(fetchSpy).toHaveBeenCalledWith(
				`https://api.paystack.co/card/bin/${cardBin}`,
				expect.any(Object),
			);
		});
	});
});
