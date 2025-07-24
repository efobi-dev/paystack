import { z } from "zod";

export const genericResponse = z.object({
	status: z.boolean(),
	message: z.string(),
	data: z.object().optional(),
	meta: z
		.object({
			total: z.number(),
			skipped: z.number(),
			perPage: z.number(),
			page: z.number(),
			pageCount: z.number(),
		})
		.optional(),
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

export const customer = z.object({
	id: z.number(),
	first_name: z.nullable(z.string()),
	last_name: z.nullable(z.string()),
	email: z.string(),
	phone: z.nullable(z.string()),
	metadata: z.nullable(
		z.object({
			custom_fields: z.array(
				z.object({
					display_name: z.string(),
					variable_name: z.string(),
					value: z.string(),
				}),
			),
		}),
	),
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
