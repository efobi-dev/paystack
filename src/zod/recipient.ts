import { z } from "zod";
import { currency, genericResponse } from ".";

export const recipientCreateInput: z.ZodObject<{
	type: z.ZodEnum<{
		nuban: "nuban";
		ghipss: "ghipss";
		mobile_money: "mobile_money";
	}>;
	name: z.ZodString;
	account_number: z.ZodString;
	bank_code: z.ZodString;
	description: z.ZodOptional<z.ZodString>;
	currency: z.ZodOptional<
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
	>;
	authorization_code: z.ZodOptional<z.ZodString>;
	metadata: z.ZodOptional<z.ZodAny>;
}> = z.object({
	type: z.enum(["nuban", "ghipss", "mobile_money"]),
	name: z.string(),
	account_number: z.string(),
	bank_code: z.string(),
	description: z.string().optional(),
	currency: currency.optional(),
	authorization_code: z.string().optional(),
	metadata: z.any().optional(),
});

export const recipientCreateSuccess: z.ZodObject<{
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
			active: z.ZodBoolean;
			createdAt: z.ZodISODateTime;
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
			domain: z.ZodString;
			id: z.ZodNumber;
			integration: z.ZodNumber;
			name: z.ZodString;
			recipient_code: z.ZodString;
			type: z.ZodEnum<{
				nuban: "nuban";
				ghipss: "ghipss";
				mobile_money: "mobile_money";
			}>;
			updatedAt: z.ZodISODateTime;
			is_deleted: z.ZodBoolean;
			details: z.ZodObject<
				{
					authorization_code: z.ZodNullable<z.ZodUnknown>;
					account_number: z.ZodString;
					account_name: z.ZodString;
					bank_code: z.ZodString;
					bank_name: z.ZodString;
				},
				z.core.$strip
			>;
		},
		z.core.$strip
	>;
}> = genericResponse.extend({
	data: z.object({
		active: z.boolean(),
		createdAt: z.iso.datetime(),
		currency,
		domain: z.string(),
		id: z.number(),
		integration: z.number(),
		name: z.string(),
		recipient_code: z.string().startsWith("RCP_"),
		type: z.enum(["nuban", "ghipss", "mobile_money"]),
		updatedAt: z.iso.datetime(),
		is_deleted: z.boolean(),
		details: z.object({
			authorization_code: z.unknown().nullable(),
			account_number: z.string(),
			account_name: z.string(),
			bank_code: z.string(),
			bank_name: z.string(),
		}),
	}),
});

export const recipientBulkCreateInput: z.ZodObject<{
	batch: z.ZodArray<
		z.ZodObject<
			{
				type: z.ZodEnum<{
					nuban: "nuban";
					ghipss: "ghipss";
					mobile_money: "mobile_money";
				}>;
				name: z.ZodString;
				account_number: z.ZodString;
				bank_code: z.ZodString;
				description: z.ZodOptional<z.ZodString>;
				currency: z.ZodOptional<
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
				>;
				authorization_code: z.ZodOptional<z.ZodString>;
				metadata: z.ZodOptional<z.ZodAny>;
			},
			z.core.$strip
		>
	>;
}> = z.object({
	batch: z.array(recipientCreateInput),
});

export const recipientBulkCreateSuccess: z.ZodObject<{
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
			success: z.ZodArray<
				z.ZodObject<
					{
						domain: z.ZodString;
						name: z.ZodString;
						type: z.ZodEnum<{
							nuban: "nuban";
							ghipss: "ghipss";
							mobile_money: "mobile_money";
						}>;
						description: z.ZodOptional<z.ZodString>;
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
						metadata: z.ZodNullable<z.ZodAny>;
						details: z.ZodObject<
							{
								account_number: z.ZodString;
								account_name: z.ZodString;
								bank_code: z.ZodString;
								bank_name: z.ZodString;
							},
							z.core.$strip
						>;
						recipient_code: z.ZodString;
						active: z.ZodBoolean;
						id: z.ZodNumber;
						isDeleted: z.ZodBoolean;
						createdAt: z.ZodISODateTime;
						updatedAt: z.ZodISODateTime;
					},
					z.core.$strip
				>
			>;
			errors: z.ZodArray<z.ZodUnknown>;
		},
		z.core.$strip
	>;
}> = genericResponse.extend({
	data: z.object({
		success: z.array(
			z.object({
				domain: z.string(),
				name: z.string(),
				type: z.enum(["nuban", "ghipss", "mobile_money"]),
				description: z.string().optional(),
				currency,
				metadata: z.any().nullable(),
				details: z.object({
					account_number: z.string(),
					account_name: z.string(),
					bank_code: z.string(),
					bank_name: z.string(),
				}),
				recipient_code: z.string().startsWith("RCP_"),
				active: z.boolean(),
				id: z.number(),
				isDeleted: z.boolean(),
				createdAt: z.iso.datetime(),
				updatedAt: z.iso.datetime(),
			}),
		),
		errors: z.array(z.unknown()),
	}),
});

