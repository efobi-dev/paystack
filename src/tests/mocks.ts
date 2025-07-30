import type { z } from "zod";
import type {
	splitCreateSuccess,
	splitListSuccess,
	splitSingleSuccess,
	splitSubaccountUpdateSuccess,
} from "../zod/split";
import type {
	fetchBanksSuccess,
	virtualAccountAddSplitSuccess,
	virtualAccountCreateSuccess,
	virtualAccountFetchSuccess,
	virtualAccountListSuccess,
	virtualAccountRemoveSplitSuccess,
} from "../zod/virtual";
import type {
	miscellaneousListBanksSuccess,
	miscellaneousListCountriesSuccess,
	miscellaneousListStatesSuccess,
} from "../zod/miscellaneous";
import type {
	verificationResolveAccountSuccess,
	verificationResolveCardBinSuccess,
	verificationValidateAccountResponse,
} from "../zod/verification";
import type { transactionSuccessful } from "../zod/webhook";
import type {
	txnChargeSuccess,
	txnExportSuccess,
	txnListSuccess,
	txnPartialDebitSuccess,
	txnSingleSuccess,
	txnTimelineSuccess,
	txnTotalsSuccess,
	txnVerifySuccess,
} from "../zod/transaction";
import type { genericResponse } from "../zod";

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
		split: {},
		source: null,
		fees_breakdown: null,
		transaction_date: "2024-01-01T12:00:00.000Z",
		plan_object: {},
		subaccount: {},
	},
};

