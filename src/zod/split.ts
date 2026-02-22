import { z } from "zod";
import { currency, genericInput, genericResponse, meta, subaccount } from ".";

export const type = z.enum(["percentage", "flat"]);
export const bearer_type = z.enum([
	"subaccount",
	"account",
	"all-proportional",
	"all",
]);

export const splitCreateInput = z.object({
	name: z.string(),
	type,
	currency,
	subaccounts: z.array(
		z.object({
			subaccount: z.string().startsWith("ACCT_"),
			share: z.number(),
		}),
	),
	bearer_type,
	bearer_subaccount: z.string(),
});

export const baseSplitSchema = z.object({
	id: z.number(),
	name: z.string(),
	type,
	currency,
	integration: z.number(),
	domain: z.string(),
	split_code: z.string(),
	active: z.boolean(),
	bearer_type,
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
	is_dynamic: z.boolean(),
	subaccounts: z.array(
		z.object({
			subaccount,
			share: z.number(),
		}),
	),
});

export const splitCreateSuccess = genericResponse.extend({
	data: baseSplitSchema,
});

export const splitListInput = genericInput.extend({
	name: z.string(),
	active: z.boolean(),
	sort_by: z.string().optional(),
});

export const splitListSuccess = genericResponse.extend({
	data: z.array(
		baseSplitSchema.extend({
			bearer_subaccount: z.string().nullable(),
			total_subaccounts: z.number(),
		}),
	),
	meta,
});

export const splitSingleSuccess = genericResponse.extend({
	data: baseSplitSchema.extend({
		total_subaccounts: z.number(),
	}),
});

export const splitUpdateInput = z.object({
	id: z.string(),
	name: z.string(),
	active: z.boolean(),
	bearer_type: z.optional(bearer_type),
	bearer_subaccount: z.string().optional(),
});

export const splitSubaccountInput = z.object({
	id: z.string(),
	subaccount: z.string().startsWith("ACCT_"),
	share: z.number(),
});

export const splitSubaccountUpdateSuccess = genericResponse.extend({
	data: baseSplitSchema.extend({
		bearer_subaccount: z.string().nullable(),
		total_subaccounts: z.number(),
	}),
});

export const splitSubaccountRemoveInput = splitSubaccountInput.omit({
	share: true,
});

export const splitSubaccountRemoveError = genericResponse.extend({
	meta: z.object({
		nextStep: z.string().optional(),
	}),
	type: z.string().optional(),
	code: z.string().optional(),
});

// Explicit type aliases — prevents TypeScript from inline-expanding z.infer<> in .d.ts files
export type SplitType = z.infer<typeof type>;
export type BearerType = z.infer<typeof bearer_type>;
export type BaseSplitSchema = z.infer<typeof baseSplitSchema>;
export type SplitCreateInput = z.infer<typeof splitCreateInput>;
export type SplitCreateSuccess = z.infer<typeof splitCreateSuccess>;
export type SplitListInput = z.infer<typeof splitListInput>;
export type SplitListSuccess = z.infer<typeof splitListSuccess>;
export type SplitSingleSuccess = z.infer<typeof splitSingleSuccess>;
export type SplitUpdateInput = z.infer<typeof splitUpdateInput>;
export type SplitSubaccountInput = z.infer<typeof splitSubaccountInput>;
export type SplitSubaccountUpdateSuccess = z.infer<typeof splitSubaccountUpdateSuccess>;
export type SplitSubaccountRemoveInput = z.infer<typeof splitSubaccountRemoveInput>;
export type SplitSubaccountRemoveError = z.infer<typeof splitSubaccountRemoveError>;
