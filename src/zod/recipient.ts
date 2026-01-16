import { z } from "zod";
import { currency, genericResponse } from ".";

export const recipientCreateInput = z.object({
	type: z.enum(["nuban", "ghipss", "mobile_money"]),
	name: z.string(),
	account_number: z.string(),
	bank_code: z.string(),
	description: z.string().optional(),
	currency: currency.optional(),
	authorization_code: z.string().optional(),
	metadata: z.any().optional(),
});

export const recipientCreateSuccess = genericResponse.extend({
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

export const recipientBulkCreateInput = z.object({
	batch: z.array(recipientCreateInput),
});

export const recipientBulkCreateSuccess = genericResponse.extend({
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

export const recipientListSuccess = genericResponse.extend({
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

export const recipientSingleSuccess = genericResponse.extend({
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

export const recipientUpdateInput = z.object({
	id_or_code: z.string(),
	name: z.string(),
	email: z.email().optional(),
});
