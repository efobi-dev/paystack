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

	async list(input: z.infer<typeof virtualAccountListInput>) {
		const stringInput = Object.fromEntries(
			Object.entries(input).map(([key, value]) => [key, String(value)]),
		);
		const searchParams = new URLSearchParams(stringInput);
		const { response, raw } = await this.fetcher(
			"/dedicated_account",
			"GET",
			undefined,
			searchParams,
		);

		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await virtualAccountListSuccess.safeParseAsync(raw);
		return { data, error };
	}

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

	async requery(input: z.infer<typeof virtualAccountRequeryInput>) {
		const stringInput = Object.fromEntries(
			Object.entries(input).map(([key, value]) => [key, String(value)]),
		);
		const searchParams = new URLSearchParams(stringInput);
		const { response, raw } = await this.fetcher(
			"/dedicated_account/requery",
			"GET",
			undefined,
			searchParams,
		);

		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await genericResponse.safeParseAsync(raw);
		return { data, error };
	}

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
