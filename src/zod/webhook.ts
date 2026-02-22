import { z } from "zod";
import { authorization, currency, customer, log, plan, subaccount } from ".";
import { transactionShared } from "./transaction";
import {
	virtualAccountAssignmentSchema,
	virtualAccountBaseSchema,
} from "./virtual";

const disputeTransactionSchema = z.object({
	id: z.number(),
	domain: z.string(),
	status: z.string(),
	reference: z.string(),
	amount: z.number(),
	message: z.string().nullable(),
	gateway_response: z.string(),
	paid_at: z.iso.datetime(),
	created_at: z.iso.datetime(),
	channel: z.string(),
	currency,
	ip_address: z.ipv4().nullable(),
	metadata: z.any(),
	log: z.nullable(log),
	fees: z.number(),
	fees_split: z.unknown().nullable(),
	authorization: authorization.optional(),
	customer: customer.pick({
		international_format_phone: true,
	}),
	plan,
	subaccount: subaccount.optional(),
	split: z.object().optional(),
	order_id: z.string().nullable(),
	paidAt: z.iso.datetime(),
	requested_amount: z.number(),
	pos_transaction_data: z.unknown().nullable(),
});

const disputeDataSchema = z.object({
	id: z.number(),
	refund_amount: z.number(),
	currency,
	status: z.string(),
	resolution: z.unknown().nullable(),
	domain: z.string(),
	transaction: disputeTransactionSchema,
	transaction_reference: z.string().nullable(),
	category: z.string(),
	customer,
	bin: z.string(),
	last4: z.string(),
	dueAt: z.iso.datetime(),
	resolvedAt: z.iso.datetime().nullable(),
	evidence: z.unknown().nullable(),
	attachments: z.unknown().nullable(),
	note: z.unknown().nullable(),
	history: z.array(
		z.object({
			status: z.string(),
			by: z.email(),
			created_at: z.iso.datetime(),
		}),
	),
	messages: z.array(
		z.object({
			sender: z.email(),
			body: z.string(),
			created_at: z.iso.datetime(),
		}),
	),
	created_at: z.iso.datetime(),
	updated_at: z.iso.datetime(),
});

const invoiceSubscriptionSchema = z.object({
	status: z.string(),
	subscription_code: z.string().startsWith("SUB_"),
	email_token: z.string(),
	amount: z.number(),
	cron_expression: z.string(),
	next_payment_date: z.iso.datetime(),
	open_invoice: z.unknown().nullable(),
});

const invoiceSuccessTransactionSchema = z.object({
	reference: z.uuid(),
	status: z.string(),
	amount: z.number(),
	currency,
});

const invoiceDataBaseSchema = z.object({
	domain: z.string(),
	invoice_code: z.string().startsWith("INV_"),
	amount: z.number(),
	period_start: z.iso.datetime(),
	period_end: z.iso.datetime(),
	status: z.string(),
	paid: z.boolean(),
	paid_at: z.iso.datetime().nullable(),
	description: z.string().nullable(),
	authorization,
	subscription: invoiceSubscriptionSchema,
	customer: customer.omit({
		international_format_phone: true,
	}),
});

const paymentRequestDataSchema = z.object({
	id: z.number(),
	domain: z.string(),
	amount: z.number(),
	currency,
	due_date: z.iso.datetime().nullable(),
	has_invoice: z.boolean(),
	invoice_number: z.string().nullable(),
	description: z.string().nullable(),
	pdf_url: z.url().nullable(),
	line_items: z.array(z.unknown()),
	tax: z.array(z.unknown()),
	request_code: z.string().startsWith("PRQ_"),
	status: z.string(),
	paid: z.boolean(),
	paid_at: z.iso.datetime().nullable(),
	metadata: z.nullable(z.any()),
	notifications: z.array(
		z.object({
			sent_at: z.iso.datetime(),
			channel: z.string(),
		}),
	),
	offline_reference: z.string().nullable(),
	customer: z.number(),
	created_at: z.iso.datetime(),
});

