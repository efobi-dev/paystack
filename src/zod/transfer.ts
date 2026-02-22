import { z } from "zod";
import { currency, genericInput, genericResponse } from ".";

export const transferInitiateInput: z.ZodObject<{
	source: z.ZodDefault<
		z.ZodEnum<{
			balance: "balance";
		}>
	>;
	amount: z.ZodNumber;
	recipient: z.ZodString;
	reason: z.ZodOptional<z.ZodString>;
	currency: z.ZodDefault<
		z.ZodOptional<
			z.ZodDefault<
				z.ZodEnum<{
					NGN: "NGN";
					USD: "USD";
					GHS: "GHS";
					ZAR: "ZAR";
					KES: "KES";
					XOF: "XOF";
				}>
			>
		>
	>;
	account_reference: z.ZodOptional<z.ZodString>;
	reference: z.ZodString;
}> = z.object({
	source: z.enum(["balance"]).default("balance"),
	amount: z.number().min(1000),
	recipient: z.string().startsWith("RCP_"),
	reason: z.string().optional(),
	currency: currency.optional().default("NGN"),
	account_reference: z.string().optional(),
	reference: z.string(),
});

const transfer = z.object({
	domain: z.string(),
	amount: z.number(),
	currency,
	reference: z.string(),
	source: z.string(),
	reason: z.string(),
	status: z.string(),
	failures: z.unknown().nullable(),
	transfer_code: z.string().startsWith("TRF_"),
	titan_code: z.string().nullable(),
	transferred_at: z.unknown().nullable(),
	id: z.number(),
	integration: z.number(),
	request: z.number(),
	recipient: z.number(),
	created_at: z.iso.datetime().optional(),
	updated_at: z.iso.datetime().optional(),
});

export const transferInitiateSuccess: z.ZodObject<{
	status: z.ZodBoolean;
	message: z.ZodString;
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
	data: z.ZodObject<
		{
			domain: z.ZodString;
			amount: z.ZodNumber;
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
			reference: z.ZodString;
			source: z.ZodString;
			reason: z.ZodString;
			status: z.ZodString;
			failures: z.ZodNullable<z.ZodUnknown>;
			transfer_code: z.ZodString;
			titan_code: z.ZodNullable<z.ZodString>;
			transferred_at: z.ZodNullable<z.ZodUnknown>;
			id: z.ZodNumber;
			integration: z.ZodNumber;
			request: z.ZodNumber;
			recipient: z.ZodNumber;
			created_at: z.ZodOptional<z.ZodISODateTime>;
			updated_at: z.ZodOptional<z.ZodISODateTime>;
			transfersessionid: z.ZodArray<z.ZodUnknown>;
			transfertrials: z.ZodArray<z.ZodUnknown>;
		},
		z.core.$strip
	>;
}> = genericResponse.extend({
	data: transfer.extend({
		transfersessionid: z.array(z.unknown()),
		transfertrials: z.array(z.unknown()),
	}),
});

export const transferError: z.ZodObject<{
	status: z.ZodBoolean;
	message: z.ZodString;
	data: z.ZodOptional<z.ZodObject<{}, z.core.$strip>>;
	meta: z.ZodObject<
		{
			nextStep: z.ZodString;
		},
		z.core.$strip
	>;
	type: z.ZodString;
	code: z.ZodString;
}> = genericResponse.extend({
	meta: z.object({
		nextStep: z.string(),
	}),
	type: z.string(),
	code: z.string(),
});

export const transferFinalizeInput: z.ZodObject<{
	transfer_code: z.ZodString;
	otp: z.ZodString;
}> = z.object({
	transfer_code: z.string().startsWith("TRF_"),
	otp: z.string(),
});

export const transferFinalizeSuccess: z.ZodObject<{
	status: z.ZodBoolean;
	message: z.ZodString;
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
	data: z.ZodObject<
		{
			domain: z.ZodString;
			amount: z.ZodNumber;
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
			reference: z.ZodString;
			source: z.ZodString;
			reason: z.ZodString;
			status: z.ZodString;
			failures: z.ZodNullable<z.ZodUnknown>;
			transfer_code: z.ZodString;
			titan_code: z.ZodNullable<z.ZodString>;
			transferred_at: z.ZodNullable<z.ZodUnknown>;
			id: z.ZodNumber;
			integration: z.ZodNumber;
			request: z.ZodNumber;
			recipient: z.ZodNumber;
			created_at: z.ZodOptional<z.ZodISODateTime>;
			updated_at: z.ZodOptional<z.ZodISODateTime>;
			source_details: z.ZodNullable<z.ZodUnknown>;
		},
		z.core.$strip
	>;
}> = genericResponse.extend({
	data: transfer.extend({
		source_details: z.unknown().nullable(),
	}),
});

