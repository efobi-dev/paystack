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
	async listBanks(input: z.infer<typeof miscellaneousListBanksInput>) {
		const stringInput = Object.fromEntries(
			Object.entries(input).map(([key, value]) => [key, String(value)]),
		);
		const searchParams = new URLSearchParams(stringInput);
		const { response, raw } = await this.fetcher(
			"/bank",
			"GET",
			undefined,
			searchParams,
		);

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
	async listCountries() {
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
	async listStates(input: z.infer<typeof miscellaneousListStatesInput>) {
		const stringInput = Object.fromEntries(
			Object.entries(input).map(([key, value]) => [key, String(value)]),
		);
		const searchParams = new URLSearchParams(stringInput);
		const { response, raw } = await this.fetcher(
			"/address_verification/states",
			"GET",
			undefined,
			searchParams,
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