const refundDataBaseSchema = z.object({
	status: z.string(),
	transaction_reference: z.string(),
	amount: z.number(),
	currency,
	processor: z.string(),
	customer: customer.pick({
		first_name: true,
		last_name: true,
		email: true,
	}),
	integration: z.number(),
	domain: z.string(),
});

const refundPendingOrProcessingDataSchema = refundDataBaseSchema.extend({
	refund_reference: z.string().startsWith("TRF_").nullable(),
});

const refundFailedOrProcessedDataSchema = refundDataBaseSchema.extend({
	refund_reference: z.string().startsWith("TRF_"),
});

const subscriptionCoreDataSchema = z.object({
	domain: z.string(),
	status: z.string(),
	subscription_code: z.string().startsWith("SUB_"),
	amount: z.number(),
	cron_expression: z.string(),
	next_payment_date: z.iso.datetime(),
	open_invoice: z.unknown().nullable(),
	plan,
	authorization: authorization.omit({
		reusable: true,
		signature: true,
	}),
	customer: customer.omit({
		international_format_phone: true,
		id: true,
	}),
	created_at: z.iso.datetime(),
});

const transferDataBaseSchema = z.object({
	amount: z.number(),
	currency,
	domain: z.string(),
	failures: z.unknown().nullable(),
	id: z.number(),
	integration: z.object({
		id: z.number(),
		is_live: z.boolean(),
		business_name: z.string(),
	}),
	reason: z.string(),
	reference: z.string(),
	source: z.string(),
	source_details: z.unknown().nullable(),
	status: z.string(),
	titan_code: z.string().nullable(),
	transfer_code: z.string().startsWith("TRF_"),
	transferred_at: z.iso.datetime().nullable(),
	session: z.object({
		provider: z.string().nullable(),
		id: z.string().nullable(),
	}),
	created_at: z.iso.datetime().optional(),
	updated_at: z.iso.datetime().optional(),
});

const baseRecipientSchema = z.object({
	active: z.boolean(),
	currency,
	description: z.string().nullable(),
	domain: z.string(),
	email: z.email().nullable(),
	id: z.number(),
	integration: z.number(),
	metadata: z.nullable(z.any()),
	name: z.string(),
	recipient_code: z.string().startsWith("RCP_"),
	type: z.string(),
	is_deleted: z.boolean(),
	created_at: z.iso.datetime().optional(),
	updated_at: z.iso.datetime().optional(),
});

const transferSuccessRecipientSchema = baseRecipientSchema.extend({
	details: z.object({
		account_number: z.string(),
		account_name: z.string().nullable(),
		bank_code: z.string(),
		bank_name: z.string(),
	}),
});

const transferFailedOrReversedRecipientSchema = baseRecipientSchema.extend({
	details: z.object({
		account_number: z.string(),
		account_name: z.string().nullable(),
		bank_code: z.string(),
		bank_name: z.string(),
		authorization_code: z.string().startsWith("AUTH_").nullable(),
	}),
});

const identificationBaseSchema = z.object({
	country: z.enum(["NG", "GH"]),
	type: z.string(),
});

const customerDataBaseSchema = z.object({
	customer_id: z.string(),
	customer_code: z.string().startsWith("CUS_"),
	email: z.email(),
});

export const customerIdFail = z.object({
	event: z.literal("customeridentification.failed"),
	data: customerDataBaseSchema.extend({
		identification: identificationBaseSchema.extend({
			bvn: z.string(),
			account_number: z.string(),
			bank_code: z.string(),
		}),
	}),
	reason: z.string(),
});

export const customerIdSuccess = z.object({
	event: z.literal("customeridentification.success"),
	data: customerDataBaseSchema.extend({
		identification: identificationBaseSchema.extend({
			value: z.string(),
		}),
	}),
});

export const disputeCreated = z.object({
	event: z.literal("charge.dispute.create"),
	data: disputeDataSchema,
});

export const disputeReminder = z.object({
	event: z.literal("charge.dispute.remind"),
	data: disputeDataSchema,
});

export const disputeResolved = z.object({
	event: z.literal("charge.dispute.resolve"),
	data: disputeDataSchema,
});

export const dedicatedAccountAssignFail = z.object({
	event: z.literal("dedicatedaccount.assign.failed"),
	data: z.object({
		customer,
		dedicated_account: z.unknown().nullable(),
		identification: z.object({
			status: z.string(),
		}),
	}),
});

