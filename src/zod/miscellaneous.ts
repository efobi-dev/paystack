import { z } from "zod";
import { currency, genericResponse } from ".";

export const miscellaneousListBanksInput: z.ZodObject<{
	country: z.ZodEnum<{
		ghana: "ghana";
		kenya: "kenya";
		nigeria: "nigeria";
		"south africa": "south africa";
	}>;
	use_cursor: z.ZodDefault<z.ZodBoolean>;
	perPage: z.ZodDefault<z.ZodNumber>;
	pay_with_bank_transfer: z.ZodOptional<z.ZodBoolean>;
	pay_with_bank: z.ZodOptional<z.ZodBoolean>;
	enabled_for_verification: z.ZodOptional<z.ZodBoolean>;
	next: z.ZodOptional<z.ZodString>;
	previous: z.ZodOptional<z.ZodString>;
	gateway: z.ZodOptional<
		z.ZodEnum<{
			emandate: "emandate";
			digitalBankMandate: "digitalBankMandate";
		}>
	>;
	type: z.ZodOptional<z.ZodString>;
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
	include_nip_sort_code: z.ZodOptional<z.ZodBoolean>;
}> = z.object({
	country: z.enum(["ghana", "kenya", "nigeria", "south africa"]),
	use_cursor: z.boolean().default(false),
	perPage: z.number().max(100).default(50),
	pay_with_bank_transfer: z.boolean().optional(),
	pay_with_bank: z.boolean().optional(),
	enabled_for_verification: z.boolean().optional(),
	next: z.string().optional(),
	previous: z.string().optional(),
	gateway: z.enum(["emandate", "digitalBankMandate"]).optional(),
	type: z.string().optional(),
	currency: currency.optional(),
	include_nip_sort_code: z.boolean().optional(),
});

export const miscellaneousListBanksSuccess: z.ZodObject<{
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
				name: z.ZodString;
				slug: z.ZodString;
				code: z.ZodString;
				longcode: z.ZodString;
				gateway: z.ZodNullable<z.ZodUnknown>;
				pay_with_bank: z.ZodBoolean;
				active: z.ZodBoolean;
				is_deleted: z.ZodBoolean;
				country: z.ZodString;
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
				type: z.ZodString;
				id: z.ZodNumber;
				createdAt: z.ZodNullable<z.ZodISODateTime>;
				updatedAt: z.ZodNullable<z.ZodISODateTime>;
			},
			z.core.$strip
		>
	>;
}> = genericResponse.extend({
	data: z.array(
		z.object({
			name: z.string(),
			slug: z.string(),
			code: z.string(),
			longcode: z.string(),
			gateway: z.unknown().nullable(),
			pay_with_bank: z.boolean(),
			active: z.boolean(),
			is_deleted: z.boolean(),
			country: z.string(),
			currency,
			type: z.string(),
			id: z.number(),
			createdAt: z.iso.datetime().nullable(),
			updatedAt: z.iso.datetime().nullable(),
		}),
	),
});

export const miscellaneousListCountriesSuccess: z.ZodObject<{
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
				id: z.ZodNumber;
				name: z.ZodString;
				iso_code: z.ZodString;
				default_currency_code: z.ZodString;
				integration_defaults: z.ZodObject<{}, z.core.$strip>;
				relationships: z.ZodObject<
					{
						currency: z.ZodObject<
							{
								type: z.ZodString;
								data: z.ZodArray<z.ZodString>;
							},
							z.core.$strip
						>;
						integration_feature: z.ZodObject<
							{
								type: z.ZodString;
								data: z.ZodArray<z.ZodString>;
							},
							z.core.$strip
						>;
						integration_type: z.ZodObject<
							{
								type: z.ZodString;
								data: z.ZodArray<z.ZodString>;
							},
							z.core.$strip
						>;
						payment_method: z.ZodObject<
							{
								type: z.ZodString;
								data: z.ZodArray<z.ZodString>;
							},
							z.core.$strip
						>;
					},
					z.core.$strip
				>;
			},
			z.core.$strip
		>
	>;
}> = genericResponse.extend({
	data: z.array(
		z.object({
			id: z.number(),
			name: z.string(),
			iso_code: z.string(),
			default_currency_code: z.string(),
			integration_defaults: z.object(),
			relationships: z.object({
				currency: z.object({
					type: z.string(),
					data: z.array(z.string()),
				}),
				integration_feature: z.object({
					type: z.string(),
					data: z.array(z.string()),
				}),
				integration_type: z.object({
					type: z.string(),
					data: z.array(z.string()),
				}),
				payment_method: z.object({
					type: z.string(),
					data: z.array(z.string()),
				}),
			}),
		}),
	),
});

export const miscellaneousListStatesInput: z.ZodObject<{
	country: z.ZodString;
}> = z.object({
	country: z.string(),
});

export const miscellaneousListStatesSuccess: z.ZodObject<{
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
				name: z.ZodString;
				slug: z.ZodString;
				abbreviation: z.ZodString;
			},
			z.core.$strip
		>
	>;
}> = genericResponse.extend({
	data: z.array(
		z.object({ name: z.string(), slug: z.string(), abbreviation: z.string() }),
	),
});

// Explicit type aliases — prevents TypeScript from inline-expanding z.infer<> in .d.ts files
export type MiscellaneousListBanksInput = z.infer<
	typeof miscellaneousListBanksInput
>;
export type MiscellaneousListBanksSuccess = z.infer<
	typeof miscellaneousListBanksSuccess
>;
export type MiscellaneousListCountriesSuccess = z.infer<
	typeof miscellaneousListCountriesSuccess
>;
export type MiscellaneousListStatesInput = z.infer<
	typeof miscellaneousListStatesInput
>;
export type MiscellaneousListStatesSuccess = z.infer<
	typeof miscellaneousListStatesSuccess
>;
