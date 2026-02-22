import type { z } from "zod";
import { genericResponse } from "../zod";
import {
	type miscellaneousListBanksInput,
	miscellaneousListBanksSuccess,
	miscellaneousListCountriesSuccess,
	type miscellaneousListStatesInput,
	miscellaneousListStatesSuccess,
} from "../zod/miscellaneous";
import { Fetcher } from "./fetcher";

export class Miscellaneous extends Fetcher {
	/**
	 * Get a list of all supported banks
	 * @param {z.infer<typeof miscellaneousListBanksInput>} input - The query parameters
	 * @returns {Promise<object>} The response from the API
	 */
	async listBanks(input: z.infer<typeof miscellaneousListBanksInput>): Promise<
		| {
				data:
					| {
							status: boolean;
							message: string;
							data?: Record<string, never> | undefined;
							meta?:
								| {
										total?: number | undefined;
										skipped?: number | undefined;
										perPage?: number | undefined;
										page?: number | undefined;
										pageCount?: number | undefined;
								  }
								| undefined;
					  }
					| undefined;
				error:
					| z.ZodError<{
							status: boolean;
							message: string;
							data?: Record<string, never> | undefined;
							meta?:
								| {
										total?: number | undefined;
										skipped?: number | undefined;
										perPage?: number | undefined;
										page?: number | undefined;
										pageCount?: number | undefined;
								  }
								| undefined;
					  }>
					| undefined;
		  }
		| {
				data:
					| {
							status: boolean;
							message: string;
							data: {
								name: string;
								slug: string;
								code: string;
								longcode: string;
								gateway: unknown;
								pay_with_bank: boolean;
								active: boolean;
								is_deleted: boolean;
								country: string;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								type: string;
								id: number;
								createdAt: string | null;
								updatedAt: string | null;
							}[];
							meta?:
								| {
										total?: number | undefined;
										skipped?: number | undefined;
										perPage?: number | undefined;
										page?: number | undefined;
										pageCount?: number | undefined;
								  }
								| undefined;
					  }
					| undefined;
				error:
					| z.ZodError<{
							status: boolean;
							message: string;
							data: {
								name: string;
								slug: string;
								code: string;
								longcode: string;
								gateway: unknown;
								pay_with_bank: boolean;
								active: boolean;
								is_deleted: boolean;
								country: string;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								type: string;
								id: number;
								createdAt: string | null;
								updatedAt: string | null;
							}[];
							meta?:
								| {
										total?: number | undefined;
										skipped?: number | undefined;
										perPage?: number | undefined;
										page?: number | undefined;
										pageCount?: number | undefined;
								  }
								| undefined;
					  }>
					| undefined;
		  }
	> {
		const { response, raw } = await this.fetcher("/bank", "GET", input);

		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } =
			await miscellaneousListBanksSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Get a list of all supported countries
	 * @returns {Promise<object>} The response from the API
	 */
	async listCountries(): Promise<
		| {
				data:
					| {
							status: boolean;
							message: string;
							data?: Record<string, never> | undefined;
							meta?:
								| {
										total?: number | undefined;
										skipped?: number | undefined;
										perPage?: number | undefined;
										page?: number | undefined;
										pageCount?: number | undefined;
								  }
								| undefined;
					  }
					| undefined;
				error:
					| z.ZodError<{
							status: boolean;
							message: string;
							data?: Record<string, never> | undefined;
							meta?:
								| {
										total?: number | undefined;
										skipped?: number | undefined;
										perPage?: number | undefined;
										page?: number | undefined;
										pageCount?: number | undefined;
								  }
								| undefined;
					  }>
					| undefined;
		  }
		| {
				data:
					| {
							status: boolean;
							message: string;
							data: {
								id: number;
								name: string;
								iso_code: string;
								default_currency_code: string;
								integration_defaults: Record<string, never>;
								relationships: {
									currency: {
										type: string;
										data: string[];
									};
									integration_feature: {
										type: string;
										data: string[];
									};
									integration_type: {
										type: string;
										data: string[];
									};
									payment_method: {
										type: string;
										data: string[];
									};
								};
							}[];
							meta?:
								| {
										total?: number | undefined;
										skipped?: number | undefined;
										perPage?: number | undefined;
										page?: number | undefined;
										pageCount?: number | undefined;
								  }
								| undefined;
					  }
					| undefined;
				error:
					| z.ZodError<{
							status: boolean;
							message: string;
							data: {
								id: number;
								name: string;
								iso_code: string;
								default_currency_code: string;
								integration_defaults: Record<string, never>;
								relationships: {
									currency: {
										type: string;
										data: string[];
									};
									integration_feature: {
										type: string;
										data: string[];
									};
									integration_type: {
										type: string;
										data: string[];
									};
									payment_method: {
										type: string;
										data: string[];
									};
								};
							}[];
							meta?:
								| {
										total?: number | undefined;
										skipped?: number | undefined;
										perPage?: number | undefined;
										page?: number | undefined;
										pageCount?: number | undefined;
								  }
								| undefined;
					  }>
					| undefined;
		  }
	> {
		const { response, raw } = await this.fetcher("/country");
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } =
			await miscellaneousListCountriesSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Get a list of all supported states in a country
	 * @param {z.infer<typeof miscellaneousListStatesInput>} input - The query parameters
	 * @returns {Promise<object>} The response from the API
	 */
	async listStates(
		input: z.infer<typeof miscellaneousListStatesInput>,
	): Promise<
		| {
				data:
					| {
							status: boolean;
							message: string;
							data?: Record<string, never> | undefined;
							meta?:
								| {
										total?: number | undefined;
										skipped?: number | undefined;
										perPage?: number | undefined;
										page?: number | undefined;
										pageCount?: number | undefined;
								  }
								| undefined;
					  }
					| undefined;
				error:
					| z.ZodError<{
							status: boolean;
							message: string;
							data?: Record<string, never> | undefined;
							meta?:
								| {
										total?: number | undefined;
										skipped?: number | undefined;
										perPage?: number | undefined;
										page?: number | undefined;
										pageCount?: number | undefined;
								  }
								| undefined;
					  }>
					| undefined;
		  }
		| {
				data:
					| {
							status: boolean;
							message: string;
							data: {
								name: string;
								slug: string;
								abbreviation: string;
							}[];
							meta?:
								| {
										total?: number | undefined;
										skipped?: number | undefined;
										perPage?: number | undefined;
										page?: number | undefined;
										pageCount?: number | undefined;
								  }
								| undefined;
					  }
					| undefined;
				error:
					| z.ZodError<{
							status: boolean;
							message: string;
							data: {
								name: string;
								slug: string;
								abbreviation: string;
							}[];
							meta?:
								| {
										total?: number | undefined;
										skipped?: number | undefined;
										perPage?: number | undefined;
										page?: number | undefined;
										pageCount?: number | undefined;
								  }
								| undefined;
					  }>
					| undefined;
		  }
	> {
		const { response, raw } = await this.fetcher(
			"/address_verification/states",
			"GET",
			input,
		);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } =
			await miscellaneousListStatesSuccess.safeParseAsync(raw);
		return { data, error };
	}
}
