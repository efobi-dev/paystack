import { z } from "zod";
import { currency, customer, genericResponse, meta } from ".";

export const virtualAccountCreateInput = z.object({
	customer: z.string(),
	preferred_bank: z.string().optional(),
	subaccount: z.string().optional(),
	split_code: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	phone: z.string().optional(),
});

export const virtualAccountAssignmentSchema = z.object({
	integration: z.number(),
	assignee_id: z.number(),
	assignee_type: z.string(),
	expired: z.boolean(),
	account_type: z.string(),
	assigned_at: z.iso.datetime(),
});

export const virtualAccountBaseSchema = z.object({
	bank: z.object({
		name: z.string(),
		id: z.number(),
		slug: z.string(),
	}),
	account_name: z.string(),
	account_number: z.string(),
	assigned: z.boolean(),
	currency,
	metadata: z.nullable(z.any()),
	active: z.boolean(),
	id: z.number(),
	created_at: z.iso.datetime(),
	updated_at: z.iso.datetime(),
});

export const virtualAccountCreateSuccess = genericResponse.extend({
	data: virtualAccountBaseSchema.extend({
		assignment: virtualAccountAssignmentSchema,
		customer: customer.omit({
			metadata: true,
			international_format_phone: true,
		}),
	}),
});

export const virtualAccountAssignInput = z.object({
	email: z.email(),
	first_name: z.string(),
	last_name: z.string(),
	phone: z.string(),
	country: z.enum(["NG", "GH"]),
	account_number: z.string().optional(),
	bvn: z.string().optional(),
	bank_code: z.string().optional(),
	subaccount: z.string().optional(),
	split_code: z.string().optional(),
});

export const virtualAccountListInput = z.object({
	active: z.boolean(),
	currency,
	provider_slug: z.string().optional(),
	bank_id: z.string().optional(),
	customer: z.string().optional(),
});

export const virtualAccountListSuccess = genericResponse.extend({
	data: z.array(
		virtualAccountBaseSchema.extend({
			assignment: virtualAccountAssignmentSchema,
			customer: customer.omit({
				metadata: true,
				international_format_phone: true,
			}),
		}),
	),
	meta,
});

export const virtualAccountFetchSuccess = genericResponse.extend({
	data: virtualAccountBaseSchema.extend({
		assignment: virtualAccountAssignmentSchema,
		customer,
		split_config: z.string(),
	}),
});

export const virtualAccountRequeryInput = z.object({
	account_number: z.string(),
	provider_slug: z.string(),
	date: z.iso.date().optional(),
});

export const virtualAccountDeleteSuccess = genericResponse.extend({
	data: virtualAccountBaseSchema.extend({
		assignment: virtualAccountAssignmentSchema.omit({ expired: true }),
		customer,
		split_config: z.string(),
	}),
});

export const virtualAccountAddSplitInput = z.object({
	customer: z.string(),
	subaccount: z.string().optional(),
	split_code: z.string().optional(),
	preferred_bank: z.string().optional(),
});

export const virtualAccountAddSplitSuccess = genericResponse.extend({
	data: virtualAccountBaseSchema.extend({
		assignment: virtualAccountAssignmentSchema.extend({
			expired_at: z.iso.datetime().nullable(),
		}),
		customer: customer.omit({
			international_format_phone: true,
		}),
		split_config: z.object({
			split_code: z.string(),
		}),
	}),
});

export const virtualAccountRemoveSplitInput = virtualAccountRequeryInput.omit({
	provider_slug: true,
	date: true,
});

export const virtualAccountRemoveSplitSuccess = genericResponse.extend({
	data: z.object({
		id: z.number(),
		split_config: z.object(),
		account_name: z.string(),
		account_number: z.string(),
		currency,
		assigned: z.boolean(),
		active: z.boolean(),
		created_at: z.iso.datetime(),
		updated_at: z.iso.datetime(),
	}),
});

export const fetchBanksSuccess = genericResponse.extend({
	data: z.array(
		z.object({
			provider_slug: z.string(),
			bank_id: z.number(),
			bank_name: z.string(),
			id: z.number(),
		}),
	),
});

// Explicit type aliases — prevents TypeScript from inline-expanding z.infer<> in .d.ts files
export type VirtualAccountCreateInput = z.infer<typeof virtualAccountCreateInput>;
export type VirtualAccountAssignment = z.infer<typeof virtualAccountAssignmentSchema>;
export type VirtualAccountBase = z.infer<typeof virtualAccountBaseSchema>;
export type VirtualAccountCreateSuccess = z.infer<typeof virtualAccountCreateSuccess>;
export type VirtualAccountAssignInput = z.infer<typeof virtualAccountAssignInput>;
export type VirtualAccountListInput = z.infer<typeof virtualAccountListInput>;
export type VirtualAccountListSuccess = z.infer<typeof virtualAccountListSuccess>;
export type VirtualAccountFetchSuccess = z.infer<typeof virtualAccountFetchSuccess>;
export type VirtualAccountRequeryInput = z.infer<typeof virtualAccountRequeryInput>;
export type VirtualAccountDeleteSuccess = z.infer<typeof virtualAccountDeleteSuccess>;
export type VirtualAccountAddSplitInput = z.infer<typeof virtualAccountAddSplitInput>;
export type VirtualAccountAddSplitSuccess = z.infer<typeof virtualAccountAddSplitSuccess>;
export type VirtualAccountRemoveSplitInput = z.infer<typeof virtualAccountRemoveSplitInput>;
export type VirtualAccountRemoveSplitSuccess = z.infer<typeof virtualAccountRemoveSplitSuccess>;
export type FetchBanksSuccess = z.infer<typeof fetchBanksSuccess>;
