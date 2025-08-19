import type { z } from "zod";
import type {
	fetchBanksSuccess,
	virtualAccountAddSplitSuccess,
	virtualAccountCreateSuccess,
	virtualAccountFetchSuccess,
	virtualAccountListSuccess,
	virtualAccountRemoveSplitSuccess,
} from "../../zod/virtual";

const baseVirtualAccount = {
	bank: {
		name: "Wema Bank",
		id: 1,
		slug: "wema-bank",
	},
	account_name: "Test Account",
	account_number: "1234567890",
	assigned: true,
	currency: "NGN" as const,
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
