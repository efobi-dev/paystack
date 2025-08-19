import type { z } from "zod";
import type {
	splitCreateSuccess,
	splitListSuccess,
	splitSingleSuccess,
	splitSubaccountUpdateSuccess,
} from "../../zod/split";

const baseSplit = {
	id: 12345,
	name: "Test Split",
	type: "percentage" as const,
	currency: "NGN" as const,
	integration: 100073,
	domain: "test",
	split_code: "SPL_123456789",
	active: true,
	bearer_type: "subaccount" as const,
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
				currency: "NGN" as const,
				account_number: "0123456789",
			},
			share: 50,
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
