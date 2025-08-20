import { z } from "zod";
import { currency, genericInput, genericResponse, metadata } from ".";

export const transferInitiateInput = z.object({
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
	created_at: z.iso.datetime(),
	updated_at: z.iso.datetime(),
});

export const transferInitiateSuccess = genericResponse.extend({
	data: transfer.extend({
		transfersessionid: z.array(z.unknown()),
		transfertrials: z.array(z.unknown()),
	}),
});

export const transferError = genericResponse.extend({
	meta: z.object({
		nextStep: z.string(),
	}),
	type: z.string(),
	code: z.string(),
});

export const transferFinalizeInput = z.object({
	transfer_code: z.string().startsWith("TRF_"),
	otp: z.string(),
});

export const transferFinalizeSuccess = genericResponse.extend({
	data: transfer.extend({
		source_details: z.unknown().nullable(),
	}),
});

export const transferBulkInitiateInput = z.object({
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

export const transferBulkInitiateSuccess = genericResponse.extend({
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

export const transferListInput = genericInput.extend({
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
	metadata: metadata.nullable(),
	recipient_code: z.string().startsWith("RCP_"),
	active: z.boolean(),
	id: z.number(),
	integration: z.number(),
	created_at: z.iso.datetime().optional(),
	updated_at: z.iso.datetime().optional(),
});

export const transferListSuccess = genericResponse.extend({
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
	metadata: metadata
		.extend({
			custom_fields: z.array(
				z.object({
					display_name: z.string(),
					variable_name: z.string(),
					value: z.string(),
				}),
			),
		})
		.nullable()
		.optional(),
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

export const transferSingleSuccess = genericResponse.extend({
	data: transferDetails,
});
