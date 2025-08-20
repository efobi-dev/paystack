import type { z } from "zod";
import { genericResponse } from "../zod";
import {
	type transferBulkInitiateInput,
	transferBulkInitiateSuccess,
	transferError,
	type transferFinalizeInput,
	transferFinalizeSuccess,
	type transferInitiateInput,
	transferInitiateSuccess,
	type transferListInput,
	transferListSuccess,
	transferSingleSuccess,
} from "../zod/transfer";
import { Fetcher } from "./fetcher";

/**
 * The Transfer class provides methods for interacting with Paystack's Transfer API.
 */
export class Transfer extends Fetcher {
	/**
	 * Initiates a transfer.
	 * @param input - The transfer details.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async initiate(input: z.infer<typeof transferInitiateInput>) {
		const { response, raw } = await this.fetcher("/transfer", "POST", input);
		if (!response.ok) {
			const { data, error } = await transferError.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await transferInitiateSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Finalizes a transfer with an OTP.
	 * @param input - The transfer finalization details.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async finalize(input: z.infer<typeof transferFinalizeInput>) {
		const { response, raw } = await this.fetcher(
			"/transfer/finalize_transfer",
			"POST",
			input,
		);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await transferFinalizeSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Initiates a bulk transfer.
	 * @param input - The bulk transfer details.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async initiateBulk(input: z.infer<typeof transferBulkInitiateInput>) {
		const { response, raw } = await this.fetcher(
			"/transfer/bulk",
			"POST",
			input,
		);
		if (!response.ok) {
			const { data, error } = await transferError.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } =
			await transferBulkInitiateSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Lists transfers.
	 * @param input - Query parameters for listing transfers.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async list(input: z.infer<typeof transferListInput>) {
		const { response, raw } = await this.fetcher("/transfer", "GET", input);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await transferListSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Retrieves a single transfer by ID or code.
	 * @param id_or_code - The ID or code of the transfer.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async getTransferById(id_or_code: string) {
		const { response, raw } = await this.fetcher(
			`/transfer/${id_or_code}`,
			"GET",
		);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await transferSingleSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Verifies the status of a transfer.
	 * @param reference - The reference of the transfer.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async verify(reference: string) {
		const { response, raw } = await this.fetcher(
			`/transfer/verify/${reference}`,
			"GET",
		);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await transferSingleSuccess.safeParseAsync(raw);
		return { data, error };
	}
}
