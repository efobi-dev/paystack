import type { z } from "zod";
import type { genericResponse } from "../../zod";
import type {
	txnChargeSuccess,
	txnExportSuccess,
	txnListSuccess,
	txnPartialDebitSuccess,
	txnSingleSuccess,
	txnTimelineSuccess,
	txnTotalsSuccess,
	txnVerifySuccess,
} from "../../zod/transaction";

export const mockInvalidReferenceError: z.infer<typeof genericResponse> = {
	status: false,
	message: "Invalid transaction reference",
};

export const mockVerifySuccessResponse: z.infer<typeof txnVerifySuccess> = {
	status: true,
	message: "Verification successful",
	data: {
		id: 316712345,
		domain: "test",
		status: "success",
		reference: "test-reference-123",
		receipt_number: null,
		amount: 50000,
		message: null,
		gateway_response: "Successful",
		channel: "card",
		currency: "NGN",
		ip_address: "127.0.0.1",
		log: {
			start_time: 1620000000,
			time_spent: 10,
			attempts: 1,
			errors: 0,
			success: true,
			mobile: false,
			input: [],
			history: [
				{
					type: "action",
					message: "Attempted to pay",
					time: 10,
				},
			],
		},
		fees: 750,
		fees_split: null,
		authorization: {
			authorization_code: "AUTH_123456789",
			bin: "408408",
			last4: "4081",
			exp_month: "12",
			exp_year: "2030",
			channel: "card",
			card_type: "visa",
			bank: "Test Bank",
			country_code: "NG",
			brand: "visa",
			reusable: true,
			signature: "SIG_123456789",
			account_name: null,
		},
		customer: {
			id: 12345,
			first_name: "John",
			last_name: "Doe",
			email: "john.doe@example.com",
			phone: null,
			metadata: null,
			customer_code: "CUS_123456789",
			risk_action: "default",
			international_format_phone: null,
		},
		paidAt: "2024-01-01T12:00:00.000Z",
		createdAt: "2024-01-01T11:59:50.000Z",
		requested_amount: 50000,
		pos_transaction_data: null,
		connect: null,
		order_id: null,
		metadata: "{}",
		plan: null,
		split: null,
		source: null,
		fees_breakdown: null,
		transaction_date: "2024-01-01T12:00:00.000Z",
		plan_object: {},
		subaccount: null,
	},
};

const singleTransaction = {
	id: 316712345,
	domain: "test",
	status: "success",
	reference: "test-reference-123",
	receipt_number: null,
	amount: 50000,
	message: null,
	gateway_response: "Successful",
	channel: "card",
	currency: "NGN" as const,
	ip_address: "127.0.0.1",
	log: {
		start_time: 1620000000,
		time_spent: 10,
		attempts: 1,
		errors: 0,
		success: true,
		mobile: false,
		input: [],
		history: [],
	},
	fees: 750,
	fees_split: null,
	authorization: {
		authorization_code: "AUTH_123456789",
		bin: "408408",
		last4: "4081",
		exp_month: "12",
		exp_year: "2030",
		channel: "card",
		card_type: "visa",
		bank: "Test Bank",
		country_code: "NG",
		brand: "visa",
		reusable: true,
		signature: "SIG_123456789",
		account_name: null,
	},
	customer: {
		id: 12345,
		first_name: "John",
		last_name: "Doe",
		email: "john.doe@example.com",
		phone: null,
		metadata: null,
		customer_code: "CUS_123456789",
		risk_action: "default",
		international_format_phone: null,
	},
	paidAt: "2024-01-01T12:00:00.000Z",
	createdAt: "2024-01-01T11:59:50.000Z",
	requested_amount: 50000,
	pos_transaction_data: null,
	connect: null,
	order_id: null,
	metadata: null,
	plan: null,
	split: null,
	subaccount: null,
	source: null,
};

export const mockListTransactionsResponse: z.infer<typeof txnListSuccess> = {
	status: true,
	message: "Transactions retrieved",
	data: [singleTransaction],
	meta: {
		next: "https://api.paystack.co/transaction?page=2",
		previous: null,
		perPage: 50,
	},
};

export const mockSingleTransactionResponse: z.infer<typeof txnSingleSuccess> = {
	status: true,
	message: "Transaction retrieved",
	data: singleTransaction,
};

export const mockChargeAuthorizationResponse: z.infer<typeof txnChargeSuccess> =
	{
		status: true,
		message: "Charge attempted",
		data: {
			amount: 50000,
			currency: "NGN",
			transaction_date: "2024-01-01T12:00:00.000Z",
			status: "success",
			reference: "test-charge-ref-123",
			domain: "test",
			metadata: "",
			gateway_response: "Successful",
			message: null,
			channel: "card",
			ip_address: null,
			log: null,
			fees: 750,
			authorization: singleTransaction.authorization,
			customer: singleTransaction.customer,
			plan: null,
			id: 98765,
		},
	};

export const mockViewTimelineResponse: z.infer<typeof txnTimelineSuccess> = {
	status: true,
	message: "Timeline retrieved",
	data: {
		start_time: "12:00",
		time_spent: 30,
		attempts: 1,
		errors: 0,
		success: true,
		mobile: false,
		input: [],
		history: [],
	},
};

export const mockTransactionTotalsResponse: z.infer<typeof txnTotalsSuccess> = {
	status: true,
	message: "Transaction totals retrieved",
	data: {
		total_transactions: 100,
		total_volume: 5000000,
		total_volume_by_currency: [
			{
				currency: "NGN",
				amount: 5000000,
			},
		],
		pending_transfers: 10,
		pending_transfers_by_currency: [
			{
				currency: "NGN",
				amount: 500000,
			},
		],
	},
};

export const mockExportTransactionsResponse: z.infer<typeof txnExportSuccess> =
	{
		status: true,
		message: "Export successful",
		data: {
			path: "https://example.com/export.csv",
			expiresAt: "2024-01-01T13:00:00.000Z",
		},
	};

export const mockPartialDebitResponse: z.infer<typeof txnPartialDebitSuccess> =
	{
		...mockChargeAuthorizationResponse,
		data: {
			...mockChargeAuthorizationResponse.data,
			requested_amount: 60000,
		},
	};
