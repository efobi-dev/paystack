import { z } from "zod";
import {
	authorization,
	currency,
	customer,
	log,
	metadata,
	plan,
	subaccount,
} from ".";
import { transactionShared } from "./transaction";
import {
	virtualAccountAssignmentSchema,
	virtualAccountBaseSchema,
} from "./virtual";

const disputeTransactionSchema = z
	.object({
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
		metadata: z.string(),
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
	})
	.passthrough();

const disputeDataSchema = z
	.object({
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
	})
	.passthrough();

const invoiceSubscriptionSchema = z
	.object({
		status: z.string(),
		subscription_code: z.string().startsWith("SUB_"),
		email_token: z.string(),
		amount: z.number(),
		cron_expression: z.string(),
		next_payment_date: z.iso.datetime(),
		open_invoice: z.unknown().nullable(),
	})
	.passthrough();

const invoiceSuccessTransactionSchema = z
	.object({
		reference: z.uuid(),
		status: z.string(),
		amount: z.number(),
		currency,
	})
	.passthrough();

const invoiceDataBaseSchema = z
	.object({
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
	})
	.passthrough();

const paymentRequestDataSchema = z
	.object({
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
		metadata: z.nullable(metadata),
		notifications: z.array(
			z.object({
				sent_at: z.iso.datetime(),
				channel: z.string(),
			}),
		),
		offline_reference: z.string().nullable(),
		customer: z.number(),
		created_at: z.iso.datetime(),
	})
	.passthrough();

const refundDataBaseSchema = z
	.object({
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
	})
	.passthrough();

const refundPendingOrProcessingDataSchema = refundDataBaseSchema
	.extend({
		refund_reference: z.string().startsWith("TRF_").nullable(),
	})
	.passthrough();

const refundFailedOrProcessedDataSchema = refundDataBaseSchema
	.extend({
		refund_reference: z.string().startsWith("TRF_"),
	})
	.passthrough();

const subscriptionCoreDataSchema = z
	.object({
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
	})
	.passthrough();

const transferDataBaseSchema = z
	.object({
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
		created_at: z.iso.datetime(),
		updated_at: z.iso.datetime(),
	})
	.passthrough();

const baseRecipientSchema = z
	.object({
		active: z.boolean(),
		currency,
		description: z.string(),
		domain: z.string(),
		email: z.email().nullable(),
		id: z.number(),
		integration: z.number(),
		metadata: z.nullable(metadata),
		name: z.string(),
		recipient_code: z.string().startsWith("RCP_"),
		type: z.string(),
		is_deleted: z.boolean(),
		created_at: z.iso.datetime(),
		updated_at: z.iso.datetime(),
	})
	.passthrough();

const transferSuccessRecipientSchema = baseRecipientSchema
	.extend({
		details: z.object({
			account_number: z.string(),
			account_name: z.string().nullable(),
			bank_code: z.string(),
			bank_name: z.string(),
		}),
	})
	.passthrough();

const transferFailedOrReversedRecipientSchema = baseRecipientSchema
	.extend({
		details: z.object({
			account_number: z.string(),
			account_name: z.string().nullable(),
			bank_code: z.string(),
			bank_name: z.string(),
			authorization_code: z.string().startsWith("AUTH_").nullable(),
		}),
	})
	.passthrough();

const identificationBaseSchema = z
	.object({
		country: z.enum(["NG", "GH"]),
		type: z.string(),
	})
	.passthrough();

const customerDataBaseSchema = z
	.object({
		customer_id: z.string(),
		customer_code: z.string().startsWith("CUS_"),
		email: z.email(),
	})
	.passthrough();

export const customerIdFail = z
	.object({
		event: z.literal("customeridentification.failed"),
		data: customerDataBaseSchema.extend({
			identification: identificationBaseSchema.extend({
				bvn: z.string(),
				account_number: z.string(),
				bank_code: z.string(),
			}),
		}),
		reason: z.string(),
	})
	.passthrough();

export const customerIdSuccess = z
	.object({
		event: z.literal("customeridentification.success"),
		data: customerDataBaseSchema.extend({
			identification: identificationBaseSchema.extend({
				value: z.string(),
			}),
		}),
	})
	.passthrough();

