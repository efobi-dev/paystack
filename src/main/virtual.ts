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

/**
 * The VirtualAccount class provides methods for interacting with Paystack's Dedicated Virtual Account API.
 */
export class VirtualAccount extends Fetcher {
	/**
	 * Create a dedicated virtual account
	 * @param {z.infer<typeof virtualAccountCreateInput>} input - The virtual account details
	 * @returns {Promise<object>} The response from the API
	 */
	/**
	 * Creates a dedicated virtual account.
	 * @param input - The virtual account details.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async create(input: z.infer<typeof virtualAccountCreateInput>): Promise<
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
								bank: {
									name: string;
									id: number;
									slug: string;
								};
								account_name: string;
								account_number: string;
								assigned: boolean;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								metadata: any;
								active: boolean;
								id: number;
								created_at: string;
								updated_at: string;
								assignment: {
									integration: number;
									assignee_id: number;
									assignee_type: string;
									expired: boolean;
									account_type: string;
									assigned_at: string;
								};
								customer: {
									id: number;
									email: string;
									first_name: string | null;
									last_name: string | null;
									phone: string | null;
									customer_code: string;
									risk_action: string;
								};
							};
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
								bank: {
									name: string;
									id: number;
									slug: string;
								};
								account_name: string;
								account_number: string;
								assigned: boolean;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								metadata: any;
								active: boolean;
								id: number;
								created_at: string;
								updated_at: string;
								assignment: {
									integration: number;
									assignee_id: number;
									assignee_type: string;
									expired: boolean;
									account_type: string;
									assigned_at: string;
								};
								customer: {
									id: number;
									email: string;
									first_name: string | null;
									last_name: string | null;
									phone: string | null;
									customer_code: string;
									risk_action: string;
								};
							};
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
	/**
	 * Assigns a dedicated virtual account to a customer.
	 * @param input - The assignment details.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async assign(input: z.infer<typeof virtualAccountAssignInput>): Promise<{
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
	}> {
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
	/**
	 * Lists dedicated virtual accounts.
	 * @param input - Query parameters for listing virtual accounts.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async list(input: z.infer<typeof virtualAccountListInput>): Promise<
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
								bank: {
									name: string;
									id: number;
									slug: string;
								};
								account_name: string;
								account_number: string;
								assigned: boolean;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								metadata: any;
								active: boolean;
								id: number;
								created_at: string;
								updated_at: string;
								assignment: {
									integration: number;
									assignee_id: number;
									assignee_type: string;
									expired: boolean;
									account_type: string;
									assigned_at: string;
								};
								customer: {
									id: number;
									email: string;
									first_name: string | null;
									last_name: string | null;
									phone: string | null;
									customer_code: string;
									risk_action: string;
								};
							}[];
							meta: {
								total?: number | undefined;
								skipped?: number | undefined;
								perPage?: number | undefined;
								page?: number | undefined;
								pageCount?: number | undefined;
							};
					  }
					| undefined;
				error:
					| z.ZodError<{
							status: boolean;
							message: string;
							data: {
								bank: {
									name: string;
									id: number;
									slug: string;
								};
								account_name: string;
								account_number: string;
								assigned: boolean;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								metadata: any;
								active: boolean;
								id: number;
								created_at: string;
								updated_at: string;
								assignment: {
									integration: number;
									assignee_id: number;
									assignee_type: string;
									expired: boolean;
									account_type: string;
									assigned_at: string;
								};
								customer: {
									id: number;
									email: string;
									first_name: string | null;
									last_name: string | null;
									phone: string | null;
									customer_code: string;
									risk_action: string;
								};
							}[];
							meta: {
								total?: number | undefined;
								skipped?: number | undefined;
								perPage?: number | undefined;
								page?: number | undefined;
								pageCount?: number | undefined;
							};
					  }>
					| undefined;
		  }
	> {
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
	/**
	 * Retrieves details of a dedicated virtual account.
	 * @param dedicated_account_id - The ID of the dedicated virtual account.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async fetch(dedicated_account_id: string): Promise<
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
								bank: {
									name: string;
									id: number;
									slug: string;
								};
								account_name: string;
								account_number: string;
								assigned: boolean;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								metadata: any;
								active: boolean;
								id: number;
								created_at: string;
								updated_at: string;
								assignment: {
									integration: number;
									assignee_id: number;
									assignee_type: string;
									expired: boolean;
									account_type: string;
									assigned_at: string;
								};
								customer: {
									id: number;
									first_name: string | null;
									last_name: string | null;
									email: string;
									phone: string | null;
									metadata: any;
									customer_code: string;
									risk_action: string;
									international_format_phone: string | null;
								};
								split_config: string;
							};
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
								bank: {
									name: string;
									id: number;
									slug: string;
								};
								account_name: string;
								account_number: string;
								assigned: boolean;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								metadata: any;
								active: boolean;
								id: number;
								created_at: string;
								updated_at: string;
								assignment: {
									integration: number;
									assignee_id: number;
									assignee_type: string;
									expired: boolean;
									account_type: string;
									assigned_at: string;
								};
								customer: {
									id: number;
									first_name: string | null;
									last_name: string | null;
									email: string;
									phone: string | null;
									metadata: any;
									customer_code: string;
									risk_action: string;
									international_format_phone: string | null;
								};
								split_config: string;
							};
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
	/**
	 * Requeries a dedicated virtual account for new transactions.
	 * @param input - The requery details.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async requery(input: z.infer<typeof virtualAccountRequeryInput>): Promise<{
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
	}> {
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
	/**
	 * Deactivates a dedicated virtual account.
	 * @param dedicated_account_id - The ID of the dedicated virtual account to deactivate.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async deactivate(dedicated_account_id: string): Promise<
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
								bank: {
									name: string;
									id: number;
									slug: string;
								};
								account_name: string;
								account_number: string;
								assigned: boolean;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								metadata: any;
								active: boolean;
								id: number;
								created_at: string;
								updated_at: string;
								assignment: {
									account_type: string;
									integration: number;
									assignee_id: number;
									assignee_type: string;
									assigned_at: string;
								};
								customer: {
									id: number;
									first_name: string | null;
									last_name: string | null;
									email: string;
									phone: string | null;
									metadata: any;
									customer_code: string;
									risk_action: string;
									international_format_phone: string | null;
								};
								split_config: string;
							};
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
								bank: {
									name: string;
									id: number;
									slug: string;
								};
								account_name: string;
								account_number: string;
								assigned: boolean;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								metadata: any;
								active: boolean;
								id: number;
								created_at: string;
								updated_at: string;
								assignment: {
									account_type: string;
									integration: number;
									assignee_id: number;
									assignee_type: string;
									assigned_at: string;
								};
								customer: {
									id: number;
									first_name: string | null;
									last_name: string | null;
									email: string;
									phone: string | null;
									metadata: any;
									customer_code: string;
									risk_action: string;
									international_format_phone: string | null;
								};
								split_config: string;
							};
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
	/**
	 * Adds a split to a dedicated virtual account.
	 * @param input - The split details.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async addSplit(input: z.infer<typeof virtualAccountAddSplitInput>): Promise<
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
								bank: {
									name: string;
									id: number;
									slug: string;
								};
								account_name: string;
								account_number: string;
								assigned: boolean;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								metadata: any;
								active: boolean;
								id: number;
								created_at: string;
								updated_at: string;
								assignment: {
									integration: number;
									assignee_id: number;
									assignee_type: string;
									expired: boolean;
									account_type: string;
									assigned_at: string;
									expired_at: string | null;
								};
								customer: {
									id: number;
									metadata: any;
									email: string;
									first_name: string | null;
									last_name: string | null;
									phone: string | null;
									customer_code: string;
									risk_action: string;
								};
								split_config: {
									split_code: string;
								};
							};
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
								bank: {
									name: string;
									id: number;
									slug: string;
								};
								account_name: string;
								account_number: string;
								assigned: boolean;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								metadata: any;
								active: boolean;
								id: number;
								created_at: string;
								updated_at: string;
								assignment: {
									integration: number;
									assignee_id: number;
									assignee_type: string;
									expired: boolean;
									account_type: string;
									assigned_at: string;
									expired_at: string | null;
								};
								customer: {
									id: number;
									metadata: any;
									email: string;
									first_name: string | null;
									last_name: string | null;
									phone: string | null;
									customer_code: string;
									risk_action: string;
								};
								split_config: {
									split_code: string;
								};
							};
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
	/**
	 * Removes a split from a dedicated virtual account.
	 * @param input - The split details.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async removeSplit(
		input: z.infer<typeof virtualAccountRemoveSplitInput>,
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
								id: number;
								split_config: Record<string, never>;
								account_name: string;
								account_number: string;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								assigned: boolean;
								active: boolean;
								created_at: string;
								updated_at: string;
							};
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
								split_config: Record<string, never>;
								account_name: string;
								account_number: string;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								assigned: boolean;
								active: boolean;
								created_at: string;
								updated_at: string;
							};
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
	/**
	 * Fetches available bank providers for dedicated virtual accounts.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async fetchBanks(): Promise<
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
								provider_slug: string;
								bank_id: number;
								bank_name: string;
								id: number;
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
								provider_slug: string;
								bank_id: number;
								bank_name: string;
								id: number;
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
