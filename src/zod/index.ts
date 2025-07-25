import { z } from "zod";

export const meta = z.object({
	total: z.number(),
	skipped: z.number(),
	perPage: z.number(),
	page: z.number(),
	pageCount: z.number(),
});

export const genericResponse = z.object({
	status: z.boolean(),
	message: z.string(),
	data: z.object().optional(),
	meta: z.optional(meta),
});

export const currency = z
	.enum(["NGN", "USD", "GHS", "ZAR", "KES", "XOF"])
	.default("NGN");

export const history = z.array(
	z.object({
		type: z.string(),
		message: z.string(),
		time: z.number(),
	}),
);

export const log = z.object({
	start_time: z.number(),
	time_spent: z.number(),
	attempts: z.number(),
	errors: z.number(),
	success: z.boolean(),
	mobile: z.boolean(),
	input: z.array(z.unknown()),
	history,
});

export const authorization = z.object({
	authorization_code: z.string(),
	bin: z.string(),
	last4: z.string(),
	exp_month: z.string(),
	exp_year: z.string(),
	channel: z.string(),
	card_type: z.string(),
	bank: z.string(),
	country_code: z.string(),
	brand: z.string(),
	reusable: z.boolean(),
	signature: z.string(),
	account_name: z.nullable(z.string()),
});

export const metadata = z.object({
	cart_id: z.number().optional(),
	custom_fields: z
		.array(
			z.object({
				display_name: z.string(),
				variable_name: z.string(),
				value: z.string(),
			}),
		)
		.optional(),
	cancel_action: z.url().optional(),
	custom_filters: z
		.object({
			recurring: z.boolean().optional(),
			banks: z.array(z.string()).optional(),
			card_brands: z.enum(["verve", "visa", "mastercard"]).optional(),
			supported_bank_providers: z.array(z.string()).optional(),
			supported_mobile_money_providers: z
				.array(z.enum(["mtn", "atl", "vod"]))
				.optional(),
		})
		.optional(),
	calling_code: z.string().optional(),
});

export const customer = z.object({
	id: z.number(),
	first_name: z.nullable(z.string()),
	last_name: z.nullable(z.string()),
	email: z.email(),
	phone: z.nullable(z.string()),
	metadata: z.nullable(metadata),
	customer_code: z.string(),
	risk_action: z.string(),
	international_format_phone: z.nullable(z.string()),
});

export const genericInput = z.object({
	perPage: z.number().min(1).max(100).default(50),
	page: z.number().min(1).default(1),
	from: z.iso.datetime().optional(),
	to: z.iso.datetime().optional(),
});

export const subaccount = z.object({
	id: z.number(),
	subbaccount_code: z.string().regex(/^ACCT_\d+$/),
	business_name: z.string(),
	description: z.string(),
	primary_contact_name: z.string().nullable(),
	primary_contact_email: z.email().nullable(),
	primary_contact_phone: z.string().nullable(),
	metadata: z.nullable(metadata),
	settlement_bank: z.string(),
	currency,
	account_number: z.number(),
});