export const mockErrorResponse: z.infer<typeof genericResponse> = {
	status: false,
	message: "Invalid transaction reference",
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
	split: {},
	subaccount: {},
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

export const mockChargeAuthorizationResponse: z.infer<
	typeof txnChargeSuccess
> = {
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

export const mockExportTransactionsResponse: z.infer<typeof txnExportSuccess> = {
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

const baseSplit = {
	id: 12345,
	name: "Test Split",
	type: "percentage",
	currency: "NGN",
	integration: 100073,
	domain: "test",
	split_code: "SPL_123456789",
	active: true,
	bearer_type: "subaccount",
	createdAt: "2024-01-01T12:00:00.000Z",
	updatedAt: "2024-01-01T12:00:00.000Z",
	is_dynamic: false,
	subaccounts: [
		{
			subaccount: {
				id: 9876,
				subaccount_code: "ACCT_123456789",
				business_name: "Test Business",
				description: "Test",
				primary_contact_name: null,
				primary_contact_email: null,
				primary_contact_phone: null,
				metadata: null,
				settlement_bank: "Test Bank",
				currency: "NGN",
				account_number: "0123456789",
			},
			share: 50,
		},
	],
};

export const mockChargeSuccessPayload: z.infer<typeof transactionSuccessful> = {
	event: "charge.success",
	data: {
		id: 316712345,
		domain: "test",
		status: "success",
		reference: "test-reference-123",
		amount: 50000,
		message: null,
		gateway_response: "Successful",
		paid_at: "2024-01-01T12:00:00.000Z",
		created_at: "2024-01-01T11:59:50.000Z",
		channel: "card",
		currency: "NGN",
		ip_address: "127.0.0.1",
		metadata: {
			cart_id: 1,
		},
		log: {
			time_spent: 10,
			attempts: 1,
			authentication: "pin",
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
			account_name: null,
		},
		customer: {
			first_name: "John",
			last_name: "Doe",
			email: "john.doe@example.com",
			customer_code: "CUS_123456789",
			phone: null,
			metadata: null,
			risk_action: "default",
		},
		plan: null,
		split: {},
		order_id: null,
		requested_amount: 50000,
		pos_transaction_data: null,
		subaccount: {},
		source: null,
	},
};

export const mockResolveAccountResponse: z.infer<
	typeof verificationResolveAccountSuccess
> = {
	status: true,
	message: "Account resolved",
	data: {
		account_number: "0123456789",
		account_name: "John Doe",
	},
};

export const mockValidateAccountResponse: z.infer<
	typeof verificationValidateAccountResponse
> = {
	status: true,
	message: "Account validated",
	data: {
		verified: true,
		verificationMessage: "Account is valid",
	},
};

export const mockResolveCardBinResponse: z.infer<
	typeof verificationResolveCardBinSuccess
> = {
	status: true,
	message: "Card BIN resolved",
	data: {
		bin: "408408",
		brand: "Verve",
		sub_brand: "",
		country_code: "NG",
		country_name: "Nigeria",
		card_type: "DEBIT",
		bank: "Test Bank",
		linked_bank_id: 1,
	},
};

export const mockListBanksResponse: z.infer<
	typeof miscellaneousListBanksSuccess
> = {
	status: true,
	message: "Banks retrieved",
	data: [
		{
			name: "Test Bank",
			slug: "test-bank",
			code: "000",
			longcode: "000000",
			gateway: null,
			pay_with_bank: true,
			active: true,
			is_deleted: false,
			country: "Nigeria",
			currency: "NGN",
			type: "nuban",
			id: 1,
			createdAt: "2024-01-01T12:00:00.000Z",
			updatedAt: "2024-01-01T12:00:00.000Z",
		},
	],
};

export const mockListCountriesResponse: z.infer<
	typeof miscellaneousListCountriesSuccess
> = {
	status: true,
	message: "Countries retrieved",
	data: [
		{
			id: 1,
			name: "Nigeria",
			iso_code: "NG",
			default_currency_code: "NGN",
			integration_defaults: {},
			relationships: {
				currency: { type: "currency", data: ["NGN"] },
				integration_feature: { type: "integration_feature", data: [] },
				integration_type: { type: "integration_type", data: [] },
				payment_method: { type: "payment_method", data: [] },
			},
		},
	],
};

export const mockListStatesResponse: z.infer<
	typeof miscellaneousListStatesSuccess
> = {
	status: true,
	message: "States retrieved",
	data: [
		{
			name: "Lagos",
			slug: "lagos",
			abbreviation: "LA",
		},
	],
};

export const mockCreateSplitResponse: z.infer<typeof splitCreateSuccess> = {
	status: true,
	message: "Split created successfully",
	data: baseSplit,
};

export const mockListSplitsResponse: z.infer<typeof splitListSuccess> = {
	status: true,
	message: "Splits retrieved",
	data: [
		{
			...baseSplit,
			bearer_subaccount: null,
			total_subaccounts: 1,
		},
	],
	meta: {
		total: 1,
		skipped: 0,
		perPage: 50,
		page: 1,
		pageCount: 1,
	},
};

export const mockSingleSplitResponse: z.infer<typeof splitSingleSuccess> = {
	status: true,
	message: "Split retrieved",
	data: {
		...baseSplit,
		total_subaccounts: 1,
	},
};

export const mockUpdateSplitSubaccountResponse: z.infer<
	typeof splitSubaccountUpdateSuccess
> = {
	status: true,
	message: "Subaccount added",
	data: {
		...baseSplit,
		bearer_subaccount: null,
		total_subaccounts: 2,
	},
};

const baseVirtualAccount = {
	bank: {
		name: "Wema Bank",
		id: 1,
		slug: "wema-bank",
	},
	account_name: "Test Account",
	account_number: "1234567890",
	assigned: true,
	currency: "NGN",
	metadata: null,
	active: true,
	id: 123,
	created_at: "2024-01-01T12:00:00.000Z",
	updated_at: "2024-01-01T12:00:00.000Z",
	assignment: {
		integration: 100073,
		assignee_id: 12345,
		assignee_type: "Customer",
		expired: false,
		account_type: "PAYSTACK",
		assigned_at: "2024-01-01T12:00:00.000Z",
	},
	customer: {
		id: 12345,
		first_name: "John",
		last_name: "Doe",
		email: "john.doe@example.com",
		phone: "08012345678",
		customer_code: "CUS_123456789",
		risk_action: "default",
	},
};

export const mockCreateVirtualAccountResponse: z.infer<
	typeof virtualAccountCreateSuccess
> = {
	status: true,
	message: "Virtual account created",
	data: baseVirtualAccount,
};

export const mockListVirtualAccountsResponse: z.infer<
	typeof virtualAccountListSuccess
> = {
	status: true,
	message: "Virtual accounts retrieved",
	data: [baseVirtualAccount],
	meta: {
		total: 1,
		skipped: 0,
		perPage: 50,
		page: 1,
		pageCount: 1,
	},
};

export const mockFetchVirtualAccountResponse: z.infer<
	typeof virtualAccountFetchSuccess
> = {
	status: true,
	message: "Virtual account retrieved",
	data: {
		...baseVirtualAccount,
		customer: {
			...baseVirtualAccount.customer,
			metadata: null,
			international_format_phone: null,
		},
		split_config: "SPL_123456789",
	},
};

export const mockDeactivateVirtualAccountResponse = {
	status: true,
	message: "Virtual account deactivated",
	data: {
		...baseVirtualAccount,
		customer: {
			...baseVirtualAccount.customer,
			metadata: null,
			international_format_phone: null,
		},
		split_config: "SPL_123456789",
	},
};

export const mockAddSplitToVirtualAccountResponse: z.infer<
	typeof virtualAccountAddSplitSuccess
> = {
	status: true,
	message: "Split added to virtual account",
	data: {
		...baseVirtualAccount,
		assignment: {
			...baseVirtualAccount.assignment,
			expired_at: null,
		},
		customer: {
			...baseVirtualAccount.customer,
			metadata: null,
		},
		split_config: {
			split_code: "SPL_123456789",
		},
	},
};

export const mockRemoveSplitFromVirtualAccountResponse: z.infer<
	typeof virtualAccountRemoveSplitSuccess
> = {
	status: true,
	message: "Split removed from virtual account",
	data: {
		id: 123,
		split_config: {},
		account_name: "Test Account",
		account_number: "1234567890",
		currency: "NGN",
		assigned: true,
		active: true,
		created_at: "2024-01-01T12:00:00.000Z",
		updated_at: "2024-01-01T12:00:00.000Z",
	},
};

export const mockFetchProvidersResponse: z.infer<typeof fetchBanksSuccess> = {
	status: true,
	message: "Providers retrieved",
	data: [
		{
			provider_slug: "wema-bank",
			bank_id: 1,
			bank_name: "Wema Bank",
			id: 1,
		},
	],
};
