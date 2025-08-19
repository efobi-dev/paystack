import type { z } from "zod";
import { genericResponse } from "../zod";
import {
	fetchBanksSuccess,
	type virtualAccountAddSplitInput,
	virtualAccountAddSplitSuccess,
	type virtualAccountAssignInput,
	type virtualAccountCreateInput,
	virtualAccountCreateSuccess,
	virtualAccountDeleteSuccess,
	virtualAccountFetchSuccess,
	type virtualAccountListInput,
	virtualAccountListSuccess,
	type virtualAccountRemoveSplitInput,
	virtualAccountRemoveSplitSuccess,
	type virtualAccountRequeryInput,
} from "../zod/virtual";
import { Fetcher } from "./fetcher";

export class VirtualAccount extends Fetcher {
	/**
	 * Create a dedicated virtual account
	 * @param {z.infer<typeof virtualAccountCreateInput>} input - The virtual account details
	 * @returns {Promise<object>} The response from the API
	 */
	async create(input: z.infer<typeof virtualAccountCreateInput>) {
		const { response, raw } = await this.fetcher(
			"/dedicated_account",
			"POST",
			input,
		);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } =
			await virtualAccountCreateSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Assign a dedicated virtual account to a customer
	 * @param {z.infer<typeof virtualAccountAssignInput>} input - The assignment details
	 * @returns {Promise<object>} The response from the API
	 */
	async assign(input: z.infer<typeof virtualAccountAssignInput>) {
		const { response, raw } = await this.fetcher(
			"/dedicated_account/assign",
			"POST",
			input,
		);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await genericResponse.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * List dedicated virtual accounts available on your integration
	 * @param {z.infer<typeof virtualAccountListInput>} input - The query parameters
	 * @returns {Promise<object>} The response from the API
	 */
	async list(input: z.infer<typeof virtualAccountListInput>) {
		const { response, raw } = await this.fetcher(
			"/dedicated_account",
			"GET",
			input,
		);

		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await virtualAccountListSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Get details of a dedicated virtual account on your integration
	 * @param {string} dedicated_account_id - The ID of the dedicated virtual account
	 * @returns {Promise<object>} The response from the API
	 */
	async fetch(dedicated_account_id: string) {
		const { response, raw } = await this.fetcher(
			`/dedicated_account/${dedicated_account_id}`,
		);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } =
			await virtualAccountFetchSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Requery a dedicated virtual account for new transactions
	 * @param {z.infer<typeof virtualAccountRequeryInput>} input - The requery details
	 * @returns {Promise<object>} The response from the API
	 */
	async requery(input: z.infer<typeof virtualAccountRequeryInput>) {
		const { response, raw } = await this.fetcher(
			"/dedicated_account/requery",
			"GET",
			input,
		);

		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await genericResponse.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Deactivate a dedicated virtual account on your integration
	 * @param {string} dedicated_account_id - The ID of the dedicated virtual account
	 * @returns {Promise<object>} The response from the API
	 */
	async deactivate(dedicated_account_id: string) {
		const { response, raw } = await this.fetcher(
			`/dedicated_account/${dedicated_account_id}`,
			"DELETE",
		);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } =
			await virtualAccountDeleteSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Add a split to a dedicated virtual account
	 * @param {z.infer<typeof virtualAccountAddSplitInput>} input - The split details
	 * @returns {Promise<object>} The response from the API
	 */
	async addSplit(input: z.infer<typeof virtualAccountAddSplitInput>) {
		const { response, raw } = await this.fetcher(
			"/dedicated_account/split",
			"POST",
			input,
		);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } =
			await virtualAccountAddSplitSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Remove a split from a dedicated virtual account
	 * @param {z.infer<typeof virtualAccountRemoveSplitInput>} input - The split details
	 * @returns {Promise<object>} The response from the API
	 */
	async removeSplit(input: z.infer<typeof virtualAccountRemoveSplitInput>) {
		const { response, raw } = await this.fetcher(
			"/dedicated_account/split",
			"DELETE",
			input,
		);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } =
			await virtualAccountRemoveSplitSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Get available bank providers for a dedicated virtual account
	 * @returns {Promise<object>} The response from the API
	 */
	async fetchBanks() {
		const { response, raw } = await this.fetcher(
			"/dedicated_account/available_providers",
		);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await fetchBanksSuccess.safeParseAsync(raw);
		return { data, error };
	}
}
