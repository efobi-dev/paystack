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

export class Transaction {
	private secretKey: string;
	private baseUrl: string;

	constructor(secretKey: string, baseUrl: string) {
		this.secretKey = secretKey;
		this.baseUrl = baseUrl;
	}

	private async fetcher(
		path: string,
		method: "GET" | "POST" = "GET",
		body?: object,
		searchParams?: URLSearchParams,
	) {
		const url = searchParams
			? `${this.baseUrl}${path}?${searchParams}`
			: `${this.baseUrl}${path}`;

		const response = await fetch(url, {
			method,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.secretKey}`,
			},
			...(body && { body: JSON.stringify(body) }),
		});

		const raw = await response.json();
		return { response, raw };
	}

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

	async list(input: z.infer<typeof txnListInput>) {
		const stringInput = Object.fromEntries(
			Object.entries(input).map(([key, value]) => [
				key,
				value instanceof Date ? value.toISOString() : String(value),
			]),
		);
		const searchParams = new URLSearchParams(stringInput);
		const { response, raw } = await this.fetcher(
			"/transaction",
			"GET",
			undefined,
			searchParams,
		);

		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await txnListSuccess.safeParseAsync(raw);
		return { data, error };
	}

	async getTransactionById(id: number) {
		const { response, raw } = await this.fetcher(`/transaction/${id}`);

		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}
		const { data, error } = await txnSingleSuccess.safeParseAsync(raw);
		return { data, error };
	}

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

	async getTxnTotals(input: z.infer<typeof genericInput>) {
		const stringInput = Object.fromEntries(
			Object.entries(input).map(([key, value]) => [key, String(value)]),
		);
		const searchParams = new URLSearchParams(stringInput);
		const { response, raw } = await this.fetcher(
			"/transaction/totals",
			"GET",
			undefined,
			searchParams,
		);

		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}

		const { data, error } = await txnTotalsSuccess.safeParseAsync(raw);
		return { data, error };
	}

	async exportTxns(input: z.infer<typeof txnExportInput>) {
		const stringInput = Object.fromEntries(
			Object.entries(input).map(([key, value]) => [key, String(value)]),
		);
		const searchParams = new URLSearchParams(stringInput);
		const { response, raw } = await this.fetcher(
			"/transaction/export",
			"GET",
			undefined,
			searchParams,
		);

		if (!response.ok) {
			const { data, error } = await genericResponse.safeParseAsync(raw);
			return { data, error };
		}

		const { data, error } = await txnExportSuccess.safeParseAsync(raw);
		return { data, error };
	}

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
