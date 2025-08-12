import { z } from "zod";
import { currency, genericResponse } from ".";

export const miscellaneousListBanksInput = z.object({
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

export const miscellaneousListBanksSuccess = genericResponse.extend({
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

export const miscellaneousListCountriesSuccess = genericResponse.extend({
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

export const miscellaneousListStatesInput = z.object({
	country: z.string(),
});

export const miscellaneousListStatesSuccess = genericResponse.extend({
	data: z.array(
		z.object({ name: z.string(), slug: z.string(), abbreviation: z.string() }),
	),
});
