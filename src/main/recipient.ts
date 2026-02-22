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

/**
 * The Recipient class provides methods for interacting with Paystack's Transfer Recipient API.
 */
export class Recipient extends Fetcher {
	/**
	 * Creates a new transfer recipient.
	 * @param input - The recipient details.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async create(input: z.infer<typeof recipientCreateInput>): Promise<
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
								active: boolean;
								createdAt: string;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								domain: string;
								id: number;
								integration: number;
								name: string;
								recipient_code: string;
								type: "nuban" | "ghipss" | "mobile_money";
								updatedAt: string;
								is_deleted: boolean;
								details: {
									authorization_code: unknown;
									account_number: string;
									account_name: string;
									bank_code: string;
									bank_name: string;
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
								active: boolean;
								createdAt: string;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								domain: string;
								id: number;
								integration: number;
								name: string;
								recipient_code: string;
								type: "nuban" | "ghipss" | "mobile_money";
								updatedAt: string;
								is_deleted: boolean;
								details: {
									authorization_code: unknown;
									account_number: string;
									account_name: string;
									bank_code: string;
									bank_name: string;
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

	/**
	 * Creates multiple transfer recipients in bulk.
	 * @param input - The bulk recipient details.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async createBulk(input: z.infer<typeof recipientBulkCreateInput>): Promise<
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
								success: {
									domain: string;
									name: string;
									type: "nuban" | "ghipss" | "mobile_money";
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									metadata: any;
									details: {
										account_number: string;
										account_name: string;
										bank_code: string;
										bank_name: string;
									};
									recipient_code: string;
									active: boolean;
									id: number;
									isDeleted: boolean;
									createdAt: string;
									updatedAt: string;
									description?: string | undefined;
								}[];
								errors: unknown[];
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
								success: {
									domain: string;
									name: string;
									type: "nuban" | "ghipss" | "mobile_money";
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									metadata: any;
									details: {
										account_number: string;
										account_name: string;
										bank_code: string;
										bank_name: string;
									};
									recipient_code: string;
									active: boolean;
									id: number;
									isDeleted: boolean;
									createdAt: string;
									updatedAt: string;
									description?: string | undefined;
								}[];
								errors: unknown[];
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

	/**
	 * Lists transfer recipients.
	 * @param input - Query parameters for listing recipients.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async list(input: z.infer<typeof genericInput>): Promise<
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
								domain: string;
								type: "nuban" | "ghipss" | "mobile_money";
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								name: string;
								details: {
									account_number: string;
									account_name: string | null;
									bank_code: string;
									bank_name: string;
								};
								metadata: any;
								recipient_code: string;
								active: boolean;
								id: number;
								createdAt: string;
								updatedAt: string;
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
								domain: string;
								type: "nuban" | "ghipss" | "mobile_money";
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								name: string;
								details: {
									account_number: string;
									account_name: string | null;
									bank_code: string;
									bank_name: string;
								};
								metadata: any;
								recipient_code: string;
								active: boolean;
								id: number;
								createdAt: string;
								updatedAt: string;
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

	/**
	 * Retrieves a single transfer recipient by ID or code.
	 * @param id_or_code - The ID or code of the recipient.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async getRecipientById(id_or_code: string): Promise<
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
								integration: number;
								domain: string;
								type: "nuban" | "ghipss" | "mobile_money";
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								name: string;
								details: {
									account_number: string;
									account_name: string | null;
									bank_code: string;
									bank_name: string;
								};
								description: string | null;
								metadata: any;
								recipient_code: string;
								active: boolean;
								email: string | null;
								id: number;
								createdAt: string;
								updatedAt: string;
								isDeleted?: boolean | undefined;
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
								integration: number;
								domain: string;
								type: "nuban" | "ghipss" | "mobile_money";
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								name: string;
								details: {
									account_number: string;
									account_name: string | null;
									bank_code: string;
									bank_name: string;
								};
								description: string | null;
								metadata: any;
								recipient_code: string;
								active: boolean;
								email: string | null;
								id: number;
								createdAt: string;
								updatedAt: string;
								isDeleted?: boolean | undefined;
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

	/**
	 * Updates a transfer recipient.
	 * @param input - The recipient details to update.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async update(input: z.infer<typeof recipientUpdateInput>): Promise<{
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

	/**
	 * Deletes a transfer recipient.
	 * @param id_or_code - The ID or code of the recipient to delete.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async delete(id_or_code: string): Promise<{
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
		const { raw } = await this.fetcher(
			`/transferrecipient/${id_or_code}`,
			"DELETE",
		);
		const { data, error } = await genericResponse.safeParseAsync(raw);
		return { data, error };
	}
}
