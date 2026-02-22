import { z } from "zod";

export const meta: z.ZodObject<{
	total: z.ZodOptional<z.ZodNumber>;
	skipped: z.ZodOptional<z.ZodNumber>;
	perPage: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
	page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
	pageCount: z.ZodOptional<z.ZodNumber>;
}> = z.object({
	total: z.number().optional(),
	skipped: z.number().optional(),
	perPage: z.coerce.number().optional(),
	page: z.coerce.number().optional(),
	pageCount: z.number().optional(),
});

export const genericResponse: z.ZodObject<{
	status: z.ZodBoolean;
	message: z.ZodString;
	data: z.ZodOptional<z.ZodObject<{}, z.core.$strip>>;
	meta: z.ZodOptional<
		z.ZodObject<
			{
				total: z.ZodOptional<z.ZodNumber>;
				skipped: z.ZodOptional<z.ZodNumber>;
				perPage: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
				page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
				pageCount: z.ZodOptional<z.ZodNumber>;
			},
			z.core.$strip
		>
	>;
}> = z.object({
	status: z.boolean(),
	message: z.string(),
	data: z.object().optional(),
	meta: z.optional(meta),
});

export const currency: z.ZodDefault<
	z.ZodEnum<{
		NGN: "NGN";
		USD: "USD";
		GHS: "GHS";
		ZAR: "ZAR";
		KES: "KES";
		XOF: "XOF";
	}>
> = z.enum(["NGN", "USD", "GHS", "ZAR", "KES", "XOF"]).default("NGN");

export const history: z.ZodArray<
	z.ZodObject<
		{
			type: z.ZodString;
			message: z.ZodString;
			time: z.ZodNumber;
		},
		z.core.$strip
	>
> = z.array(
	z.object({
		type: z.string(),
		message: z.string(),
		time: z.number(),
	}),
);

export const log: z.ZodObject<{
	start_time: z.ZodNumber;
	time_spent: z.ZodNumber;
	attempts: z.ZodNumber;
	errors: z.ZodNumber;
	success: z.ZodBoolean;
	mobile: z.ZodBoolean;
	input: z.ZodArray<z.ZodUnknown>;
	history: z.ZodArray<
		z.ZodObject<
			{
				type: z.ZodString;
				message: z.ZodString;
				time: z.ZodNumber;
			},
			z.core.$strip
		>
	>;
}> = z.object({
	start_time: z.number(),
	time_spent: z.number(),
	attempts: z.number(),
	errors: z.number(),
	success: z.boolean(),
	mobile: z.boolean(),
	input: z.array(z.unknown()),
	history,
});

export const authorization: z.ZodObject<{
	authorization_code: z.ZodOptional<z.ZodString>;
	bin: z.ZodOptional<z.ZodString>;
	last4: z.ZodOptional<z.ZodString>;
	exp_month: z.ZodOptional<z.ZodString>;
	exp_year: z.ZodOptional<z.ZodString>;
	channel: z.ZodOptional<z.ZodString>;
	card_type: z.ZodOptional<z.ZodString>;
	bank: z.ZodOptional<z.ZodNullable<z.ZodString>>;
	country_code: z.ZodOptional<z.ZodString>;
	brand: z.ZodOptional<z.ZodString>;
	reusable: z.ZodOptional<z.ZodBoolean>;
	signature: z.ZodOptional<z.ZodString>;
	account_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}> = z.object({
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

export const customer: z.ZodObject<{
	id: z.ZodNumber;
	first_name: z.ZodNullable<z.ZodString>;
	last_name: z.ZodNullable<z.ZodString>;
	email: z.ZodEmail;
	phone: z.ZodNullable<z.ZodString>;
	metadata: z.ZodNullable<z.ZodAny>;
	customer_code: z.ZodString;
	risk_action: z.ZodString;
	international_format_phone: z.ZodNullable<z.ZodString>;
}> = z.object({
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

export const genericInput: z.ZodObject<{
	perPage: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
	page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
	from: z.ZodOptional<z.ZodISODateTime>;
	to: z.ZodOptional<z.ZodISODateTime>;
}> = z.object({
	perPage: z.coerce.number().min(1).max(100).default(50),
	page: z.coerce.number().min(1).default(1),
	from: z.iso.datetime().optional(),
	to: z.iso.datetime().optional(),
});

export const subaccount: z.ZodObject<{
	id: z.ZodNumber;
	subaccount_code: z.ZodString;
	business_name: z.ZodString;
	description: z.ZodString;
	primary_contact_name: z.ZodNullable<z.ZodString>;
	primary_contact_email: z.ZodNullable<z.ZodEmail>;
	primary_contact_phone: z.ZodNullable<z.ZodString>;
	metadata: z.ZodNullable<z.ZodAny>;
	settlement_bank: z.ZodString;
	currency: z.ZodDefault<
		z.ZodEnum<{
			NGN: "NGN";
			USD: "USD";
			GHS: "GHS";
			ZAR: "ZAR";
			KES: "KES";
			XOF: "XOF";
		}>
	>;
	account_number: z.ZodString;
}> = z.object({
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

export const plan: z.ZodObject<{
	id: z.ZodNumber;
	name: z.ZodString;
	plan_code: z.ZodString;
	description: z.ZodNullable<z.ZodString>;
	amount: z.ZodNumber;
	interval: z.ZodString;
	send_invoices: z.ZodBoolean;
	send_sms: z.ZodBoolean;
	currency: z.ZodDefault<
		z.ZodEnum<{
			NGN: "NGN";
			USD: "USD";
			GHS: "GHS";
			ZAR: "ZAR";
			KES: "KES";
			XOF: "XOF";
		}>
	>;
}> = z.object({
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

// Explicit type aliases — prevents TypeScript from inline-expanding z.infer<> in .d.ts files
export type Meta = z.infer<typeof meta>;
export type GenericResponse = z.infer<typeof genericResponse>;
export type Currency = z.infer<typeof currency>;
export type History = z.infer<typeof history>;
export type Log = z.infer<typeof log>;
export type Authorization = z.infer<typeof authorization>;
export type Customer = z.infer<typeof customer>;
export type GenericInput = z.infer<typeof genericInput>;
export type Subaccount = z.infer<typeof subaccount>;
export type Plan = z.infer<typeof plan>;
