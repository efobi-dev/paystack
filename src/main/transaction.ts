import type { z } from "zod";
import { type genericInput, genericResponse } from "../zod";
import {
	type txnChargeInput,
	txnChargeSuccess,
	type txnExportInput,
	txnExportSuccess,
	type txnInitializeInput,
	txnInitializeSuccess,
	type txnListInput,
	txnListSuccess,
	type txnPartialDebitInput,
	txnPartialDebitSuccess,
	txnSingleSuccess,
	txnTimelineSuccess,
	txnTotalsSuccess,
	txnVerifySuccess,
} from "../zod/transaction";
import { Fetcher } from "./fetcher";

/**
 * The Transaction class provides methods for interacting with Paystack's Transaction API.
 */
export class Transaction extends Fetcher {
	/**
	 * Initialize a transaction from your backend
	 * @param {z.infer<typeof txnInitializeInput>} transaction - The transaction details
	 * @returns {Promise<object>} The response from the API
	 */
	/**
	 * Initializes a transaction from your backend.
	 * @param transaction - The transaction details.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async initialize(transaction: z.infer<typeof txnInitializeInput>): Promise<
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
								authorization_url: string;
								access_code: string;
								reference: string;
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
								authorization_url: string;
								access_code: string;
								reference: string;
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
			"/transaction/initialize",
			"POST",
			transaction,
		);

		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await txnInitializeSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Confirm the status of a transaction
	 * @param {string} reference - The transaction reference
	 * @returns {Promise<object>} The response from the API
	 *
	 */
	/**
	 * Confirms the status of a transaction.
	 * @param reference - The transaction reference.
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
								id: number;
								domain: string;
								status: string;
								reference: string;
								receipt_number: string | null;
								amount: number;
								message: string | null;
								gateway_response: string;
								channel: string;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								ip_address: string | null;
								log: {
									start_time: number;
									time_spent: number;
									attempts: number;
									errors: number;
									success: boolean;
									mobile: boolean;
									input: unknown[];
									history: {
										type: string;
										message: string;
										time: number;
									}[];
								} | null;
								fees: number | null;
								fees_split: unknown;
								authorization: {
									authorization_code?: string | undefined;
									bin?: string | undefined;
									last4?: string | undefined;
									exp_month?: string | undefined;
									exp_year?: string | undefined;
									channel?: string | undefined;
									card_type?: string | undefined;
									bank?: string | null | undefined;
									country_code?: string | undefined;
									brand?: string | undefined;
									reusable?: boolean | undefined;
									signature?: string | undefined;
									account_name?: string | null | undefined;
								} | null;
								order_id: string | null;
								paidAt: string | null;
								createdAt: string;
								requested_amount: number;
								pos_transaction_data: unknown;
								connect: unknown;
								metadata: any;
								customer: {
									id: number;
									first_name: string | null;
									last_name: string | null;
									email: string;
									phone: string | null;
									customer_code: string;
									risk_action: string;
									metadata: any;
									international_format_phone: string | null;
								};
								plan: {
									id: number;
									name: string;
									plan_code: string;
									description: string | null;
									amount: number;
									interval: string;
									send_invoices: boolean;
									send_sms: boolean;
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								} | null;
								split: {
									id: number;
									name: string;
									type: "percentage" | "flat";
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									integration: number;
									domain: string;
									split_code: string;
									active: boolean;
									bearer_type:
										| "subaccount"
										| "account"
										| "all-proportional"
										| "all";
									createdAt: string;
									updatedAt: string;
									is_dynamic: boolean;
									subaccounts: {
										subaccount: {
											id: number;
											subaccount_code: string;
											business_name: string;
											description: string;
											primary_contact_name: string | null;
											primary_contact_email: string | null;
											primary_contact_phone: string | null;
											metadata: any;
											settlement_bank: string;
											currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
											account_number: string;
										};
										share: number;
									}[];
								} | null;
								source: unknown;
								fees_breakdown: unknown;
								transaction_date: string;
								plan_object: Record<string, unknown>;
								subaccount: {
									id: number;
									subaccount_code: string;
									business_name: string;
									description: string;
									primary_contact_name: string | null;
									primary_contact_email: string | null;
									primary_contact_phone: string | null;
									metadata: any;
									settlement_bank: string;
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									account_number: string;
								} | null;
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
								domain: string;
								status: string;
								reference: string;
								receipt_number: string | null;
								amount: number;
								message: string | null;
								gateway_response: string;
								channel: string;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								ip_address: string | null;
								log: {
									start_time: number;
									time_spent: number;
									attempts: number;
									errors: number;
									success: boolean;
									mobile: boolean;
									input: unknown[];
									history: {
										type: string;
										message: string;
										time: number;
									}[];
								} | null;
								fees: number | null;
								fees_split: unknown;
								authorization: {
									authorization_code?: string | undefined;
									bin?: string | undefined;
									last4?: string | undefined;
									exp_month?: string | undefined;
									exp_year?: string | undefined;
									channel?: string | undefined;
									card_type?: string | undefined;
									bank?: string | null | undefined;
									country_code?: string | undefined;
									brand?: string | undefined;
									reusable?: boolean | undefined;
									signature?: string | undefined;
									account_name?: string | null | undefined;
								} | null;
								order_id: string | null;
								paidAt: string | null;
								createdAt: string;
								requested_amount: number;
								pos_transaction_data: unknown;
								connect: unknown;
								metadata: any;
								customer: {
									id: number;
									first_name: string | null;
									last_name: string | null;
									email: string;
									phone: string | null;
									customer_code: string;
									risk_action: string;
									metadata: any;
									international_format_phone: string | null;
								};
								plan: {
									id: number;
									name: string;
									plan_code: string;
									description: string | null;
									amount: number;
									interval: string;
									send_invoices: boolean;
									send_sms: boolean;
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								} | null;
								split: {
									id: number;
									name: string;
									type: "percentage" | "flat";
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									integration: number;
									domain: string;
									split_code: string;
									active: boolean;
									bearer_type:
										| "subaccount"
										| "account"
										| "all-proportional"
										| "all";
									createdAt: string;
									updatedAt: string;
									is_dynamic: boolean;
									subaccounts: {
										subaccount: {
											id: number;
											subaccount_code: string;
											business_name: string;
											description: string;
											primary_contact_name: string | null;
											primary_contact_email: string | null;
											primary_contact_phone: string | null;
											metadata: any;
											settlement_bank: string;
											currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
											account_number: string;
										};
										share: number;
									}[];
								} | null;
								source: unknown;
								fees_breakdown: unknown;
								transaction_date: string;
								plan_object: Record<string, unknown>;
								subaccount: {
									id: number;
									subaccount_code: string;
									business_name: string;
									description: string;
									primary_contact_name: string | null;
									primary_contact_email: string | null;
									primary_contact_phone: string | null;
									metadata: any;
									settlement_bank: string;
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									account_number: string;
								} | null;
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
			`/transaction/verify/${reference}`,
		);

		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await txnVerifySuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * List transactions carried out on your integration
	 * @param {z.infer<typeof txnListInput>} input - The query parameters
	 * @returns {Promise<object>} The response from the API
	 */
	/**
	 * Lists transactions carried out on your integration.
	 * @param input - Query parameters for listing transactions.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async list(input: z.infer<typeof txnListInput>): Promise<
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
								domain: string;
								status: string;
								reference: string;
								receipt_number: string | null;
								amount: number;
								message: string | null;
								gateway_response: string;
								channel: string;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								ip_address: string | null;
								log: {
									start_time: number;
									time_spent: number;
									attempts: number;
									errors: number;
									success: boolean;
									mobile: boolean;
									input: unknown[];
									history: {
										type: string;
										message: string;
										time: number;
									}[];
								} | null;
								fees: number | null;
								fees_split: unknown;
								authorization: {
									authorization_code?: string | undefined;
									bin?: string | undefined;
									last4?: string | undefined;
									exp_month?: string | undefined;
									exp_year?: string | undefined;
									channel?: string | undefined;
									card_type?: string | undefined;
									bank?: string | null | undefined;
									country_code?: string | undefined;
									brand?: string | undefined;
									reusable?: boolean | undefined;
									signature?: string | undefined;
									account_name?: string | null | undefined;
								} | null;
								order_id: string | null;
								paidAt: string | null;
								createdAt: string;
								requested_amount: number;
								pos_transaction_data: unknown;
								connect: unknown;
								metadata: any;
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
								plan: {
									id: number;
									name: string;
									plan_code: string;
									description: string | null;
									amount: number;
									interval: string;
									send_invoices: boolean;
									send_sms: boolean;
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								} | null;
								split: {
									id: number;
									name: string;
									type: "percentage" | "flat";
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									integration: number;
									domain: string;
									split_code: string;
									active: boolean;
									bearer_type:
										| "subaccount"
										| "account"
										| "all-proportional"
										| "all";
									createdAt: string;
									updatedAt: string;
									is_dynamic: boolean;
									subaccounts: {
										subaccount: {
											id: number;
											subaccount_code: string;
											business_name: string;
											description: string;
											primary_contact_name: string | null;
											primary_contact_email: string | null;
											primary_contact_phone: string | null;
											metadata: any;
											settlement_bank: string;
											currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
											account_number: string;
										};
										share: number;
									}[];
								} | null;
								subaccount: {
									id: number;
									subaccount_code: string;
									business_name: string;
									description: string;
									primary_contact_name: string | null;
									primary_contact_email: string | null;
									primary_contact_phone: string | null;
									metadata: any;
									settlement_bank: string;
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									account_number: string;
								} | null;
								source: {
									source: string;
									type: string;
									identifier: string | null;
									entry_point: string;
								} | null;
							}[];
							meta: {
								next: string | null;
								previous: string | null;
								perPage: number;
							};
					  }
					| undefined;
				error:
					| z.ZodError<{
							status: boolean;
							message: string;
							data: {
								id: number;
								domain: string;
								status: string;
								reference: string;
								receipt_number: string | null;
								amount: number;
								message: string | null;
								gateway_response: string;
								channel: string;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								ip_address: string | null;
								log: {
									start_time: number;
									time_spent: number;
									attempts: number;
									errors: number;
									success: boolean;
									mobile: boolean;
									input: unknown[];
									history: {
										type: string;
										message: string;
										time: number;
									}[];
								} | null;
								fees: number | null;
								fees_split: unknown;
								authorization: {
									authorization_code?: string | undefined;
									bin?: string | undefined;
									last4?: string | undefined;
									exp_month?: string | undefined;
									exp_year?: string | undefined;
									channel?: string | undefined;
									card_type?: string | undefined;
									bank?: string | null | undefined;
									country_code?: string | undefined;
									brand?: string | undefined;
									reusable?: boolean | undefined;
									signature?: string | undefined;
									account_name?: string | null | undefined;
								} | null;
								order_id: string | null;
								paidAt: string | null;
								createdAt: string;
								requested_amount: number;
								pos_transaction_data: unknown;
								connect: unknown;
								metadata: any;
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
								plan: {
									id: number;
									name: string;
									plan_code: string;
									description: string | null;
									amount: number;
									interval: string;
									send_invoices: boolean;
									send_sms: boolean;
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								} | null;
								split: {
									id: number;
									name: string;
									type: "percentage" | "flat";
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									integration: number;
									domain: string;
									split_code: string;
									active: boolean;
									bearer_type:
										| "subaccount"
										| "account"
										| "all-proportional"
										| "all";
									createdAt: string;
									updatedAt: string;
									is_dynamic: boolean;
									subaccounts: {
										subaccount: {
											id: number;
											subaccount_code: string;
											business_name: string;
											description: string;
											primary_contact_name: string | null;
											primary_contact_email: string | null;
											primary_contact_phone: string | null;
											metadata: any;
											settlement_bank: string;
											currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
											account_number: string;
										};
										share: number;
									}[];
								} | null;
								subaccount: {
									id: number;
									subaccount_code: string;
									business_name: string;
									description: string;
									primary_contact_name: string | null;
									primary_contact_email: string | null;
									primary_contact_phone: string | null;
									metadata: any;
									settlement_bank: string;
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									account_number: string;
								} | null;
								source: {
									source: string;
									type: string;
									identifier: string | null;
									entry_point: string;
								} | null;
							}[];
							meta: {
								next: string | null;
								previous: string | null;
								perPage: number;
							};
					  }>
					| undefined;
		  }
	> {
		const { response, raw } = await this.fetcher("/transaction", "GET", input);

		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await txnListSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Get details of a transaction carried out on your integration
	 * @param {number} id - The ID of the transaction
	 * @returns {Promise<object>} The response from the API
	 */
	/**
	 * Retrieves details of a transaction carried out on your integration.
	 * @param id - The ID of the transaction.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async getTransactionById(id: number): Promise<
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
								domain: string;
								status: string;
								reference: string;
								receipt_number: string | null;
								amount: number;
								message: string | null;
								gateway_response: string;
								channel: string;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								ip_address: string | null;
								log: {
									start_time: number;
									time_spent: number;
									attempts: number;
									errors: number;
									success: boolean;
									mobile: boolean;
									input: unknown[];
									history: {
										type: string;
										message: string;
										time: number;
									}[];
								} | null;
								fees: number | null;
								fees_split: unknown;
								authorization: {
									authorization_code?: string | undefined;
									bin?: string | undefined;
									last4?: string | undefined;
									exp_month?: string | undefined;
									exp_year?: string | undefined;
									channel?: string | undefined;
									card_type?: string | undefined;
									bank?: string | null | undefined;
									country_code?: string | undefined;
									brand?: string | undefined;
									reusable?: boolean | undefined;
									signature?: string | undefined;
									account_name?: string | null | undefined;
								} | null;
								order_id: string | null;
								paidAt: string | null;
								createdAt: string;
								requested_amount: number;
								pos_transaction_data: unknown;
								connect: unknown;
								metadata: any;
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
								plan: {
									id: number;
									name: string;
									plan_code: string;
									description: string | null;
									amount: number;
									interval: string;
									send_invoices: boolean;
									send_sms: boolean;
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								} | null;
								split: {
									id: number;
									name: string;
									type: "percentage" | "flat";
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									integration: number;
									domain: string;
									split_code: string;
									active: boolean;
									bearer_type:
										| "subaccount"
										| "account"
										| "all-proportional"
										| "all";
									createdAt: string;
									updatedAt: string;
									is_dynamic: boolean;
									subaccounts: {
										subaccount: {
											id: number;
											subaccount_code: string;
											business_name: string;
											description: string;
											primary_contact_name: string | null;
											primary_contact_email: string | null;
											primary_contact_phone: string | null;
											metadata: any;
											settlement_bank: string;
											currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
											account_number: string;
										};
										share: number;
									}[];
								} | null;
								subaccount: {
									id: number;
									subaccount_code: string;
									business_name: string;
									description: string;
									primary_contact_name: string | null;
									primary_contact_email: string | null;
									primary_contact_phone: string | null;
									metadata: any;
									settlement_bank: string;
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									account_number: string;
								} | null;
								source: {
									source: string;
									type: string;
									identifier: string | null;
									entry_point: string;
								} | null;
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
								domain: string;
								status: string;
								reference: string;
								receipt_number: string | null;
								amount: number;
								message: string | null;
								gateway_response: string;
								channel: string;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								ip_address: string | null;
								log: {
									start_time: number;
									time_spent: number;
									attempts: number;
									errors: number;
									success: boolean;
									mobile: boolean;
									input: unknown[];
									history: {
										type: string;
										message: string;
										time: number;
									}[];
								} | null;
								fees: number | null;
								fees_split: unknown;
								authorization: {
									authorization_code?: string | undefined;
									bin?: string | undefined;
									last4?: string | undefined;
									exp_month?: string | undefined;
									exp_year?: string | undefined;
									channel?: string | undefined;
									card_type?: string | undefined;
									bank?: string | null | undefined;
									country_code?: string | undefined;
									brand?: string | undefined;
									reusable?: boolean | undefined;
									signature?: string | undefined;
									account_name?: string | null | undefined;
								} | null;
								order_id: string | null;
								paidAt: string | null;
								createdAt: string;
								requested_amount: number;
								pos_transaction_data: unknown;
								connect: unknown;
								metadata: any;
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
								plan: {
									id: number;
									name: string;
									plan_code: string;
									description: string | null;
									amount: number;
									interval: string;
									send_invoices: boolean;
									send_sms: boolean;
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								} | null;
								split: {
									id: number;
									name: string;
									type: "percentage" | "flat";
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									integration: number;
									domain: string;
									split_code: string;
									active: boolean;
									bearer_type:
										| "subaccount"
										| "account"
										| "all-proportional"
										| "all";
									createdAt: string;
									updatedAt: string;
									is_dynamic: boolean;
									subaccounts: {
										subaccount: {
											id: number;
											subaccount_code: string;
											business_name: string;
											description: string;
											primary_contact_name: string | null;
											primary_contact_email: string | null;
											primary_contact_phone: string | null;
											metadata: any;
											settlement_bank: string;
											currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
											account_number: string;
										};
										share: number;
									}[];
								} | null;
								subaccount: {
									id: number;
									subaccount_code: string;
									business_name: string;
									description: string;
									primary_contact_name: string | null;
									primary_contact_email: string | null;
									primary_contact_phone: string | null;
									metadata: any;
									settlement_bank: string;
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									account_number: string;
								} | null;
								source: {
									source: string;
									type: string;
									identifier: string | null;
									entry_point: string;
								} | null;
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
		const { response, raw } = await this.fetcher(`/transaction/${id}`);

		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await txnSingleSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * All authorizations marked as reusable can be charged with this endpoint
	 * @param {z.infer<typeof txnChargeInput>} input - The charge details
	 * @returns {Promise<object>} The response from the API
	 */
	/**
	 * Charges an authorization.
	 * @param input - The charge details.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async chargeAuthorization(input: z.infer<typeof txnChargeInput>): Promise<
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
								transaction_date: string;
								status: string;
								reference: string;
								domain: string;
								metadata: any;
								gateway_response: string;
								message: string | null;
								channel: string;
								ip_address: string | null;
								log: {
									start_time: number;
									time_spent: number;
									attempts: number;
									errors: number;
									success: boolean;
									mobile: boolean;
									input: unknown[];
									history: {
										type: string;
										message: string;
										time: number;
									}[];
								} | null;
								fees: number;
								authorization: {
									authorization_code?: string | undefined;
									bin?: string | undefined;
									last4?: string | undefined;
									exp_month?: string | undefined;
									exp_year?: string | undefined;
									channel?: string | undefined;
									card_type?: string | undefined;
									bank?: string | null | undefined;
									country_code?: string | undefined;
									brand?: string | undefined;
									reusable?: boolean | undefined;
									signature?: string | undefined;
									account_name?: string | null | undefined;
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
								plan: number | null;
								id: number;
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
								amount: number;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								transaction_date: string;
								status: string;
								reference: string;
								domain: string;
								metadata: any;
								gateway_response: string;
								message: string | null;
								channel: string;
								ip_address: string | null;
								log: {
									start_time: number;
									time_spent: number;
									attempts: number;
									errors: number;
									success: boolean;
									mobile: boolean;
									input: unknown[];
									history: {
										type: string;
										message: string;
										time: number;
									}[];
								} | null;
								fees: number;
								authorization: {
									authorization_code?: string | undefined;
									bin?: string | undefined;
									last4?: string | undefined;
									exp_month?: string | undefined;
									exp_year?: string | undefined;
									channel?: string | undefined;
									card_type?: string | undefined;
									bank?: string | null | undefined;
									country_code?: string | undefined;
									brand?: string | undefined;
									reusable?: boolean | undefined;
									signature?: string | undefined;
									account_name?: string | null | undefined;
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
								plan: number | null;
								id: number;
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
			"/transaction/charge_authorization",
			"POST",
			input,
		);

		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await txnChargeSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * View the timeline of a transaction
	 * @param {string} id_or_reference - The ID or reference of the transaction
	 * @returns {Promise<object>} The response from the API
	 */
	/**
	 * Views the timeline of a transaction.
	 * @param id_or_reference - The ID or reference of the transaction.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async viewTxnTimeline(id_or_reference: string): Promise<
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
								start_time: string;
								time_spent: number;
								attempts: number;
								errors: number;
								success: boolean;
								mobile: boolean;
								input: unknown[];
								history: {
									type: string;
									message: string;
									time: number;
								}[];
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
								start_time: string;
								time_spent: number;
								attempts: number;
								errors: number;
								success: boolean;
								mobile: boolean;
								input: unknown[];
								history: {
									type: string;
									message: string;
									time: number;
								}[];
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
			`/transaction/timeline/${id_or_reference}`,
		);

		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}

		const { data, error } = await txnTimelineSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Total volume of transactions received on your integration
	 * @param {z.infer<typeof genericInput>} input - The query parameters
	 * @returns {Promise<object>} The response from the API
	 */
	/**
	 * Retrieves the total volume of transactions received on your integration.
	 * @param input - Query parameters for transaction totals.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async getTxnTotals(input: z.infer<typeof genericInput>): Promise<
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
								total_transactions: number;
								total_volume: number;
								total_volume_by_currency: {
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									amount: number;
								}[];
								pending_transfers: number;
								pending_transfers_by_currency: {
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									amount: number;
								}[];
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
								total_transactions: number;
								total_volume: number;
								total_volume_by_currency: {
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									amount: number;
								}[];
								pending_transfers: number;
								pending_transfers_by_currency: {
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									amount: number;
								}[];
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
			"/transaction/totals",
			"GET",
			input,
		);

		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}

		const { data, error } = await txnTotalsSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Export a list of transactions carried out on your integration
	 * @param {z.infer<typeof txnExportInput>} input - The query parameters
	 * @returns {Promise<object>} The response from the API
	 */
	/**
	 * Exports a list of transactions carried out on your integration.
	 * @param input - Query parameters for exporting transactions.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async exportTxns(input: z.infer<typeof txnExportInput>): Promise<
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
								path: string;
								expiresAt: string;
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
								path: string;
								expiresAt: string;
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
			"/transaction/export",
			"GET",
			input,
		);

		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}

		const { data, error } = await txnExportSuccess.safeParseAsync(raw);
		return { data, error };
	}

	/**
	 * Retrieve part of a payment from a customer
	 * @param {z.infer<typeof txnPartialDebitInput>} input - The partial debit details
	 * @returns {Promise<object>} The response from the API
	 */
	/**
	 * Retrieves part of a payment from a customer.
	 * @param input - The partial debit details.
	 * @returns A Promise that resolves to an object containing the data and any error.
	 */
	async partialDebit(input: z.infer<typeof txnPartialDebitInput>): Promise<
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
								transaction_date: string;
								status: string;
								reference: string;
								domain: string;
								metadata: any;
								gateway_response: string;
								message: string | null;
								channel: string;
								ip_address: string | null;
								log: {
									start_time: number;
									time_spent: number;
									attempts: number;
									errors: number;
									success: boolean;
									mobile: boolean;
									input: unknown[];
									history: {
										type: string;
										message: string;
										time: number;
									}[];
								} | null;
								fees: number;
								authorization: {
									authorization_code?: string | undefined;
									bin?: string | undefined;
									last4?: string | undefined;
									exp_month?: string | undefined;
									exp_year?: string | undefined;
									channel?: string | undefined;
									card_type?: string | undefined;
									bank?: string | null | undefined;
									country_code?: string | undefined;
									brand?: string | undefined;
									reusable?: boolean | undefined;
									signature?: string | undefined;
									account_name?: string | null | undefined;
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
								plan: number | null;
								id: number;
								requested_amount: number;
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
								amount: number;
								currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
								transaction_date: string;
								status: string;
								reference: string;
								domain: string;
								metadata: any;
								gateway_response: string;
								message: string | null;
								channel: string;
								ip_address: string | null;
								log: {
									start_time: number;
									time_spent: number;
									attempts: number;
									errors: number;
									success: boolean;
									mobile: boolean;
									input: unknown[];
									history: {
										type: string;
										message: string;
										time: number;
									}[];
								} | null;
								fees: number;
								authorization: {
									authorization_code?: string | undefined;
									bin?: string | undefined;
									last4?: string | undefined;
									exp_month?: string | undefined;
									exp_year?: string | undefined;
									channel?: string | undefined;
									card_type?: string | undefined;
									bank?: string | null | undefined;
									country_code?: string | undefined;
									brand?: string | undefined;
									reusable?: boolean | undefined;
									signature?: string | undefined;
									account_name?: string | null | undefined;
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
								plan: number | null;
								id: number;
								requested_amount: number;
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
			"/transaction/partial_debit",
			"POST",
			input,
		);

		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await txnPartialDebitSuccess.safeParseAsync(raw);
		return { data, error };
	}
}
