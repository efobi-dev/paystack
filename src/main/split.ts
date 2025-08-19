import type { z } from "zod";
import { genericResponse } from "../zod";
import {
	type splitCreateInput,
	splitCreateSuccess,
	type splitListInput,
	splitListSuccess,
	splitSingleSuccess,
	type splitSubaccountInput,
	splitSubaccountRemoveError,
	type splitSubaccountRemoveInput,
	splitSubaccountUpdateSuccess,
	type splitUpdateInput,
} from "../zod/split";
import { Fetcher } from "./fetcher";

export class Split extends Fetcher {
	/**
	 * Create a split on your integration
	 * @param {z.infer<typeof splitCreateInput>} input - The split details
	 * @returns {Promise<object>} The response from the API
	 */
	async create(input: z.infer<typeof splitCreateInput>) {
		const { response, raw } = await this.fetcher("/split", "POST", input);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await splitCreateSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * List the transaction splits available on your integration
	 * @param {z.infer<typeof splitListInput>} input - The query parameters
	 * @returns {Promise<object>} The response from the API
	 */
	async list(input: z.infer<typeof splitListInput>) {
		const { response, raw } = await this.fetcher("/split", "GET", input);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await splitListSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Get details of a split on your integration
	 * @param {string} id - The ID of the split
	 * @returns {Promise<object>} The response from the API
	 */
	async getSplitById(id: string) {
		const { raw, response } = await this.fetcher(`/split/${id}`);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await splitSingleSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Update a split details on your integration
	 * @param {z.infer<typeof splitUpdateInput>} input - The split details
	 * @returns {Promise<object>} The response from the API
	 */
	async update(input: z.infer<typeof splitUpdateInput>) {
		const { id, ...rest } = input;
		const { response, raw } = await this.fetcher(`/split/${id}`, "PUT", rest);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await splitSingleSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Add a subaccount to a split
	 * @param {z.infer<typeof splitSubaccountInput>} input - The subaccount details
	 * @returns {Promise<object>} The response from the API
	 */
	async addOrUpdateSubaccount(input: z.infer<typeof splitSubaccountInput>) {
		const { id, ...rest } = input;
		const { response, raw } = await this.fetcher(
			`/split/${id}/subaccount/add`,
			"POST",
			rest,
		);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } =
			await splitSubaccountUpdateSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Remove a subaccount from a split
	 * @param {z.infer<typeof splitSubaccountRemoveInput>} input - The subaccount details
	 * @returns {Promise<object>} The response from the API
	 */
	async removeSubaccount(input: z.infer<typeof splitSubaccountRemoveInput>) {
		const { id, subaccount } = input;
		const { response, raw } = await this.fetcher(
			`/split/${id}/subaccount/remove`,
			"POST",
			{ subaccount },
		);
		if (!response.ok) {
			const { data, error } =
				await splitSubaccountRemoveError.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await genericResponse.safeParseAsync(raw);
		return { data, error };
	}
}
