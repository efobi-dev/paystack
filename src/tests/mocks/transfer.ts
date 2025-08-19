import type { z } from "zod";
import type {
	transferBulkInitiateSuccess,
	transferError,
	transferFinalizeSuccess,
	transferInitiateSuccess,
	transferListSuccess,
	transferSingleSuccess,
} from "../../zod/transfer";

export const mockTransferErrorResponse: z.infer<typeof transferError> = {
	status: false,
	message: "Invalid key",
	meta: {
		nextStep: "done",
	},
	type: "ValidationError",
	code: "invalid_data",
};

export const mockInitiateTransferResponse: z.infer<
	typeof transferInitiateSuccess
> = {
	status: true,
	message: "Transfer has been queued",
	data: {
		integration: 100073,
		domain: "test",
		amount: 30000,
		currency: "NGN",
		source: "balance",
		reason: "Calm down",
		recipient: 22,
		status: "pending",
		transfer_code: "TRF_1ptvuv321ahaa7q",
		id: 1,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		transferred_at: null,
		reference: "ref_123",
		titan_code: "titan_123",
		request: 123,
		transfersessionid: [],
		transfertrials: [],
		failures: null,
	},
};

export const mockFinalizeTransferResponse: z.infer<
	typeof transferFinalizeSuccess
> = {
	status: true,
	message: "Transfer has been completed",
	data: {
		integration: 100073,
		domain: "test",
		amount: 30000,
		currency: "NGN",
		source: "balance",
		reason: "Calm down",
		recipient: 22,
		status: "success",
		transfer_code: "TRF_1ptvuv321ahaa7q",
		transferred_at: null,
		id: 1,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		reference: "ref_123",
		titan_code: "titan_123",
		request: 123,
		failures: null,
		source_details: null,
	},
};

export const mockInitiateBulkTransferResponse: z.infer<
	typeof transferBulkInitiateSuccess
> = {
	status: true,
	message: "2 transfers have been queued",
	data: [
		{
			amount: 20000,
			recipient: "RCP_123456",
			reference: "ref_123",
			currency: "NGN",
			status: "pending",
		},
		{
			amount: 30000,
			recipient: "RCP_123456",
			reference: "ref_456",
			currency: "NGN",
			status: "pending",
		},
	],
};

export const mockListTransfersResponse: z.infer<typeof transferListSuccess> = {
	status: true,
	message: "Transfers retrieved",
	data: [
		{
			integration: 100073,
			domain: "test",
			amount: 30000,
			currency: "NGN",
			source: "balance",
			reason: "Calm down",
			recipient: {
				domain: "test",
				type: "nuban",
				currency: "NGN",
				name: "John Doe",
				details: {
					account_number: "0000000000",
					account_name: "John Doe",
					bank_code: "058",
					bank_name: "Guaranty Trust Bank",
				},
				description: "Test recipient",
				metadata: null,
				recipient_code: "RCP_123456",
				active: true,
				id: 1,
				integration: 100073,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			},
			status: "success",
			transfer_code: "TRF_1ptvuv321ahaa7q",
			id: 1,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			reference: "ref_123",
			titan_code: "titan_123",
			failures: null,
			source_details: null,
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

export const mockFetchTransferResponse: z.infer<typeof transferSingleSuccess> = {
	status: true,
	message: "Transfer retrieved",
	data: {
		integration: 100073,
			domain: "test",
			amount: 30000,
			currency: "NGN",
			source: "balance",
			reason: "Calm down",
			recipient: {
				domain: "test",
				type: "nuban",
				currency: "NGN",
				name: "John Doe",
				details: {
					account_number: "0000000000",
					account_name: "John Doe",
					bank_code: "058",
					bank_name: "Guaranty Trust Bank",
				},
				description: "Test recipient",
				metadata: null,
				recipient_code: "RCP_123456",
				active: true,
				id: 1,
				integration: 100073,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			},
			status: "success",
			transfer_code: "TRF_1ptvuv321ahaa7q",
			id: 1,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			reference: "ref_123",
			titan_code: "titan_123",
			request: 123,
			failures: null,
			session: {
				provider: null,
				id: null,
			},
			fees_charged: 0,
			fees_breakdown: null,
			gateway_response: null,
			source_details: null,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		},
	};

export const mockVerifyTransferResponse: z.infer<typeof transferSingleSuccess> = {
	...mockFetchTransferResponse,
};
