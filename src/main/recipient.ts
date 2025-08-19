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

export class Recipient extends Fetcher {
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

	async delete(id_or_code: string) {
		const { raw } = await this.fetcher(
			`/transferrecipient/${id_or_code}`,
			"DELETE",
		);
		const { data, error } = await genericResponse.safeParseAsync(raw);
		return { data, error };
	}
}
