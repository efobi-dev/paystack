import { z } from "zod";

export const meta = z.object({
	total: z.number().optional(),
	skipped: z.number().optional(),
	perPage: z.number().optional(),
	page: z.number().optional(),
	pageCount: z.number().optional(),
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
	authorization_code: z.string().startsWith("AUTH_"),
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
	account_name: z.string().nullable(),
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
	subaccount_code: z.string().startsWith("ACCT_"),
	business_name: z.string(),
	description: z.string(),
	primary_contact_name: z.string().nullable(),
	primary_contact_email: z.email().nullable(),
	primary_contact_phone: z.string().nullable(),
	metadata: z.nullable(metadata),
	settlement_bank: z.string(),
	currency,
	account_number: z.string(),
});

export const plan = z.object({
	name: z.string(),
	plan_code: z.string().startsWith("PLN_"),
	description: z.string().nullable(),
	amount: z.number(),
	interval: z.string(),
	send_invoices: z.boolean(),
	send_sms: z.boolean(),
	currency,
});
