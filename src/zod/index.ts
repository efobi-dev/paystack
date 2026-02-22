import { z } from "zod";

export const meta = z.object({
	total: z.number().optional(),
	skipped: z.number().optional(),
	perPage: z.coerce.number().optional(),
	page: z.coerce.number().optional(),
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
	authorization_code: z.string().startsWith("AUTH_").optional(),
	bin: z.string().optional(),
	last4: z.string().optional(),
	exp_month: z.string().optional(),
	exp_year: z.string().optional(),
	channel: z.string().optional(),
	card_type: z.string().optional(),
	bank: z.string().nullable().optional(),
	country_code: z.string().optional(),
	brand: z.string().optional(),
	reusable: z.boolean().optional(),
	signature: z.string().optional(),
	account_name: z.string().nullable().optional(),
});

export const customer = z.object({
	id: z.number(),
	first_name: z.nullable(z.string()),
	last_name: z.nullable(z.string()),
	email: z.email(),
	phone: z.nullable(z.string()),
	metadata: z.nullable(z.any()),
	customer_code: z.string(),
	risk_action: z.string(),
	international_format_phone: z.nullable(z.string()),
});

export const genericInput = z.object({
	perPage: z.coerce.number().min(1).max(100).default(50),
	page: z.coerce.number().min(1).default(1),
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
	metadata: z.nullable(z.any()),
	settlement_bank: z.string(),
	currency,
	account_number: z.string(),
});

export const plan = z.object({
	id: z.number(),
	name: z.string(),
	plan_code: z.string().startsWith("PLN_"),
	description: z.string().nullable(),
	amount: z.number(),
	interval: z.string(),
	send_invoices: z.boolean(),
	send_sms: z.boolean(),
	currency,
});