export const recipientListSuccess: z.ZodObject<{
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
				domain: z.ZodString;
				type: z.ZodEnum<{
					nuban: "nuban";
					ghipss: "ghipss";
					mobile_money: "mobile_money";
				}>;
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
						account_name: z.ZodNullable<z.ZodString>;
						bank_code: z.ZodString;
						bank_name: z.ZodString;
					},
					z.core.$strip
				>;
				metadata: z.ZodAny;
				recipient_code: z.ZodString;
				active: z.ZodBoolean;
				id: z.ZodNumber;
				createdAt: z.ZodISODateTime;
				updatedAt: z.ZodISODateTime;
			},
			z.core.$strip
		>
	>;
}> = genericResponse.extend({
	data: z.array(
		z.object({
			domain: z.string(),
			type: z.enum(["nuban", "ghipss", "mobile_money"]),
			currency,
			name: z.string(),
			details: z.object({
				account_number: z.string(),
				account_name: z.string().nullable(),
				bank_code: z.string(),
				bank_name: z.string(),
			}),
			metadata: z.any(),
			recipient_code: z.string().startsWith("RCP_"),
			active: z.boolean(),
			id: z.number(),
			createdAt: z.iso.datetime(),
			updatedAt: z.iso.datetime(),
		}),
	),
});

export const recipientSingleSuccess: z.ZodObject<{
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
			integration: z.ZodNumber;
			domain: z.ZodString;
			type: z.ZodEnum<{
				nuban: "nuban";
				ghipss: "ghipss";
				mobile_money: "mobile_money";
			}>;
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
					account_name: z.ZodNullable<z.ZodString>;
					bank_code: z.ZodString;
					bank_name: z.ZodString;
				},
				z.core.$strip
			>;
			description: z.ZodNullable<z.ZodString>;
			metadata: z.ZodAny;
			recipient_code: z.ZodString;
			active: z.ZodBoolean;
			email: z.ZodNullable<z.ZodString>;
			id: z.ZodNumber;
			isDeleted: z.ZodOptional<z.ZodBoolean>;
			createdAt: z.ZodISODateTime;
			updatedAt: z.ZodISODateTime;
		},
		z.core.$strip
	>;
}> = genericResponse.extend({
	data: z.object({
		integration: z.number(),
		domain: z.string(),
		type: z.enum(["nuban", "ghipss", "mobile_money"]),
		currency,
		name: z.string(),
		details: z.object({
			account_number: z.string(),
			account_name: z.string().nullable(),
			bank_code: z.string(),
			bank_name: z.string(),
		}),
		description: z.string().nullable(),
		metadata: z.any(),
		recipient_code: z.string().startsWith("RCP_"),
		active: z.boolean(),
		email: z.string().email().nullable(),
		id: z.number(),
		isDeleted: z.boolean().optional(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
});

export const recipientUpdateInput: z.ZodObject<{
	id_or_code: z.ZodString;
	name: z.ZodString;
	email: z.ZodOptional<z.ZodEmail>;
}> = z.object({
	id_or_code: z.string(),
	name: z.string(),
	email: z.email().optional(),
});

// Explicit type aliases — prevents TypeScript from inline-expanding z.infer<> in .d.ts files
export type RecipientCreateInput = z.infer<typeof recipientCreateInput>;
export type RecipientCreateSuccess = z.infer<typeof recipientCreateSuccess>;
export type RecipientBulkCreateInput = z.infer<typeof recipientBulkCreateInput>;
export type RecipientBulkCreateSuccess = z.infer<
	typeof recipientBulkCreateSuccess
>;
export type RecipientListSuccess = z.infer<typeof recipientListSuccess>;
export type RecipientSingleSuccess = z.infer<typeof recipientSingleSuccess>;
export type RecipientUpdateInput = z.infer<typeof recipientUpdateInput>;
