import type { z } from "zod";
import { type genericInput, genericResponse } from "../zod";
import {
	type recipientBulkCreateInput,
	recipientBulkCreateSuccess,
	type recipientCreateInput,
	recipientCreateSuccess,
	recipientListSuccess,
	recipientSingleSuccess,
	type recipientUpdateInput,
} from "../zod/recipient";
import { Fetcher } from "./fetcher";

/**
 * The Recipient class provides methods for interacting with Paystack's Transfer Recipient API.
 */
export class Recipient extends Fetcher {
	/**
	 * Creates a new transfer recipient.
	 * @param input - The recipient details.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async create(input: z.infer<typeof recipientCreateInput>) {
		const { response, raw } = await this.fetcher(
			"/transferrecipient",
			"POST",
			input,
		);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await recipientCreateSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Creates multiple transfer recipients in bulk.
	 * @param input - The bulk recipient details.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async createBulk(input: z.infer<typeof recipientBulkCreateInput>) {
		const { response, raw } = await this.fetcher(
			"/transferrecipient/bulk",
			"POST",
			input,
		);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } =
			await recipientBulkCreateSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Lists transfer recipients.
	 * @param input - Query parameters for listing recipients.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async list(input: z.infer<typeof genericInput>) {
		const { response, raw } = await this.fetcher(
			"/transferrecipient",
			"GET",
			input,
		);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await recipientListSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Retrieves a single transfer recipient by ID or code.
	 * @param id_or_code - The ID or code of the recipient.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async getRecipientById(id_or_code: string) {
		const { response, raw } = await this.fetcher(
			`/transferrecipient/${id_or_code}`,
			"GET",
		);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await recipientSingleSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Updates a transfer recipient.
	 * @param input - The recipient details to update.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async update(input: z.infer<typeof recipientUpdateInput>) {
		const { id_or_code, ...rest } = input;
		const { response, raw } = await this.fetcher(
			`/transferrecipient/${id_or_code}`,
			"PUT",
			rest,
		);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await genericResponse.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Deletes a transfer recipient.
	 * @param id_or_code - The ID or code of the recipient to delete.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async delete(id_or_code: string) {
		const { raw } = await this.fetcher(
			`/transferrecipient/${id_or_code}`,
			"DELETE",
		);
		const { data, error } = await genericResponse.safeParseAsync(raw);
		return { data, error };
	}
}
