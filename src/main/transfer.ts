import type { z } from "zod";
import { genericResponse } from "../zod";
import {
	type transferBulkInitiateInput,
	transferBulkInitiateSuccess,
	type transferCreateRecipientInput,
	transferCreateRecipientSuccess,
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

export class Transfer extends Fetcher {
	async createRecipient(input: z.infer<typeof transferCreateRecipientInput>) {
		const { response, raw } = await this.fetcher(
			"/transferrecipient",
			"POST",
			input,
		);
		if (!response.ok) {
			const { data, error } = await transferError.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } =
			await transferCreateRecipientSuccess.safeParseAsync(raw);
		return { data, error };
	}

	async initialize(input: z.infer<typeof transferInitiateInput>) {
		const { response, raw } = await this.fetcher("/transfer", "POST", input);
		if (!response.ok) {
			const { data, error } = await transferError.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await transferInitiateSuccess.safeParseAsync(raw);
		return { data, error };
	}

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

	async list(input: z.infer<typeof transferListInput>) {
		const { response, raw } = await this.fetcher("/transfer", "GET", input);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await transferListSuccess.safeParseAsync(raw);
		return { data, error };
	}

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
