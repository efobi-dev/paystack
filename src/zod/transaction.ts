import { z } from "zod";
import {
	authorization,
	currency,
	customer,
	genericInput,
	genericResponse,
	history,
	log,
	metadata,
	plan,
	subaccount,
} from ".";
import { baseSplitSchema } from "./split";

export const txnInitializeInput = z.object({
	amount: z.string(),
	email: z.email(),
	currency: z.optional(currency),
	reference: z.string().optional(),
	callback_url: z.url().optional(),
	plan: z.string().optional(),
	invoice_limit: z.number().optional(),
	metadata: z.string().optional(),
	channels: z
		.array(
			z.enum([
				"card",
				"bank",
				"apple_pay",
				"ussd",
				"qr",
				"mobile_money",
				"bank_transfer",
				"eft",
			]),
		)
		.optional(),
	split_code: z.string().optional(),
	subaccount: z.string().optional(),
	transaction_charge: z.string().optional(),
	bearer: z.enum(["account", "subaccount"]).optional(),
});

export const txnInitializeSuccess = genericResponse.extend({
	data: z
		.object({
			authorization_url: z.url(),
			access_code: z.string(),
			reference: z.string(),
		})
		.passthrough(),
});

export const transactionShared = z
	.object({
		id: z.number(),
		domain: z.string(),
		status: z.string(),
		reference: z.string(),
		receipt_number: z.nullable(z.string()),
		amount: z.number(),
		message: z.nullable(z.string()),
		gateway_response: z.string(),
		channel: z.string(),
		currency,
		ip_address: z.string().nullable(),
		log: z.nullable(log),
		fees: z.number().nullable(),
		fees_split: z.nullable(z.unknown()),
		authorization: z.nullable(authorization),
		order_id: z.nullable(z.string()),
		paidAt: z.iso.datetime().nullable(),
		createdAt: z.iso.datetime(),
		requested_amount: z.number(),
		pos_transaction_data: z.nullable(z.unknown()),
		connect: z.nullable(z.unknown()),
	})
	.passthrough();

const transaction = transactionShared
	.extend({
		metadata: z.nullable(metadata),
		customer,
		plan: z.nullable(plan),
		split: z.nullable(baseSplitSchema),
		subaccount: z.nullable(subaccount),
		source: z.nullable(
			z.object({
				source: z.string(),
				type: z.string(),
				identifier: z.nullable(z.string()),
				entry_point: z.string(),
			}),
		),
	})
	.passthrough();

const transactionVerify = transactionShared
	.extend({
		metadata: z.string(),
		customer: customer.extend({
			metadata: z.nullable(z.string()),
			international_format_phone: z.nullable(z.string()),
		}),
		plan: z.nullable(plan),
		split: z
			.unknown()
			.transform((val) =>
				val && typeof val === "object" && Object.keys(val).length === 0
					? null
					: val,
			)
			.pipe(z.nullable(baseSplitSchema)),
		source: z.nullable(z.unknown()),
		fees_breakdown: z.nullable(z.unknown()),
		transaction_date: z.string(),
		plan_object: z.record(z.string(), z.unknown()),
		subaccount: z
			.unknown()
			.transform((val) =>
				val && typeof val === "object" && Object.keys(val).length === 0
					? null
					: val,
			)
			.pipe(z.nullable(subaccount)),
	})
	.passthrough();

export const txnVerifySuccess = genericResponse.extend({
	data: transactionVerify,
});

export const txnListInput = genericInput.extend({
	customer: z.string().optional(),
	terminalId: z.string().optional(),
	status: z.enum(["success", "failed", "abandoned"]).optional(),
	from: z.date().optional(),
});

export const txnSingleSuccess = genericResponse.extend({
	data: transaction,
});

export const txnListSuccess = genericResponse.extend({
	data: z.array(transaction),
	meta: z.object({
		next: z.nullable(z.string()),
		previous: z.nullable(z.string()),
		perPage: z.number(),
	}),
});

export const txnChargeInput = z.object({
	amount: z.number(),
	email: z.email(),
	authorization_code: z.string(),
	reference: z.string().optional(),
	currency: z.optional(currency),
	metadata: z.string().optional(),
	channels: z.array(z.enum(["card", "bank"])).optional(),
	subaccount: z.string().optional(),
	transaction_charge: z.number().optional(),
	bearer: z.enum(["account", "subaccount"]).default("account").optional(),
	queue: z.boolean().default(false).optional(),
});

export const txnChargeSuccess = genericResponse.extend({
	data: z
		.object({
			amount: z.number(),
			currency,
			transaction_date: z.iso.datetime(),
			status: z.string(),
			reference: z.string(),
			domain: z.string(),
			metadata: z.nullable(z.string()),
			gateway_response: z.string(),
			message: z.nullable(z.string()),
			channel: z.string(),
			ip_address: z.nullable(z.ipv4()),
			log: z.nullable(log),
			fees: z.number(),
			authorization,
			customer,
			plan: z.nullable(z.number()),
			id: z.number(),
		})
		.passthrough(),
});

export const txnTimelineSuccess = genericResponse.extend({
	data: z
		.object({
			start_time: z.iso.time(),
			time_spent: z.number(),
			attempts: z.number(),
			errors: z.number(),
			success: z.boolean(),
			mobile: z.boolean(),
			input: z.array(z.unknown()),
			history,
		})
		.passthrough(),
});

export const txnTotalsSuccess = genericResponse.extend({
	data: z
		.object({
			total_transactions: z.number(),
			total_volume: z.number(),
			total_volume_by_currency: z.array(
				z.object({ currency, amount: z.number() }),
			),
			pending_transfers: z.number(),
			pending_transfers_by_currency: z.array(
				z.object({ currency, amount: z.number() }),
			),
		})
		.passthrough(),
});

export const txnExportInput = genericInput.extend({
	customer: z.string().optional(),
	status: z.enum(["success", "failed", "abandoned"]).optional(),
	currency: z.optional(currency),
	amount: z.number().optional(),
	settled: z.boolean().optional(),
	settlement: z.number().optional(),
	payment_page: z.number().optional(),
});

export const txnExportSuccess = genericResponse.extend({
	data: z
		.object({
			path: z.url(),
			expiresAt: z.iso.datetime(),
		})
		.passthrough(),
});

export const txnPartialDebitInput = z.object({
	authorization_code: z.string(),
	currency: z.enum(["NGN", "GHS"]).default("NGN"),
	amount: z.number(),
	email: z.email(),
	reference: z.string().optional(),
	at_least: z.number().optional(),
});

export const txnPartialDebitSuccess = genericResponse.extend({
	data: txnChargeSuccess.shape.data
		.extend({
			requested_amount: z.number(),
		})
		.passthrough(),
});