export const dedicatedAccountAssignSuccess = z.object({
	event: z.literal("dedicatedaccount.assign.success"),
	data: z.object({
		customer,
		dedicated_account: virtualAccountBaseSchema,
		assignment: virtualAccountAssignmentSchema.extend({
			expired_at: z.iso.datetime().nullable(),
		}),
	}),
	identification: z.object({
		status: z.string(),
	}),
});

export const invoiceCreate = z.object({
	event: z.literal("invoice.create"),
	data: invoiceDataBaseSchema.extend({
		transaction: invoiceSuccessTransactionSchema,
		created_at: z.iso.datetime(),
	}),
});

export const invoiceFail = z.object({
	event: z.literal("invoice.payment_failed"),
	data: invoiceDataBaseSchema.extend({
		transaction: invoiceSuccessTransactionSchema.partial(),
		created_at: z.iso.datetime(),
	}),
});

export const invoiceUpdate = z.object({
	event: z.literal("invoice.update"),
	data: invoiceDataBaseSchema.extend({
		transaction: invoiceSuccessTransactionSchema,
	}),
});

export const paymentRequestPending = z.object({
	event: z.literal("paymentrequest.pending"),
	data: paymentRequestDataSchema,
});

export const paymentRequestSuccess = z.object({
	event: z.literal("paymentrequest.success"),
	data: paymentRequestDataSchema,
});

export const refundFailed = z.object({
	event: z.literal("refund.failed"),
	data: refundFailedOrProcessedDataSchema,
});

export const refundPending = z.object({
	event: z.literal("refund.pending"),
	data: refundPendingOrProcessingDataSchema,
});

export const refundProcessed = z.object({
	event: z.literal("refund.processed"),
	data: refundFailedOrProcessedDataSchema,
});

export const refundProcessing = z.object({
	event: z.literal("refund.processing"),
	data: refundPendingOrProcessingDataSchema,
});

export const subscriptionCreate = z.object({
	event: z.literal("subscription.create"),
	data: subscriptionCoreDataSchema.extend({
		createdAt: z.iso.datetime(),
	}),
});

export const subscriptionDisabled = z.object({
	event: z.literal("subscription.disable"),
	data: subscriptionCoreDataSchema.extend({
		email_token: z.string(),
	}),
});

export const subscriptionNotRenewed = z.object({
	event: z.literal("subscription.not_renew"),
	data: z.object({
		id: z.number(),
		domain: z.string(),
		status: z.string(),
		subscription_code: z.string().startsWith("SUB_"),
		email_token: z.string(),
		amount: z.number(),
		cron_expression: z.string(),
		next_payment_date: z.iso.datetime(),
		open_invoice: z.unknown().nullable(),
		integration: z.number(),
		plan,
		authorization: authorization.omit({
			reusable: true,
			signature: true,
		}),
		customer,
		invoices: z.array(z.unknown()),
		invoices_history: z.array(z.unknown()),
		invoice_limit: z.number(),
		split_code: z.string().nullable(),
		most_recent_invoice: z.unknown().nullable(),
		created_at: z.iso.datetime(),
	}),
});

export const subscriptionWithExpiredCard = z.object({
	event: z.literal("subscription.expiring_cards"),
	data: z.array(
		z.object({
			expiry_date: z.iso.datetime(),
			description: z.string(),
			brand: z.enum(["visa", "mastercard", "verve"]),
			subscription: z.object({
				id: z.number(),
				subscription_code: z.string().startsWith("SUB_"),
				amount: z.number(),
				next_payment_date: z.iso.datetime(),
				plan: plan.pick({
					interval: true,
					id: true,
					name: true,
					plan_code: true,
				}),
			}),
			customer: customer.pick({
				id: true,
				first_name: true,
				last_name: true,
				email: true,
				customer_code: true,
			}),
		}),
	),
});

