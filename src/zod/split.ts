import { z } from "zod";
import { currency, genericInput, genericResponse, subaccount } from ".";

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
		z.object({ subaccount: z.string().regex(/^ACT_\d+$/), share: z.number() }),
	),
	bearer_type,
	bearer_subaccount: z.string(),
});

export const splitCreateSuccess = genericResponse.extend({
	data: z.object({
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
	}),
});

export const splitListInput = genericInput.extend({
	name: z.string(),
	active: z.boolean(),
	sort_by: z.string().optional(),
});

export const splitListSuccess = genericResponse.extend({
	data: z.array(
		z.object({
			id: z.number(),
			name: z.string(),
			type,
			currency,
			integration: z.number(),
			domain: z.string(),
			split_code: z.string(),
			active: z.boolean(),
			bearer_type,
			bearer_subaccount: z.string().nullable(),
			createdAt: z.iso.datetime(),
			updatedAt: z.iso.datetime(),
			is_dynamic: z.boolean(),
			subaccounts: z.array(
				z.object({
					subaccount,
					share: z.number(),
				}),
			),
			total_subaccounts: z.number(),
		}),
	),
});

export const splitSingleSuccess = genericResponse.extend({
	data: z.object({
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
	subaccount: z.string().regex(/^ACCT_\d+$/),
	share: z.number(),
});

export const splitSubaccountUpdateSuccess = genericResponse.extend({
	data: z.object({
		id: z.number(),
		name: z.string(),
		type,
		currency,
		integration: z.number(),
		domain: z.string(),
		split_code: z.string(),
		active: z.boolean(),
		bearer_type,
		bearer_subaccount: z.string().nullable(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
		is_dynamic: z.boolean(),
		subaccounts: z.array(
			z.object({
				subaccount,
				share: z.number(),
			}),
		),
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
