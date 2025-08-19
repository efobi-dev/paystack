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

export class Transaction extends Fetcher {
	/**
	 * Initialize a transaction from your backend
	 * @param {z.infer<typeof txnInitializeInput>} transaction - The transaction details
	 * @returns {Promise<object>} The response from the API
	 */
	async initialize(transaction: z.infer<typeof txnInitializeInput>) {
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
	async verify(reference: string) {
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
	async list(input: z.infer<typeof txnListInput>) {
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
	async getTransactionById(id: number) {
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
	async chargeAuthorization(input: z.infer<typeof txnChargeInput>) {
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
	async viewTxnTimeline(id_or_reference: string) {
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
	async getTxnTotals(input: z.infer<typeof genericInput>) {
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
	async exportTxns(input: z.infer<typeof txnExportInput>) {
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
	async partialDebit(input: z.infer<typeof txnPartialDebitInput>) {
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