export const disputeCreated = z
	.object({
		event: z.literal("charge.dispute.create"),
		data: disputeDataSchema,
	})
	.passthrough();

export const disputeReminder = z
	.object({
		event: z.literal("charge.dispute.remind"),
		data: disputeDataSchema,
	})
	.passthrough();

export const disputeResolved = z
	.object({
		event: z.literal("charge.dispute.resolve"),
		data: disputeDataSchema,
	})
	.passthrough();

export const dedicatedAccountAssignFail = z
	.object({
		event: z.literal("dedicatedaccount.assign.failed"),
		data: z.object({
			customer,
			dedicated_account: z.unknown().nullable(),
			identification: z.object({
				status: z.string(),
			}),
		}),
	})
	.passthrough();

export const dedicatedAccountAssignSuccess = z
	.object({
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
	})
	.passthrough();

export const invoiceCreate = z
	.object({
		event: z.literal("invoice.create"),
		data: invoiceDataBaseSchema.extend({
			transaction: invoiceSuccessTransactionSchema,
			created_at: z.iso.datetime(),
		}),
	})
	.passthrough();

export const invoiceFail = z
	.object({
		event: z.literal("invoice.payment_failed"),
		data: invoiceDataBaseSchema.extend({
			transaction: invoiceSuccessTransactionSchema.partial(),
			created_at: z.iso.datetime(),
		}),
	})
	.passthrough();

export const invoiceUpdate = z
	.object({
		event: z.literal("invoice.update"),
		data: invoiceDataBaseSchema.extend({
			transaction: invoiceSuccessTransactionSchema,
		}),
	})
	.passthrough();

export const paymentRequestPending = z
	.object({
		event: z.literal("paymentrequest.pending"),
		data: paymentRequestDataSchema,
	})
	.passthrough();

export const paymentRequestSuccess = z
	.object({
		event: z.literal("paymentrequest.success"),
		data: paymentRequestDataSchema,
	})
	.passthrough();

export const refundFailed = z
	.object({
		event: z.literal("refund.failed"),
		data: refundFailedOrProcessedDataSchema,
	})
	.passthrough();

export const refundPending = z
	.object({
		event: z.literal("refund.pending"),
		data: refundPendingOrProcessingDataSchema,
	})
	.passthrough();

export const refundProcessed = z
	.object({
		event: z.literal("refund.processed"),
		data: refundFailedOrProcessedDataSchema,
	})
	.passthrough();

export const refundProcessing = z
	.object({
		event: z.literal("refund.processing"),
		data: refundPendingOrProcessingDataSchema,
	})
	.passthrough();

export const subscriptionCreate = z
	.object({
		event: z.literal("subscription.create"),
		data: subscriptionCoreDataSchema.extend({
			createdAt: z.iso.datetime(),
		}),
	})
	.passthrough();

export const subscriptionDisabled = z
	.object({
		event: z.literal("subscription.disable"),
		data: subscriptionCoreDataSchema.extend({
			email_token: z.string(),
		}),
	})
	.passthrough();

export const subscriptionNotRenewed = z
	.object({
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
	})
	.passthrough();

export const subscriptionWithExpiredCard = z
	.object({
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
	})
	.passthrough();

export const transactionSuccessful = z
	.object({
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
					}),
				metadata: metadata,
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
	})
	.passthrough();

export const transferSuccess = z
	.object({
		event: z.literal("transfer.success"),
		data: transferDataBaseSchema.extend({
			recipient: transferSuccessRecipientSchema,
		}),
	})
	.passthrough();

export const transferFailed = z
	.object({
		event: z.literal("transfer.failed"),
		data: transferDataBaseSchema.extend({
			recipient: transferFailedOrReversedRecipientSchema,
		}),
	})
	.passthrough();

export const transferReversed = z
	.object({
		event: z.literal("transfer.reversed"),
		data: transferDataBaseSchema.extend({
			recipient: transferFailedOrReversedRecipientSchema,
		}),
	})
	.passthrough();

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
