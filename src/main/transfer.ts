import type { z } from "zod";
import { genericResponse } from "../zod";
import {
	type transferBulkInitiateInput,
	transferBulkInitiateSuccess,
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

/**
 * The Transfer class provides methods for interacting with Paystack's Transfer API.
 */
export class Transfer extends Fetcher {
	/**
	 * Initiates a transfer.
	 * @param input - The transfer details.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async initiate(input: z.infer<typeof transferInitiateInput>): Promise<
		| {
				data:
					| {
							status: boolean;
							message: string;
							meta: {
								nextStep: string;
							};
							type: string;
							code: string;
							data?: Record<string, never> | undefined;
					  }
					| undefined;
				error:
					| z.ZodError<{
							status: boolean;
							message: string;
							meta: {
								nextStep: string;
							};
							type: string;
							code: string;
							data?: Record<string, never> | undefined;
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
								amount: number;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								reference: string;
								source: string;
								reason: string;
								status: string;
								failures: unknown;
								transfer_code: string;
								titan_code: string | null;
								transferred_at: unknown;
								id: number;
								integration: number;
								request: number;
								recipient: number;
								transfersessionid: unknown[];
								transfertrials: unknown[];
								created_at?: string | undefined;
								updated_at?: string | undefined;
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
								domain: string;
								amount: number;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								reference: string;
								source: string;
								reason: string;
								status: string;
								failures: unknown;
								transfer_code: string;
								titan_code: string | null;
								transferred_at: unknown;
								id: number;
								integration: number;
								request: number;
								recipient: number;
								transfersessionid: unknown[];
								transfertrials: unknown[];
								created_at?: string | undefined;
								updated_at?: string | undefined;
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
		const { response, raw } = await this.fetcher("/transfer", "POST", input);
		if (!response.ok) {
			const { data, error } = await transferError.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await transferInitiateSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Finalizes a transfer with an OTP.
	 * @param input - The transfer finalization details.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async finalize(input: z.infer<typeof transferFinalizeInput>): Promise<
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
								amount: number;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								reference: string;
								source: string;
								reason: string;
								status: string;
								failures: unknown;
								transfer_code: string;
								titan_code: string | null;
								transferred_at: unknown;
								id: number;
								integration: number;
								request: number;
								recipient: number;
								source_details: unknown;
								created_at?: string | undefined;
								updated_at?: string | undefined;
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
								domain: string;
								amount: number;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								reference: string;
								source: string;
								reason: string;
								status: string;
								failures: unknown;
								transfer_code: string;
								titan_code: string | null;
								transferred_at: unknown;
								id: number;
								integration: number;
								request: number;
								recipient: number;
								source_details: unknown;
								created_at?: string | undefined;
								updated_at?: string | undefined;
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

	/**
	 * Initiates a bulk transfer.
	 * @param input - The bulk transfer details.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async initiateBulk(input: z.infer<typeof transferBulkInitiateInput>): Promise<
		| {
				data:
					| {
							status: boolean;
							message: string;
							meta: {
								nextStep: string;
							};
							type: string;
							code: string;
							data?: Record<string, never> | undefined;
					  }
					| undefined;
				error:
					| z.ZodError<{
							status: boolean;
							message: string;
							meta: {
								nextStep: string;
							};
							type: string;
							code: string;
							data?: Record<string, never> | undefined;
					  }>
					| undefined;
		  }
		| {
				data:
					| {
							status: boolean;
							message: string;
							data: {
								reference: string;
								recipient: string;
								amount: number;
								transfer_code: string;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								status: string;
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
								reference: string;
								recipient: string;
								amount: number;
								transfer_code: string;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								status: string;
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

	/**
	 * Lists transfers.
	 * @param input - Query parameters for listing transfers.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async list(input: z.infer<typeof transferListInput>): Promise<
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
								amount: number;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								reference: string;
								status: string;
								id: number;
								domain: string;
								reason: string;
								failures: unknown;
								transfer_code: string;
								titan_code: string | null;
								transferred_at: unknown;
								integration: number;
								recipient: {
									domain: string;
									type: string;
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									name: string;
									details: {
										account_number: string;
										account_name: string;
										bank_code: string;
										bank_name: string;
									};
									description: string | null;
									metadata: any;
									recipient_code: string;
									active: boolean;
									id: number;
									integration: number;
									created_at?: string | undefined;
									updated_at?: string | undefined;
								};
								source: "balance";
								source_details: unknown;
								created_at?: string | undefined;
								updated_at?: string | undefined;
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
								amount: number;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								reference: string;
								status: string;
								id: number;
								domain: string;
								reason: string;
								failures: unknown;
								transfer_code: string;
								titan_code: string | null;
								transferred_at: unknown;
								integration: number;
								recipient: {
									domain: string;
									type: string;
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									name: string;
									details: {
										account_number: string;
										account_name: string;
										bank_code: string;
										bank_name: string;
									};
									description: string | null;
									metadata: any;
									recipient_code: string;
									active: boolean;
									id: number;
									integration: number;
									created_at?: string | undefined;
									updated_at?: string | undefined;
								};
								source: "balance";
								source_details: unknown;
								created_at?: string | undefined;
								updated_at?: string | undefined;
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
		const { response, raw } = await this.fetcher("/transfer", "GET", input);
		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await transferListSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Retrieves a single transfer by ID or code.
	 * @param id_or_code - The ID or code of the transfer.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async getTransferById(id_or_code: string): Promise<
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
								amount: number;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								reference: string;
								reason: string;
								status: string;
								failures: unknown;
								transfer_code: string;
								titan_code: string | null;
								transferred_at: unknown;
								id: number;
								integration: number;
								request: number;
								createdAt: string;
								updatedAt: string;
								recipient: {
									domain: string;
									type: string;
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									name: string;
									recipient_code: string;
									active: boolean;
									id: number;
									integration: number;
									details: {
										account_name: string | null;
										account_number: string;
										bank_code: string;
										bank_name: string;
										authorization_code?: string | null | undefined;
									};
									created_at?: string | undefined;
									updated_at?: string | undefined;
									createdAt?: string | undefined;
									description?: string | null | undefined;
									email?: string | null | undefined;
									metadata?: any;
									updatedAt?: string | undefined;
									is_deleted?: boolean | undefined;
									isDeleted?: boolean | undefined;
								};
								session: {
									provider: unknown;
									id: unknown;
								};
								fees_charged: number;
								fees_breakdown: unknown;
								gateway_response: unknown;
								source: "balance";
								source_details: unknown;
								created_at?: string | undefined;
								updated_at?: string | undefined;
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
								domain: string;
								amount: number;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								reference: string;
								reason: string;
								status: string;
								failures: unknown;
								transfer_code: string;
								titan_code: string | null;
								transferred_at: unknown;
								id: number;
								integration: number;
								request: number;
								createdAt: string;
								updatedAt: string;
								recipient: {
									domain: string;
									type: string;
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									name: string;
									recipient_code: string;
									active: boolean;
									id: number;
									integration: number;
									details: {
										account_name: string | null;
										account_number: string;
										bank_code: string;
										bank_name: string;
										authorization_code?: string | null | undefined;
									};
									created_at?: string | undefined;
									updated_at?: string | undefined;
									createdAt?: string | undefined;
									description?: string | null | undefined;
									email?: string | null | undefined;
									metadata?: any;
									updatedAt?: string | undefined;
									is_deleted?: boolean | undefined;
									isDeleted?: boolean | undefined;
								};
								session: {
									provider: unknown;
									id: unknown;
								};
								fees_charged: number;
								fees_breakdown: unknown;
								gateway_response: unknown;
								source: "balance";
								source_details: unknown;
								created_at?: string | undefined;
								updated_at?: string | undefined;
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

	/**
	 * Verifies the status of a transfer.
	 * @param reference - The reference of the transfer.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async verify(reference: string): Promise<
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
								amount: number;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								reference: string;
								reason: string;
								status: string;
								failures: unknown;
								transfer_code: string;
								titan_code: string | null;
								transferred_at: unknown;
								id: number;
								integration: number;
								request: number;
								createdAt: string;
								updatedAt: string;
								recipient: {
									domain: string;
									type: string;
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									name: string;
									recipient_code: string;
									active: boolean;
									id: number;
									integration: number;
									details: {
										account_name: string | null;
										account_number: string;
										bank_code: string;
										bank_name: string;
										authorization_code?: string | null | undefined;
									};
									created_at?: string | undefined;
									updated_at?: string | undefined;
									createdAt?: string | undefined;
									description?: string | null | undefined;
									email?: string | null | undefined;
									metadata?: any;
									updatedAt?: string | undefined;
									is_deleted?: boolean | undefined;
									isDeleted?: boolean | undefined;
								};
								session: {
									provider: unknown;
									id: unknown;
								};
								fees_charged: number;
								fees_breakdown: unknown;
								gateway_response: unknown;
								source: "balance";
								source_details: unknown;
								created_at?: string | undefined;
								updated_at?: string | undefined;
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
								domain: string;
								amount: number;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								reference: string;
								reason: string;
								status: string;
								failures: unknown;
								transfer_code: string;
								titan_code: string | null;
								transferred_at: unknown;
								id: number;
								integration: number;
								request: number;
								createdAt: string;
								updatedAt: string;
								recipient: {
									domain: string;
									type: string;
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									name: string;
									recipient_code: string;
									active: boolean;
									id: number;
									integration: number;
									details: {
										account_name: string | null;
										account_number: string;
										bank_code: string;
										bank_name: string;
										authorization_code?: string | null | undefined;
									};
									created_at?: string | undefined;
									updated_at?: string | undefined;
									createdAt?: string | undefined;
									description?: string | null | undefined;
									email?: string | null | undefined;
									metadata?: any;
									updatedAt?: string | undefined;
									is_deleted?: boolean | undefined;
									isDeleted?: boolean | undefined;
								};
								session: {
									provider: unknown;
									id: unknown;
								};
								fees_charged: number;
								fees_breakdown: unknown;
								gateway_response: unknown;
								source: "balance";
								source_details: unknown;
								created_at?: string | undefined;
								updated_at?: string | undefined;
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