export const transferBulkInitiateInput: z.ZodObject<{
	source: z.ZodDefault<
		z.ZodEnum<{
			balance: "balance";
		}>
	>;
	transfers: z.ZodArray<
		z.ZodObject<
			{
				amount: z.ZodNumber;
				recipient: z.ZodString;
				reference: z.ZodString;
				reason: z.ZodOptional<z.ZodString>;
			},
			z.core.$strip
		>
	>;
}> = z.object({
	source: z.enum(["balance"]).default("balance"),
	transfers: z.array(
		z.object({
			amount: z.number(),
			recipient: z.string().startsWith("RCP_"),
			reference: z.string(),
			reason: z.string().optional(),
		}),
	),
});

export const transferBulkInitiateSuccess: z.ZodObject<{
	status: z.ZodBoolean;
	message: z.ZodString;
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
	data: z.ZodArray<
		z.ZodObject<
			{
				reference: z.ZodString;
				recipient: z.ZodString;
				amount: z.ZodNumber;
				transfer_code: z.ZodString;
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
				status: z.ZodString;
			},
			z.core.$strip
		>
	>;
}> = genericResponse.extend({
	data: z.array(
		z.object({
			reference: z.string(),
			recipient: z.string().startsWith("RCP_"),
			amount: z.number(),
			transfer_code: z.string().startsWith("TRF_"),
			currency,
			status: z.string(),
		}),
	),
});

export const transferListInput: z.ZodObject<{
	perPage: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
	page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
	from: z.ZodOptional<z.ZodISODateTime>;
	to: z.ZodOptional<z.ZodISODateTime>;
	recipient: z.ZodOptional<z.ZodString>;
}> = genericInput.extend({
	recipient: z.string().startsWith("RCP_").optional(),
});

const recipient = z.object({
	domain: z.string(),
	type: z.string(),
	currency,
	name: z.string(),
	details: z.object({
		account_number: z.string(),
		account_name: z.string(),
		bank_code: z.string(),
		bank_name: z.string(),
	}),
	description: z.string().nullable(),
	metadata: z.any().nullable(),
	recipient_code: z.string().startsWith("RCP_"),
	active: z.boolean(),
	id: z.number(),
	integration: z.number(),
	created_at: z.iso.datetime().optional(),
	updated_at: z.iso.datetime().optional(),
});

export const transferListSuccess: z.ZodObject<{
	status: z.ZodBoolean;
	message: z.ZodString;
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
	data: z.ZodArray<
		z.ZodObject<
			{
				amount: z.ZodNumber;
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
				reference: z.ZodString;
				id: z.ZodNumber;
				status: z.ZodString;
				domain: z.ZodString;
				reason: z.ZodString;
				failures: z.ZodNullable<z.ZodUnknown>;
				transfer_code: z.ZodString;
				titan_code: z.ZodNullable<z.ZodString>;
				transferred_at: z.ZodNullable<z.ZodUnknown>;
				created_at: z.ZodOptional<z.ZodISODateTime>;
				updated_at: z.ZodOptional<z.ZodISODateTime>;
				integration: z.ZodNumber;
				recipient: z.ZodObject<
					{
						domain: z.ZodString;
						type: z.ZodString;
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
						name: z.ZodString;
						details: z.ZodObject<
							{
								account_number: z.ZodString;
								account_name: z.ZodString;
								bank_code: z.ZodString;
								bank_name: z.ZodString;
							},
							z.core.$strip
						>;
						description: z.ZodNullable<z.ZodString>;
						metadata: z.ZodNullable<z.ZodAny>;
						recipient_code: z.ZodString;
						active: z.ZodBoolean;
						id: z.ZodNumber;
						integration: z.ZodNumber;
						created_at: z.ZodOptional<z.ZodISODateTime>;
						updated_at: z.ZodOptional<z.ZodISODateTime>;
					},
					z.core.$strip
				>;
				source: z.ZodDefault<
					z.ZodEnum<{
						balance: "balance";
					}>
				>;
				source_details: z.ZodNullable<z.ZodUnknown>;
			},
			z.core.$strip
		>
	>;
}> = genericResponse.extend({
	data: z.array(
		transfer.omit({ request: true }).extend({
			integration: z.number(),
			recipient,
			source: z.enum(["balance"]).default("balance"),
			source_details: z.unknown().nullable(),
		}),
	),
});

