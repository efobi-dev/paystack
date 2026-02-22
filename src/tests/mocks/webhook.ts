import type { z } from "zod";
import type {
	transactionSuccessful,
	transferFailed,
	transferReversed,
	transferSuccess,
} from "../../zod/webhook";

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
		order_id: null,
		requested_amount: 50000,
		pos_transaction_data: null,
		connect: undefined,
	},
};

// Mirrors a real Paystack charge.success payload where `bank` is null
export const mockChargeSuccessNullBankPayload: z.infer<
	typeof transactionSuccessful
> = {
	event: "charge.success",
	data: {
		...mockChargeSuccessPayload.data,
		authorization: {
			authorization_code: "AUTH_999999999",
			bin: "539983",
			last4: "0008",
			exp_month: "10",
			exp_year: "2031",
			channel: "card",
			card_type: "mastercard",
			bank: null,
			country_code: "NG",
			brand: "mastercard",
			account_name: null,
		},
	},
};

const baseTransferRecipient = {
	active: true,
	currency: "NGN" as const,
	description: "Test recipient",
	domain: "test",
	email: "recipient@example.com",
	id: 22,
	integration: 100073,
	metadata: null,
	name: "John Doe",
	recipient_code: "RCP_abcdef123456",
	type: "nuban",
	is_deleted: false,
	created_at: "2024-01-01T00:00:00.000Z",
	updated_at: "2024-01-01T00:00:00.000Z",
	details: {
		account_number: "0000000000",
		account_name: "John Doe",
		bank_code: "058",
		bank_name: "Guaranty Trust Bank",
	},
};

const baseTransferData = {
	amount: 50000,
	currency: "NGN" as const,
	domain: "test",
	failures: null,
	id: 1,
	integration: {
		id: 100073,
		is_live: false,
		business_name: "Acme Corp",
	},
	reason: "Test transfer",
	reference: "TRF_ref_001",
	source: "balance",
	source_details: null,
	titan_code: null,
	transfer_code: "TRF_abc123def456",
	transferred_at: null,
	session: {
		provider: null,
		id: null,
	},
};

export const mockTransferSuccessWebhookPayload: z.infer<
	typeof transferSuccess
> = {
	event: "transfer.success",
	data: {
		...baseTransferData,
		status: "success",
		transferred_at: "2024-01-01T12:05:00.000Z",
		created_at: "2024-01-01T12:00:00.000Z",
		updated_at: "2024-01-01T12:05:00.000Z",
		recipient: baseTransferRecipient,
	},
};

// Mirrors a real payload where created_at/updated_at are absent and description is null
export const mockTransferFailedWebhookPayload: z.infer<typeof transferFailed> =
	{
		event: "transfer.failed",
		data: {
			...baseTransferData,
			status: "failed",
			recipient: {
				...baseTransferRecipient,
				description: null,
				created_at: undefined,
				updated_at: undefined,
				details: {
					account_number: "0000000000",
					account_name: null,
					bank_code: "058",
					bank_name: "Guaranty Trust Bank",
					authorization_code: null,
				},
			},
		},
	};

export const mockTransferReversedWebhookPayload: z.infer<
	typeof transferReversed
> = {
	event: "transfer.reversed",
	data: {
		...baseTransferData,
		status: "reversed",
		recipient: {
			...baseTransferRecipient,
			description: null,
			created_at: undefined,
			updated_at: undefined,
			details: {
				account_number: "0000000000",
				account_name: null,
				bank_code: "058",
				bank_name: "Guaranty Trust Bank",
				authorization_code: null,
			},
		},
	},
};
