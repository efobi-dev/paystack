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

export class Verification extends Fetcher {
	async resolveAccount(input: z.infer<typeof verificationResolveAccountInput>) {
		const stringInput = Object.fromEntries(
			Object.entries(input).map(([key, value]) => [key, String(value)]),
		);
		const searchParams = new URLSearchParams(stringInput);
		const { response, raw } = await this.fetcher(
			"/bank/resolve",
			"GET",
			undefined,
			searchParams,
		);

		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } =
			await verificationResolveAccountSuccess.safeParseAsync(raw);
		return { data, error };
	}
	async validateAccount(
		input: z.infer<typeof verificationValidateAccountInput>,
	) {
		const { raw } = await this.fetcher("/bank/validate", "POST", input);
		const { data, error } =
			await verificationValidateAccountResponse.safeParseAsync(raw);
		return { data, error };
	}
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