const transferRecipient = recipient.extend({
	createdAt: z.iso.datetime().optional(),
	description: z.string().nullable().optional(),
	email: z.email().nullable().optional(),
	metadata: z.any().nullable().optional(),
	updatedAt: z.iso.datetime().optional(),
	is_deleted: z.boolean().optional(),
	isDeleted: z.boolean().optional(),
	details: z.object({
		authorization_code: z.string().nullable().optional(),
		account_name: z.string().nullable(),
		account_number: z.string(),
		bank_code: z.string(),
		bank_name: z.string(),
	}),
});

const transferDetails = transfer.extend({
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
	recipient: transferRecipient,
	session: z.object({
		provider: z.unknown().nullable(),
		id: z.unknown().nullable(),
	}),
	fees_charged: z.number(),
	fees_breakdown: z.unknown().nullable(),
	gateway_response: z.unknown().nullable(),
	source: z.enum(["balance"]).default("balance"),
	source_details: z.unknown().nullable(),
});

export const transferSingleSuccess: z.ZodObject<{
	status: z.ZodBoolean;
	message: z.ZodString;
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
	data: z.ZodObject<
		{
			domain: z.ZodString;
			amount: z.ZodNumber;
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
			reference: z.ZodString;
			reason: z.ZodString;
			status: z.ZodString;
			failures: z.ZodNullable<z.ZodUnknown>;
			transfer_code: z.ZodString;
			titan_code: z.ZodNullable<z.ZodString>;
			transferred_at: z.ZodNullable<z.ZodUnknown>;
			id: z.ZodNumber;
			integration: z.ZodNumber;
			request: z.ZodNumber;
			created_at: z.ZodOptional<z.ZodISODateTime>;
			updated_at: z.ZodOptional<z.ZodISODateTime>;
			createdAt: z.ZodISODateTime;
			updatedAt: z.ZodISODateTime;
			recipient: z.ZodObject<
				{
					domain: z.ZodString;
					type: z.ZodString;
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
					name: z.ZodString;
					recipient_code: z.ZodString;
					active: z.ZodBoolean;
					id: z.ZodNumber;
					integration: z.ZodNumber;
					created_at: z.ZodOptional<z.ZodISODateTime>;
					updated_at: z.ZodOptional<z.ZodISODateTime>;
					createdAt: z.ZodOptional<z.ZodISODateTime>;
					description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
					email: z.ZodOptional<z.ZodNullable<z.ZodEmail>>;
					metadata: z.ZodOptional<z.ZodNullable<z.ZodAny>>;
					updatedAt: z.ZodOptional<z.ZodISODateTime>;
					is_deleted: z.ZodOptional<z.ZodBoolean>;
					isDeleted: z.ZodOptional<z.ZodBoolean>;
					details: z.ZodObject<
						{
							authorization_code: z.ZodOptional<z.ZodNullable<z.ZodString>>;
							account_name: z.ZodNullable<z.ZodString>;
							account_number: z.ZodString;
							bank_code: z.ZodString;
							bank_name: z.ZodString;
						},
						z.core.$strip
					>;
				},
				z.core.$strip
			>;
			session: z.ZodObject<
				{
					provider: z.ZodNullable<z.ZodUnknown>;
					id: z.ZodNullable<z.ZodUnknown>;
				},
				z.core.$strip
			>;
			fees_charged: z.ZodNumber;
			fees_breakdown: z.ZodNullable<z.ZodUnknown>;
			gateway_response: z.ZodNullable<z.ZodUnknown>;
			source: z.ZodDefault<
				z.ZodEnum<{
					balance: "balance";
				}>
			>;
			source_details: z.ZodNullable<z.ZodUnknown>;
		},
		z.core.$strip
	>;
}> = genericResponse.extend({
	data: transferDetails,
});

// Explicit type aliases — prevents TypeScript from inline-expanding z.infer<> in .d.ts files
export type TransferInitiateInput = z.infer<typeof transferInitiateInput>;
export type TransferInitiateSuccess = z.infer<typeof transferInitiateSuccess>;
export type TransferError = z.infer<typeof transferError>;
export type TransferFinalizeInput = z.infer<typeof transferFinalizeInput>;
export type TransferFinalizeSuccess = z.infer<typeof transferFinalizeSuccess>;
export type TransferBulkInitiateInput = z.infer<
	typeof transferBulkInitiateInput
>;
export type TransferBulkInitiateSuccess = z.infer<
	typeof transferBulkInitiateSuccess
>;
export type TransferListInput = z.infer<typeof transferListInput>;
export type TransferListSuccess = z.infer<typeof transferListSuccess>;
export type TransferSingleSuccess = z.infer<typeof transferSingleSuccess>;
