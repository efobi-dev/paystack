import type { z } from "zod";
import { genericResponse } from "../zod";
import {
	type verificationResolveAccountInput,
	verificationResolveAccountSuccess,
	type verificationResolveCardBinInput,
	verificationResolveCardBinSuccess,
	type verificationValidateAccountInput,
	verificationValidateAccountResponse,
} from "../zod/verification";
import { Fetcher } from "./fetcher";

/**
 * The Verification class provides methods for verifying various Paystack entities.
 */
export class Verification extends Fetcher {
	/**
	 * Resolve an account number to a name
	 * @param {z.infer<typeof verificationResolveAccountInput>} input - The account details
	 * @returns {Promise<object>} The response from the API
	 */
	/**
	 * Resolves an account number to a name.
	 * @param input - The account details.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async resolveAccount(input: z.infer<typeof verificationResolveAccountInput>) {
		const { response, raw } = await this.fetcher("/bank/resolve", "GET", input);

		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } =
			await verificationResolveAccountSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Validate a customer's account number
	 * @param {z.infer<typeof verificationValidateAccountInput>} input - The account details
	 * @returns {Promise<object>} The response from the API
	 */
	/**
	 * Validates a customer's account number.
	 * @param input - The account details.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async validateAccount(
		input: z.infer<typeof verificationValidateAccountInput>,
	) {
		const { raw } = await this.fetcher("/bank/validate", "POST", input);
		const { data, error } =
			await verificationValidateAccountResponse.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Resolve a card BIN to a bank
	 * @param {z.infer<typeof verificationResolveCardBinInput>} input - The card BIN
	 * @returns {Promise<object>} The response from the API
	 */
	/**
	 * Resolves a card BIN to a bank.
	 * @param input - The card BIN.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async resolveCardBin(input: z.infer<typeof verificationResolveCardBinInput>) {
		const { response, raw } = await this.fetcher(`/card/bin/${input.card_bin}`);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } =
			await verificationResolveCardBinSuccess.safeParseAsync(raw);
		return { data, error };
	}
}
