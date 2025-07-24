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
	type splitUpdateInput,
	splitSubaccountUpdateSuccess,
} from "../zod/split";
import { Fetcher } from "./fetcher";

export class Split extends Fetcher {
	async create(input: z.infer<typeof splitCreateInput>) {
		const { response, raw } = await this.fetcher("/split", "POST", input);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await splitCreateSuccess.safeParseAsync(raw);
		return { data, error };
	}
	async list(input: z.infer<typeof splitListInput>) {
		const stringInput = Object.fromEntries(
			Object.entries(input).map(([key, value]) => [key, String(value)]),
		);
		const searchParams = new URLSearchParams(stringInput);
		const { response, raw } = await this.fetcher(
			"/split",
			"GET",
			undefined,
			searchParams,
		);

		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await splitListSuccess.safeParseAsync(raw);
		return { data, error };
	}

	async getSplitById(id: string) {
		const { raw, response } = await this.fetcher(`/split/${id}`);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await splitSingleSuccess.safeParseAsync(raw);
		return { data, error };
	}

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