export const transactionSuccessful = z.object({
	event: z.literal("charge.success"),
	data: transactionShared
		.omit({
			receipt_number: true,
			paidAt: true,
			createdAt: true,
		})
		.extend({
			log: log
				.omit({
					start_time: true,
				})
				.extend({
					authentication: z.string(),
				})
				.nullable(),
			metadata: z.any(),
			paid_at: z.iso.datetime(),
			created_at: z.iso.datetime(),
			fees: z.number().nullable(),
			customer: customer.omit({
				international_format_phone: true,
				id: true,
			}),
			authorization: authorization.omit({
				signature: true,
				reusable: true,
			}),
		}),
});

export const transferSuccess = z.object({
	event: z.literal("transfer.success"),
	data: transferDataBaseSchema.extend({
		recipient: transferSuccessRecipientSchema,
	}),
});

export const transferFailed = z.object({
	event: z.literal("transfer.failed"),
	data: transferDataBaseSchema.extend({
		recipient: transferFailedOrReversedRecipientSchema,
	}),
});

export const transferReversed = z.object({
	event: z.literal("transfer.reversed"),
	data: transferDataBaseSchema.extend({
		recipient: transferFailedOrReversedRecipientSchema,
	}),
});

export const paystackWebhookSchema = z.discriminatedUnion("event", [
	customerIdFail,
	customerIdSuccess,
	disputeCreated,
	disputeReminder,
	disputeResolved,
	dedicatedAccountAssignFail,
	dedicatedAccountAssignSuccess,
	invoiceCreate,
	invoiceFail,
	invoiceUpdate,
	paymentRequestPending,
	paymentRequestSuccess,
	refundFailed,
	refundPending,
	refundProcessed,
	refundProcessing,
	subscriptionCreate,
	subscriptionDisabled,
	subscriptionNotRenewed,
	subscriptionWithExpiredCard,
	transactionSuccessful,
	transferSuccess,
	transferFailed,
	transferReversed,
]);

export type PaystackWebhookPayload = z.infer<typeof paystackWebhookSchema>;

export type PaystackWebhookEvents = PaystackWebhookPayload["event"];

// Per-event data aliases — consumers can use these for type-safe handler arguments
export type CustomerIdFailData = z.infer<typeof customerIdFail>["data"];
export type CustomerIdSuccessData = z.infer<typeof customerIdSuccess>["data"];
export type DisputeCreatedData = z.infer<typeof disputeCreated>["data"];
export type DisputeReminderData = z.infer<typeof disputeReminder>["data"];
export type DisputeResolvedData = z.infer<typeof disputeResolved>["data"];
export type DedicatedAccountAssignFailData = z.infer<
	typeof dedicatedAccountAssignFail
>["data"];
export type DedicatedAccountAssignSuccessData = z.infer<
	typeof dedicatedAccountAssignSuccess
>["data"];
export type InvoiceCreateData = z.infer<typeof invoiceCreate>["data"];
export type InvoiceFailData = z.infer<typeof invoiceFail>["data"];
export type InvoiceUpdateData = z.infer<typeof invoiceUpdate>["data"];
export type PaymentRequestPendingData = z.infer<
	typeof paymentRequestPending
>["data"];
export type PaymentRequestSuccessData = z.infer<
	typeof paymentRequestSuccess
>["data"];
export type RefundFailedData = z.infer<typeof refundFailed>["data"];
export type RefundPendingData = z.infer<typeof refundPending>["data"];
export type RefundProcessedData = z.infer<typeof refundProcessed>["data"];
export type RefundProcessingData = z.infer<typeof refundProcessing>["data"];
export type SubscriptionCreateData = z.infer<typeof subscriptionCreate>["data"];
export type SubscriptionDisabledData = z.infer<
	typeof subscriptionDisabled
>["data"];
export type SubscriptionNotRenewedData = z.infer<
	typeof subscriptionNotRenewed
>["data"];
export type SubscriptionWithExpiredCardData = z.infer<
	typeof subscriptionWithExpiredCard
>["data"];
export type TransactionSuccessfulData = z.infer<
	typeof transactionSuccessful
>["data"];
export type TransferSuccessData = z.infer<typeof transferSuccess>["data"];
export type TransferFailedData = z.infer<typeof transferFailed>["data"];
export type TransferReversedData = z.infer<typeof transferReversed>["data"];
