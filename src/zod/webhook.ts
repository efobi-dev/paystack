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

export const customerIdFail: z.ZodObject<{
	event: z.ZodLiteral<"customeridentification.failed">;
	data: z.ZodObject<
		{
			customer_id: z.ZodString;
			customer_code: z.ZodString;
			email: z.ZodEmail;
			identification: z.ZodObject<
				{
					country: z.ZodEnum<{
						NG: "NG";
						GH: "GH";
					}>;
					type: z.ZodString;
					bvn: z.ZodString;
					account_number: z.ZodString;
					bank_code: z.ZodString;
				},
				z.core.$strip
			>;
		},
		z.core.$strip
	>;
	reason: z.ZodString;
}> = z.object({
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

export const customerIdSuccess: z.ZodObject<{
	event: z.ZodLiteral<"customeridentification.success">;
	data: z.ZodObject<
		{
			customer_id: z.ZodString;
			customer_code: z.ZodString;
			email: z.ZodEmail;
			identification: z.ZodObject<
				{
					country: z.ZodEnum<{
						NG: "NG";
						GH: "GH";
					}>;
					type: z.ZodString;
					value: z.ZodString;
				},
				z.core.$strip
			>;
		},
		z.core.$strip
	>;
}> = z.object({
	event: z.literal("customeridentification.success"),
	data: customerDataBaseSchema.extend({
		identification: identificationBaseSchema.extend({
			value: z.string(),
		}),
	}),
});

export const disputeCreated: z.ZodObject<{
	event: z.ZodLiteral<"charge.dispute.create">;
	data: z.ZodObject<
		{
			id: z.ZodNumber;
			refund_amount: z.ZodNumber;
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
			resolution: z.ZodNullable<z.ZodUnknown>;
			domain: z.ZodString;
			transaction: z.ZodObject<
				{
					id: z.ZodNumber;
					domain: z.ZodString;
					status: z.ZodString;
					reference: z.ZodString;
					amount: z.ZodNumber;
					message: z.ZodNullable<z.ZodString>;
					gateway_response: z.ZodString;
					paid_at: z.ZodISODateTime;
					created_at: z.ZodISODateTime;
					channel: z.ZodString;
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
					ip_address: z.ZodNullable<z.ZodIPv4>;
					metadata: z.ZodAny;
					log: z.ZodNullable<
						z.ZodObject<
							{
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
							},
							z.core.$strip
						>
					>;
					fees: z.ZodNumber;
					fees_split: z.ZodNullable<z.ZodUnknown>;
					authorization: z.ZodOptional<
						z.ZodObject<
							{
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
							},
							z.core.$strip
						>
					>;
					customer: z.ZodObject<
						{
							international_format_phone: z.ZodNullable<z.ZodString>;
						},
						z.core.$strip
					>;
					plan: z.ZodObject<
						{
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
						},
						z.core.$strip
					>;
					subaccount: z.ZodOptional<
						z.ZodObject<
							{
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
							},
							z.core.$strip
						>
					>;
					split: z.ZodOptional<z.ZodObject<{}, z.core.$strip>>;
					order_id: z.ZodNullable<z.ZodString>;
					paidAt: z.ZodISODateTime;
					requested_amount: z.ZodNumber;
					pos_transaction_data: z.ZodNullable<z.ZodUnknown>;
				},
				z.core.$strip
			>;
			transaction_reference: z.ZodNullable<z.ZodString>;
			category: z.ZodString;
			customer: z.ZodObject<
				{
					id: z.ZodNumber;
					first_name: z.ZodNullable<z.ZodString>;
					last_name: z.ZodNullable<z.ZodString>;
					email: z.ZodEmail;
					phone: z.ZodNullable<z.ZodString>;
					metadata: z.ZodNullable<z.ZodAny>;
					customer_code: z.ZodString;
					risk_action: z.ZodString;
					international_format_phone: z.ZodNullable<z.ZodString>;
				},
				z.core.$strip
			>;
			bin: z.ZodString;
			last4: z.ZodString;
			dueAt: z.ZodISODateTime;
			resolvedAt: z.ZodNullable<z.ZodISODateTime>;
			evidence: z.ZodNullable<z.ZodUnknown>;
			attachments: z.ZodNullable<z.ZodUnknown>;
			note: z.ZodNullable<z.ZodUnknown>;
			history: z.ZodArray<
				z.ZodObject<
					{
						status: z.ZodString;
						by: z.ZodEmail;
						created_at: z.ZodISODateTime;
					},
					z.core.$strip
				>
			>;
			messages: z.ZodArray<
				z.ZodObject<
					{
						sender: z.ZodEmail;
						body: z.ZodString;
						created_at: z.ZodISODateTime;
					},
					z.core.$strip
				>
			>;
			created_at: z.ZodISODateTime;
			updated_at: z.ZodISODateTime;
		},
		z.core.$strip
	>;
}> = z.object({
	event: z.literal("charge.dispute.create"),
	data: disputeDataSchema,
});

export const disputeReminder: z.ZodObject<{
	event: z.ZodLiteral<"charge.dispute.remind">;
	data: z.ZodObject<
		{
			id: z.ZodNumber;
			refund_amount: z.ZodNumber;
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
			resolution: z.ZodNullable<z.ZodUnknown>;
			domain: z.ZodString;
			transaction: z.ZodObject<
				{
					id: z.ZodNumber;
					domain: z.ZodString;
					status: z.ZodString;
					reference: z.ZodString;
					amount: z.ZodNumber;
					message: z.ZodNullable<z.ZodString>;
					gateway_response: z.ZodString;
					paid_at: z.ZodISODateTime;
					created_at: z.ZodISODateTime;
					channel: z.ZodString;
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
					ip_address: z.ZodNullable<z.ZodIPv4>;
					metadata: z.ZodAny;
					log: z.ZodNullable<
						z.ZodObject<
							{
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
							},
							z.core.$strip
						>
					>;
					fees: z.ZodNumber;
					fees_split: z.ZodNullable<z.ZodUnknown>;
					authorization: z.ZodOptional<
						z.ZodObject<
							{
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
							},
							z.core.$strip
						>
					>;
					customer: z.ZodObject<
						{
							international_format_phone: z.ZodNullable<z.ZodString>;
						},
						z.core.$strip
					>;
					plan: z.ZodObject<
						{
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
						},
						z.core.$strip
					>;
					subaccount: z.ZodOptional<
						z.ZodObject<
							{
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
							},
							z.core.$strip
						>
					>;
					split: z.ZodOptional<z.ZodObject<{}, z.core.$strip>>;
					order_id: z.ZodNullable<z.ZodString>;
					paidAt: z.ZodISODateTime;
					requested_amount: z.ZodNumber;
					pos_transaction_data: z.ZodNullable<z.ZodUnknown>;
				},
				z.core.$strip
			>;
			transaction_reference: z.ZodNullable<z.ZodString>;
			category: z.ZodString;
			customer: z.ZodObject<
				{
					id: z.ZodNumber;
					first_name: z.ZodNullable<z.ZodString>;
					last_name: z.ZodNullable<z.ZodString>;
					email: z.ZodEmail;
					phone: z.ZodNullable<z.ZodString>;
					metadata: z.ZodNullable<z.ZodAny>;
					customer_code: z.ZodString;
					risk_action: z.ZodString;
					international_format_phone: z.ZodNullable<z.ZodString>;
				},
				z.core.$strip
			>;
			bin: z.ZodString;
			last4: z.ZodString;
			dueAt: z.ZodISODateTime;
			resolvedAt: z.ZodNullable<z.ZodISODateTime>;
			evidence: z.ZodNullable<z.ZodUnknown>;
			attachments: z.ZodNullable<z.ZodUnknown>;
			note: z.ZodNullable<z.ZodUnknown>;
			history: z.ZodArray<
				z.ZodObject<
					{
						status: z.ZodString;
						by: z.ZodEmail;
						created_at: z.ZodISODateTime;
					},
					z.core.$strip
				>
			>;
			messages: z.ZodArray<
				z.ZodObject<
					{
						sender: z.ZodEmail;
						body: z.ZodString;
						created_at: z.ZodISODateTime;
					},
					z.core.$strip
				>
			>;
			created_at: z.ZodISODateTime;
			updated_at: z.ZodISODateTime;
		},
		z.core.$strip
	>;
}> = z.object({
	event: z.literal("charge.dispute.remind"),
	data: disputeDataSchema,
});

export const disputeResolved: z.ZodObject<{
	event: z.ZodLiteral<"charge.dispute.resolve">;
	data: z.ZodObject<
		{
			id: z.ZodNumber;
			refund_amount: z.ZodNumber;
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
			resolution: z.ZodNullable<z.ZodUnknown>;
			domain: z.ZodString;
			transaction: z.ZodObject<
				{
					id: z.ZodNumber;
					domain: z.ZodString;
					status: z.ZodString;
					reference: z.ZodString;
					amount: z.ZodNumber;
					message: z.ZodNullable<z.ZodString>;
					gateway_response: z.ZodString;
					paid_at: z.ZodISODateTime;
					created_at: z.ZodISODateTime;
					channel: z.ZodString;
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
					ip_address: z.ZodNullable<z.ZodIPv4>;
					metadata: z.ZodAny;
					log: z.ZodNullable<
						z.ZodObject<
							{
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
							},
							z.core.$strip
						>
					>;
					fees: z.ZodNumber;
					fees_split: z.ZodNullable<z.ZodUnknown>;
					authorization: z.ZodOptional<
						z.ZodObject<
							{
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
							},
							z.core.$strip
						>
					>;
					customer: z.ZodObject<
						{
							international_format_phone: z.ZodNullable<z.ZodString>;
						},
						z.core.$strip
					>;
					plan: z.ZodObject<
						{
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
						},
						z.core.$strip
					>;
					subaccount: z.ZodOptional<
						z.ZodObject<
							{
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
							},
							z.core.$strip
						>
					>;
					split: z.ZodOptional<z.ZodObject<{}, z.core.$strip>>;
					order_id: z.ZodNullable<z.ZodString>;
					paidAt: z.ZodISODateTime;
					requested_amount: z.ZodNumber;
					pos_transaction_data: z.ZodNullable<z.ZodUnknown>;
				},
				z.core.$strip
			>;
			transaction_reference: z.ZodNullable<z.ZodString>;
			category: z.ZodString;
			customer: z.ZodObject<
				{
					id: z.ZodNumber;
					first_name: z.ZodNullable<z.ZodString>;
					last_name: z.ZodNullable<z.ZodString>;
					email: z.ZodEmail;
					phone: z.ZodNullable<z.ZodString>;
					metadata: z.ZodNullable<z.ZodAny>;
					customer_code: z.ZodString;
					risk_action: z.ZodString;
					international_format_phone: z.ZodNullable<z.ZodString>;
				},
				z.core.$strip
			>;
			bin: z.ZodString;
			last4: z.ZodString;
			dueAt: z.ZodISODateTime;
			resolvedAt: z.ZodNullable<z.ZodISODateTime>;
			evidence: z.ZodNullable<z.ZodUnknown>;
			attachments: z.ZodNullable<z.ZodUnknown>;
			note: z.ZodNullable<z.ZodUnknown>;
			history: z.ZodArray<
				z.ZodObject<
					{
						status: z.ZodString;
						by: z.ZodEmail;
						created_at: z.ZodISODateTime;
					},
					z.core.$strip
				>
			>;
			messages: z.ZodArray<
				z.ZodObject<
					{
						sender: z.ZodEmail;
						body: z.ZodString;
						created_at: z.ZodISODateTime;
					},
					z.core.$strip
				>
			>;
			created_at: z.ZodISODateTime;
			updated_at: z.ZodISODateTime;
		},
		z.core.$strip
	>;
}> = z.object({
	event: z.literal("charge.dispute.resolve"),
	data: disputeDataSchema,
});

export const dedicatedAccountAssignFail: z.ZodObject<{
	event: z.ZodLiteral<"dedicatedaccount.assign.failed">;
	data: z.ZodObject<
		{
			customer: z.ZodObject<
				{
					id: z.ZodNumber;
					first_name: z.ZodNullable<z.ZodString>;
					last_name: z.ZodNullable<z.ZodString>;
					email: z.ZodEmail;
					phone: z.ZodNullable<z.ZodString>;
					metadata: z.ZodNullable<z.ZodAny>;
					customer_code: z.ZodString;
					risk_action: z.ZodString;
					international_format_phone: z.ZodNullable<z.ZodString>;
				},
				z.core.$strip
			>;
			dedicated_account: z.ZodNullable<z.ZodUnknown>;
			identification: z.ZodObject<
				{
					status: z.ZodString;
				},
				z.core.$strip
			>;
		},
		z.core.$strip
	>;
}> = z.object({
	event: z.literal("dedicatedaccount.assign.failed"),
	data: z.object({
		customer,
		dedicated_account: z.unknown().nullable(),
		identification: z.object({
			status: z.string(),
		}),
	}),
});

export const dedicatedAccountAssignSuccess: z.ZodObject<{
	event: z.ZodLiteral<"dedicatedaccount.assign.success">;
	data: z.ZodObject<
		{
			customer: z.ZodObject<
				{
					id: z.ZodNumber;
					first_name: z.ZodNullable<z.ZodString>;
					last_name: z.ZodNullable<z.ZodString>;
					email: z.ZodEmail;
					phone: z.ZodNullable<z.ZodString>;
					metadata: z.ZodNullable<z.ZodAny>;
					customer_code: z.ZodString;
					risk_action: z.ZodString;
					international_format_phone: z.ZodNullable<z.ZodString>;
				},
				z.core.$strip
			>;
			dedicated_account: z.ZodObject<
				{
					bank: z.ZodObject<
						{
							name: z.ZodString;
							id: z.ZodNumber;
							slug: z.ZodString;
						},
						z.core.$strip
					>;
					account_name: z.ZodString;
					account_number: z.ZodString;
					assigned: z.ZodBoolean;
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
					active: z.ZodBoolean;
					id: z.ZodNumber;
					created_at: z.ZodISODateTime;
					updated_at: z.ZodISODateTime;
				},
				z.core.$strip
			>;
			assignment: z.ZodObject<
				{
					integration: z.ZodNumber;
					assignee_id: z.ZodNumber;
					assignee_type: z.ZodString;
					expired: z.ZodBoolean;
					account_type: z.ZodString;
					assigned_at: z.ZodISODateTime;
					expired_at: z.ZodNullable<z.ZodISODateTime>;
				},
				z.core.$strip
			>;
		},
		z.core.$strip
	>;
	identification: z.ZodObject<
		{
			status: z.ZodString;
		},
		z.core.$strip
	>;
}> = z.object({
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

export const invoiceCreate: z.ZodObject<{
	event: z.ZodLiteral<"invoice.create">;
	data: z.ZodObject<
		{
			domain: z.ZodString;
			invoice_code: z.ZodString;
			amount: z.ZodNumber;
			period_start: z.ZodISODateTime;
			period_end: z.ZodISODateTime;
			status: z.ZodString;
			paid: z.ZodBoolean;
			paid_at: z.ZodNullable<z.ZodISODateTime>;
			description: z.ZodNullable<z.ZodString>;
			authorization: z.ZodObject<
				{
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
				},
				z.core.$strip
			>;
			subscription: z.ZodObject<
				{
					status: z.ZodString;
					subscription_code: z.ZodString;
					email_token: z.ZodString;
					amount: z.ZodNumber;
					cron_expression: z.ZodString;
					next_payment_date: z.ZodISODateTime;
					open_invoice: z.ZodNullable<z.ZodUnknown>;
				},
				z.core.$strip
			>;
			customer: z.ZodObject<
				{
					email: z.ZodEmail;
					metadata: z.ZodNullable<z.ZodAny>;
					id: z.ZodNumber;
					first_name: z.ZodNullable<z.ZodString>;
					last_name: z.ZodNullable<z.ZodString>;
					phone: z.ZodNullable<z.ZodString>;
					customer_code: z.ZodString;
					risk_action: z.ZodString;
				},
				z.core.$strip
			>;
			transaction: z.ZodObject<
				{
					reference: z.ZodUUID;
					status: z.ZodString;
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
				},
				z.core.$strip
			>;
			created_at: z.ZodISODateTime;
		},
		z.core.$strip
	>;
}> = z.object({
	event: z.literal("invoice.create"),
	data: invoiceDataBaseSchema.extend({
		transaction: invoiceSuccessTransactionSchema,
		created_at: z.iso.datetime(),
	}),
});

export const invoiceFail: z.ZodObject<{
	event: z.ZodLiteral<"invoice.payment_failed">;
	data: z.ZodObject<
		{
			domain: z.ZodString;
			invoice_code: z.ZodString;
			amount: z.ZodNumber;
			period_start: z.ZodISODateTime;
			period_end: z.ZodISODateTime;
			status: z.ZodString;
			paid: z.ZodBoolean;
			paid_at: z.ZodNullable<z.ZodISODateTime>;
			description: z.ZodNullable<z.ZodString>;
			authorization: z.ZodObject<
				{
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
				},
				z.core.$strip
			>;
			subscription: z.ZodObject<
				{
					status: z.ZodString;
					subscription_code: z.ZodString;
					email_token: z.ZodString;
					amount: z.ZodNumber;
					cron_expression: z.ZodString;
					next_payment_date: z.ZodISODateTime;
					open_invoice: z.ZodNullable<z.ZodUnknown>;
				},
				z.core.$strip
			>;
			customer: z.ZodObject<
				{
					email: z.ZodEmail;
					metadata: z.ZodNullable<z.ZodAny>;
					id: z.ZodNumber;
					first_name: z.ZodNullable<z.ZodString>;
					last_name: z.ZodNullable<z.ZodString>;
					phone: z.ZodNullable<z.ZodString>;
					customer_code: z.ZodString;
					risk_action: z.ZodString;
				},
				z.core.$strip
			>;
			transaction: z.ZodObject<
				{
					reference: z.ZodOptional<z.ZodUUID>;
					status: z.ZodOptional<z.ZodString>;
					amount: z.ZodOptional<z.ZodNumber>;
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
				},
				z.core.$strip
			>;
			created_at: z.ZodISODateTime;
		},
		z.core.$strip
	>;
}> = z.object({
	event: z.literal("invoice.payment_failed"),
	data: invoiceDataBaseSchema.extend({
		transaction: invoiceSuccessTransactionSchema.partial(),
		created_at: z.iso.datetime(),
	}),
});

export const invoiceUpdate: z.ZodObject<{
	event: z.ZodLiteral<"invoice.update">;
	data: z.ZodObject<
		{
			domain: z.ZodString;
			invoice_code: z.ZodString;
			amount: z.ZodNumber;
			period_start: z.ZodISODateTime;
			period_end: z.ZodISODateTime;
			status: z.ZodString;
			paid: z.ZodBoolean;
			paid_at: z.ZodNullable<z.ZodISODateTime>;
			description: z.ZodNullable<z.ZodString>;
			authorization: z.ZodObject<
				{
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
				},
				z.core.$strip
			>;
			subscription: z.ZodObject<
				{
					status: z.ZodString;
					subscription_code: z.ZodString;
					email_token: z.ZodString;
					amount: z.ZodNumber;
					cron_expression: z.ZodString;
					next_payment_date: z.ZodISODateTime;
					open_invoice: z.ZodNullable<z.ZodUnknown>;
				},
				z.core.$strip
			>;
			customer: z.ZodObject<
				{
					email: z.ZodEmail;
					metadata: z.ZodNullable<z.ZodAny>;
					id: z.ZodNumber;
					first_name: z.ZodNullable<z.ZodString>;
					last_name: z.ZodNullable<z.ZodString>;
					phone: z.ZodNullable<z.ZodString>;
					customer_code: z.ZodString;
					risk_action: z.ZodString;
				},
				z.core.$strip
			>;
			transaction: z.ZodObject<
				{
					reference: z.ZodUUID;
					status: z.ZodString;
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
				},
				z.core.$strip
			>;
		},
		z.core.$strip
	>;
}> = z.object({
	event: z.literal("invoice.update"),
	data: invoiceDataBaseSchema.extend({
		transaction: invoiceSuccessTransactionSchema,
	}),
});

export const paymentRequestPending: z.ZodObject<{
	event: z.ZodLiteral<"paymentrequest.pending">;
	data: z.ZodObject<
		{
			id: z.ZodNumber;
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
			due_date: z.ZodNullable<z.ZodISODateTime>;
			has_invoice: z.ZodBoolean;
			invoice_number: z.ZodNullable<z.ZodString>;
			description: z.ZodNullable<z.ZodString>;
			pdf_url: z.ZodNullable<z.ZodURL>;
			line_items: z.ZodArray<z.ZodUnknown>;
			tax: z.ZodArray<z.ZodUnknown>;
			request_code: z.ZodString;
			status: z.ZodString;
			paid: z.ZodBoolean;
			paid_at: z.ZodNullable<z.ZodISODateTime>;
			metadata: z.ZodNullable<z.ZodAny>;
			notifications: z.ZodArray<
				z.ZodObject<
					{
						sent_at: z.ZodISODateTime;
						channel: z.ZodString;
					},
					z.core.$strip
				>
			>;
			offline_reference: z.ZodNullable<z.ZodString>;
			customer: z.ZodNumber;
			created_at: z.ZodISODateTime;
		},
		z.core.$strip
	>;
}> = z.object({
	event: z.literal("paymentrequest.pending"),
	data: paymentRequestDataSchema,
});

export const paymentRequestSuccess: z.ZodObject<{
	event: z.ZodLiteral<"paymentrequest.success">;
	data: z.ZodObject<
		{
			id: z.ZodNumber;
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
			due_date: z.ZodNullable<z.ZodISODateTime>;
			has_invoice: z.ZodBoolean;
			invoice_number: z.ZodNullable<z.ZodString>;
			description: z.ZodNullable<z.ZodString>;
			pdf_url: z.ZodNullable<z.ZodURL>;
			line_items: z.ZodArray<z.ZodUnknown>;
			tax: z.ZodArray<z.ZodUnknown>;
			request_code: z.ZodString;
			status: z.ZodString;
			paid: z.ZodBoolean;
			paid_at: z.ZodNullable<z.ZodISODateTime>;
			metadata: z.ZodNullable<z.ZodAny>;
			notifications: z.ZodArray<
				z.ZodObject<
					{
						sent_at: z.ZodISODateTime;
						channel: z.ZodString;
					},
					z.core.$strip
				>
			>;
			offline_reference: z.ZodNullable<z.ZodString>;
			customer: z.ZodNumber;
			created_at: z.ZodISODateTime;
		},
		z.core.$strip
	>;
}> = z.object({
	event: z.literal("paymentrequest.success"),
	data: paymentRequestDataSchema,
});

export const refundFailed: z.ZodObject<{
	event: z.ZodLiteral<"refund.failed">;
	data: z.ZodObject<
		{
			status: z.ZodString;
			transaction_reference: z.ZodString;
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
			processor: z.ZodString;
			customer: z.ZodObject<
				{
					email: z.ZodEmail;
					first_name: z.ZodNullable<z.ZodString>;
					last_name: z.ZodNullable<z.ZodString>;
				},
				z.core.$strip
			>;
			integration: z.ZodNumber;
			domain: z.ZodString;
			refund_reference: z.ZodString;
		},
		z.core.$strip
	>;
}> = z.object({
	event: z.literal("refund.failed"),
	data: refundFailedOrProcessedDataSchema,
});

export const refundPending: z.ZodObject<{
	event: z.ZodLiteral<"refund.pending">;
	data: z.ZodObject<
		{
			status: z.ZodString;
			transaction_reference: z.ZodString;
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
			processor: z.ZodString;
			customer: z.ZodObject<
				{
					email: z.ZodEmail;
					first_name: z.ZodNullable<z.ZodString>;
					last_name: z.ZodNullable<z.ZodString>;
				},
				z.core.$strip
			>;
			integration: z.ZodNumber;
			domain: z.ZodString;
			refund_reference: z.ZodNullable<z.ZodString>;
		},
		z.core.$strip
	>;
}> = z.object({
	event: z.literal("refund.pending"),
	data: refundPendingOrProcessingDataSchema,
});

export const refundProcessed: z.ZodObject<{
	event: z.ZodLiteral<"refund.processed">;
	data: z.ZodObject<
		{
			status: z.ZodString;
			transaction_reference: z.ZodString;
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
			processor: z.ZodString;
			customer: z.ZodObject<
				{
					email: z.ZodEmail;
					first_name: z.ZodNullable<z.ZodString>;
					last_name: z.ZodNullable<z.ZodString>;
				},
				z.core.$strip
			>;
			integration: z.ZodNumber;
			domain: z.ZodString;
			refund_reference: z.ZodString;
		},
		z.core.$strip
	>;
}> = z.object({
	event: z.literal("refund.processed"),
	data: refundFailedOrProcessedDataSchema,
});

export const refundProcessing: z.ZodObject<{
	event: z.ZodLiteral<"refund.processing">;
	data: z.ZodObject<
		{
			status: z.ZodString;
			transaction_reference: z.ZodString;
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
			processor: z.ZodString;
			customer: z.ZodObject<
				{
					email: z.ZodEmail;
					first_name: z.ZodNullable<z.ZodString>;
					last_name: z.ZodNullable<z.ZodString>;
				},
				z.core.$strip
			>;
			integration: z.ZodNumber;
			domain: z.ZodString;
			refund_reference: z.ZodNullable<z.ZodString>;
		},
		z.core.$strip
	>;
}> = z.object({
	event: z.literal("refund.processing"),
	data: refundPendingOrProcessingDataSchema,
});

export const subscriptionCreate: z.ZodObject<{
	event: z.ZodLiteral<"subscription.create">;
	data: z.ZodObject<
		{
			domain: z.ZodString;
			status: z.ZodString;
			subscription_code: z.ZodString;
			amount: z.ZodNumber;
			cron_expression: z.ZodString;
			next_payment_date: z.ZodISODateTime;
			open_invoice: z.ZodNullable<z.ZodUnknown>;
			plan: z.ZodObject<
				{
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
				},
				z.core.$strip
			>;
			authorization: z.ZodObject<
				{
					bank: z.ZodOptional<z.ZodNullable<z.ZodString>>;
					account_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
					authorization_code: z.ZodOptional<z.ZodString>;
					channel: z.ZodOptional<z.ZodString>;
					bin: z.ZodOptional<z.ZodString>;
					last4: z.ZodOptional<z.ZodString>;
					exp_month: z.ZodOptional<z.ZodString>;
					exp_year: z.ZodOptional<z.ZodString>;
					card_type: z.ZodOptional<z.ZodString>;
					country_code: z.ZodOptional<z.ZodString>;
					brand: z.ZodOptional<z.ZodString>;
				},
				z.core.$strip
			>;
			customer: z.ZodObject<
				{
					email: z.ZodEmail;
					metadata: z.ZodNullable<z.ZodAny>;
					first_name: z.ZodNullable<z.ZodString>;
					last_name: z.ZodNullable<z.ZodString>;
					phone: z.ZodNullable<z.ZodString>;
					customer_code: z.ZodString;
					risk_action: z.ZodString;
				},
				z.core.$strip
			>;
			created_at: z.ZodISODateTime;
			createdAt: z.ZodISODateTime;
		},
		z.core.$strip
	>;
}> = z.object({
	event: z.literal("subscription.create"),
	data: subscriptionCoreDataSchema.extend({
		createdAt: z.iso.datetime(),
	}),
});

export const subscriptionDisabled: z.ZodObject<{
	event: z.ZodLiteral<"subscription.disable">;
	data: z.ZodObject<
		{
			domain: z.ZodString;
			status: z.ZodString;
			subscription_code: z.ZodString;
			amount: z.ZodNumber;
			cron_expression: z.ZodString;
			next_payment_date: z.ZodISODateTime;
			open_invoice: z.ZodNullable<z.ZodUnknown>;
			plan: z.ZodObject<
				{
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
				},
				z.core.$strip
			>;
			authorization: z.ZodObject<
				{
					bank: z.ZodOptional<z.ZodNullable<z.ZodString>>;
					account_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
					authorization_code: z.ZodOptional<z.ZodString>;
					channel: z.ZodOptional<z.ZodString>;
					bin: z.ZodOptional<z.ZodString>;
					last4: z.ZodOptional<z.ZodString>;
					exp_month: z.ZodOptional<z.ZodString>;
					exp_year: z.ZodOptional<z.ZodString>;
					card_type: z.ZodOptional<z.ZodString>;
					country_code: z.ZodOptional<z.ZodString>;
					brand: z.ZodOptional<z.ZodString>;
				},
				z.core.$strip
			>;
			customer: z.ZodObject<
				{
					email: z.ZodEmail;
					metadata: z.ZodNullable<z.ZodAny>;
					first_name: z.ZodNullable<z.ZodString>;
					last_name: z.ZodNullable<z.ZodString>;
					phone: z.ZodNullable<z.ZodString>;
					customer_code: z.ZodString;
					risk_action: z.ZodString;
				},
				z.core.$strip
			>;
			created_at: z.ZodISODateTime;
			email_token: z.ZodString;
		},
		z.core.$strip
	>;
}> = z.object({
	event: z.literal("subscription.disable"),
	data: subscriptionCoreDataSchema.extend({
		email_token: z.string(),
	}),
});

export const subscriptionNotRenewed: z.ZodObject<{
	event: z.ZodLiteral<"subscription.not_renew">;
	data: z.ZodObject<
		{
			id: z.ZodNumber;
			domain: z.ZodString;
			status: z.ZodString;
			subscription_code: z.ZodString;
			email_token: z.ZodString;
			amount: z.ZodNumber;
			cron_expression: z.ZodString;
			next_payment_date: z.ZodISODateTime;
			open_invoice: z.ZodNullable<z.ZodUnknown>;
			integration: z.ZodNumber;
			plan: z.ZodObject<
				{
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
				},
				z.core.$strip
			>;
			authorization: z.ZodObject<
				{
					bank: z.ZodOptional<z.ZodNullable<z.ZodString>>;
					account_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
					authorization_code: z.ZodOptional<z.ZodString>;
					channel: z.ZodOptional<z.ZodString>;
					bin: z.ZodOptional<z.ZodString>;
					last4: z.ZodOptional<z.ZodString>;
					exp_month: z.ZodOptional<z.ZodString>;
					exp_year: z.ZodOptional<z.ZodString>;
					card_type: z.ZodOptional<z.ZodString>;
					country_code: z.ZodOptional<z.ZodString>;
					brand: z.ZodOptional<z.ZodString>;
				},
				z.core.$strip
			>;
			customer: z.ZodObject<
				{
					id: z.ZodNumber;
					first_name: z.ZodNullable<z.ZodString>;
					last_name: z.ZodNullable<z.ZodString>;
					email: z.ZodEmail;
					phone: z.ZodNullable<z.ZodString>;
					metadata: z.ZodNullable<z.ZodAny>;
					customer_code: z.ZodString;
					risk_action: z.ZodString;
					international_format_phone: z.ZodNullable<z.ZodString>;
				},
				z.core.$strip
			>;
			invoices: z.ZodArray<z.ZodUnknown>;
			invoices_history: z.ZodArray<z.ZodUnknown>;
			invoice_limit: z.ZodNumber;
			split_code: z.ZodNullable<z.ZodString>;
			most_recent_invoice: z.ZodNullable<z.ZodUnknown>;
			created_at: z.ZodISODateTime;
		},
		z.core.$strip
	>;
}> = z.object({
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

export const subscriptionWithExpiredCard: z.ZodObject<{
	event: z.ZodLiteral<"subscription.expiring_cards">;
	data: z.ZodArray<
		z.ZodObject<
			{
				expiry_date: z.ZodISODateTime;
				description: z.ZodString;
				brand: z.ZodEnum<{
					visa: "visa";
					mastercard: "mastercard";
					verve: "verve";
				}>;
				subscription: z.ZodObject<
					{
						id: z.ZodNumber;
						subscription_code: z.ZodString;
						amount: z.ZodNumber;
						next_payment_date: z.ZodISODateTime;
						plan: z.ZodObject<
							{
								id: z.ZodNumber;
								name: z.ZodString;
								plan_code: z.ZodString;
								interval: z.ZodString;
							},
							z.core.$strip
						>;
					},
					z.core.$strip
				>;
				customer: z.ZodObject<
					{
						email: z.ZodEmail;
						id: z.ZodNumber;
						first_name: z.ZodNullable<z.ZodString>;
						last_name: z.ZodNullable<z.ZodString>;
						customer_code: z.ZodString;
					},
					z.core.$strip
				>;
			},
			z.core.$strip
		>
	>;
}> = z.object({
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

export const transactionSuccessful: z.ZodObject<{
	event: z.ZodLiteral<"charge.success">;
	data: z.ZodObject<
		{
			status: z.ZodString;
			message: z.ZodNullable<z.ZodString>;
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
			id: z.ZodNumber;
			domain: z.ZodString;
			amount: z.ZodNumber;
			reference: z.ZodString;
			gateway_response: z.ZodString;
			channel: z.ZodString;
			ip_address: z.ZodNullable<z.ZodString>;
			fees_split: z.ZodNullable<z.ZodUnknown>;
			order_id: z.ZodNullable<z.ZodString>;
			requested_amount: z.ZodNumber;
			pos_transaction_data: z.ZodNullable<z.ZodUnknown>;
			connect: z.ZodNullable<z.ZodUnknown>;
			log: z.ZodNullable<
				z.ZodObject<
					{
						success: z.ZodBoolean;
						input: z.ZodArray<z.ZodUnknown>;
						errors: z.ZodNumber;
						time_spent: z.ZodNumber;
						attempts: z.ZodNumber;
						mobile: z.ZodBoolean;
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
						authentication: z.ZodString;
					},
					z.core.$strip
				>
			>;
			metadata: z.ZodAny;
			paid_at: z.ZodISODateTime;
			created_at: z.ZodISODateTime;
			fees: z.ZodNullable<z.ZodNumber>;
			customer: z.ZodObject<
				{
					email: z.ZodEmail;
					metadata: z.ZodNullable<z.ZodAny>;
					first_name: z.ZodNullable<z.ZodString>;
					last_name: z.ZodNullable<z.ZodString>;
					phone: z.ZodNullable<z.ZodString>;
					customer_code: z.ZodString;
					risk_action: z.ZodString;
				},
				z.core.$strip
			>;
			authorization: z.ZodObject<
				{
					bank: z.ZodOptional<z.ZodNullable<z.ZodString>>;
					account_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
					authorization_code: z.ZodOptional<z.ZodString>;
					channel: z.ZodOptional<z.ZodString>;
					bin: z.ZodOptional<z.ZodString>;
					last4: z.ZodOptional<z.ZodString>;
					exp_month: z.ZodOptional<z.ZodString>;
					exp_year: z.ZodOptional<z.ZodString>;
					card_type: z.ZodOptional<z.ZodString>;
					country_code: z.ZodOptional<z.ZodString>;
					brand: z.ZodOptional<z.ZodString>;
				},
				z.core.$strip
			>;
		},
		z.core.$strip
	>;
}> = z.object({
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

export const transferSuccess: z.ZodObject<{
	event: z.ZodLiteral<"transfer.success">;
	data: z.ZodObject<
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
			domain: z.ZodString;
			failures: z.ZodNullable<z.ZodUnknown>;
			id: z.ZodNumber;
			integration: z.ZodObject<
				{
					id: z.ZodNumber;
					is_live: z.ZodBoolean;
					business_name: z.ZodString;
				},
				z.core.$strip
			>;
			reason: z.ZodString;
			reference: z.ZodString;
			source: z.ZodString;
			source_details: z.ZodNullable<z.ZodUnknown>;
			status: z.ZodString;
			titan_code: z.ZodNullable<z.ZodString>;
			transfer_code: z.ZodString;
			transferred_at: z.ZodNullable<z.ZodISODateTime>;
			session: z.ZodObject<
				{
					provider: z.ZodNullable<z.ZodString>;
					id: z.ZodNullable<z.ZodString>;
				},
				z.core.$strip
			>;
			created_at: z.ZodOptional<z.ZodISODateTime>;
			updated_at: z.ZodOptional<z.ZodISODateTime>;
			recipient: z.ZodObject<
				{
					active: z.ZodBoolean;
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
					description: z.ZodNullable<z.ZodString>;
					domain: z.ZodString;
					email: z.ZodNullable<z.ZodEmail>;
					id: z.ZodNumber;
					integration: z.ZodNumber;
					metadata: z.ZodNullable<z.ZodAny>;
					name: z.ZodString;
					recipient_code: z.ZodString;
					type: z.ZodString;
					is_deleted: z.ZodBoolean;
					created_at: z.ZodOptional<z.ZodISODateTime>;
					updated_at: z.ZodOptional<z.ZodISODateTime>;
					details: z.ZodObject<
						{
							account_number: z.ZodString;
							account_name: z.ZodNullable<z.ZodString>;
							bank_code: z.ZodString;
							bank_name: z.ZodString;
						},
						z.core.$strip
					>;
				},
				z.core.$strip
			>;
		},
		z.core.$strip
	>;
}> = z.object({
	event: z.literal("transfer.success"),
	data: transferDataBaseSchema.extend({
		recipient: transferSuccessRecipientSchema,
	}),
});

export const transferFailed: z.ZodObject<{
	event: z.ZodLiteral<"transfer.failed">;
	data: z.ZodObject<
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
			domain: z.ZodString;
			failures: z.ZodNullable<z.ZodUnknown>;
			id: z.ZodNumber;
			integration: z.ZodObject<
				{
					id: z.ZodNumber;
					is_live: z.ZodBoolean;
					business_name: z.ZodString;
				},
				z.core.$strip
			>;
			reason: z.ZodString;
			reference: z.ZodString;
			source: z.ZodString;
			source_details: z.ZodNullable<z.ZodUnknown>;
			status: z.ZodString;
			titan_code: z.ZodNullable<z.ZodString>;
			transfer_code: z.ZodString;
			transferred_at: z.ZodNullable<z.ZodISODateTime>;
			session: z.ZodObject<
				{
					provider: z.ZodNullable<z.ZodString>;
					id: z.ZodNullable<z.ZodString>;
				},
				z.core.$strip
			>;
			created_at: z.ZodOptional<z.ZodISODateTime>;
			updated_at: z.ZodOptional<z.ZodISODateTime>;
			recipient: z.ZodObject<
				{
					active: z.ZodBoolean;
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
					description: z.ZodNullable<z.ZodString>;
					domain: z.ZodString;
					email: z.ZodNullable<z.ZodEmail>;
					id: z.ZodNumber;
					integration: z.ZodNumber;
					metadata: z.ZodNullable<z.ZodAny>;
					name: z.ZodString;
					recipient_code: z.ZodString;
					type: z.ZodString;
					is_deleted: z.ZodBoolean;
					created_at: z.ZodOptional<z.ZodISODateTime>;
					updated_at: z.ZodOptional<z.ZodISODateTime>;
					details: z.ZodObject<
						{
							account_number: z.ZodString;
							account_name: z.ZodNullable<z.ZodString>;
							bank_code: z.ZodString;
							bank_name: z.ZodString;
							authorization_code: z.ZodNullable<z.ZodString>;
						},
						z.core.$strip
					>;
				},
				z.core.$strip
			>;
		},
		z.core.$strip
	>;
}> = z.object({
	event: z.literal("transfer.failed"),
	data: transferDataBaseSchema.extend({
		recipient: transferFailedOrReversedRecipientSchema,
	}),
});

export const transferReversed: z.ZodObject<{
	event: z.ZodLiteral<"transfer.reversed">;
	data: z.ZodObject<
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
			domain: z.ZodString;
			failures: z.ZodNullable<z.ZodUnknown>;
			id: z.ZodNumber;
			integration: z.ZodObject<
				{
					id: z.ZodNumber;
					is_live: z.ZodBoolean;
					business_name: z.ZodString;
				},
				z.core.$strip
			>;
			reason: z.ZodString;
			reference: z.ZodString;
			source: z.ZodString;
			source_details: z.ZodNullable<z.ZodUnknown>;
			status: z.ZodString;
			titan_code: z.ZodNullable<z.ZodString>;
			transfer_code: z.ZodString;
			transferred_at: z.ZodNullable<z.ZodISODateTime>;
			session: z.ZodObject<
				{
					provider: z.ZodNullable<z.ZodString>;
					id: z.ZodNullable<z.ZodString>;
				},
				z.core.$strip
			>;
			created_at: z.ZodOptional<z.ZodISODateTime>;
			updated_at: z.ZodOptional<z.ZodISODateTime>;
			recipient: z.ZodObject<
				{
					active: z.ZodBoolean;
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
					description: z.ZodNullable<z.ZodString>;
					domain: z.ZodString;
					email: z.ZodNullable<z.ZodEmail>;
					id: z.ZodNumber;
					integration: z.ZodNumber;
					metadata: z.ZodNullable<z.ZodAny>;
					name: z.ZodString;
					recipient_code: z.ZodString;
					type: z.ZodString;
					is_deleted: z.ZodBoolean;
					created_at: z.ZodOptional<z.ZodISODateTime>;
					updated_at: z.ZodOptional<z.ZodISODateTime>;
					details: z.ZodObject<
						{
							account_number: z.ZodString;
							account_name: z.ZodNullable<z.ZodString>;
							bank_code: z.ZodString;
							bank_name: z.ZodString;
							authorization_code: z.ZodNullable<z.ZodString>;
						},
						z.core.$strip
					>;
				},
				z.core.$strip
			>;
		},
		z.core.$strip
	>;
}> = z.object({
	event: z.literal("transfer.reversed"),
	data: transferDataBaseSchema.extend({
		recipient: transferFailedOrReversedRecipientSchema,
	}),
});

export const paystackWebhookSchema: z.ZodDiscriminatedUnion<
	[
		z.ZodObject<
			{
				event: z.ZodLiteral<"customeridentification.failed">;
				data: z.ZodObject<
					{
						customer_id: z.ZodString;
						customer_code: z.ZodString;
						email: z.ZodEmail;
						identification: z.ZodObject<
							{
								country: z.ZodEnum<{
									NG: "NG";
									GH: "GH";
								}>;
								type: z.ZodString;
								bvn: z.ZodString;
								account_number: z.ZodString;
								bank_code: z.ZodString;
							},
							z.core.$strip
						>;
					},
					z.core.$strip
				>;
				reason: z.ZodString;
			},
			z.core.$strip
		>,
		z.ZodObject<
			{
				event: z.ZodLiteral<"customeridentification.success">;
				data: z.ZodObject<
					{
						customer_id: z.ZodString;
						customer_code: z.ZodString;
						email: z.ZodEmail;
						identification: z.ZodObject<
							{
								country: z.ZodEnum<{
									NG: "NG";
									GH: "GH";
								}>;
								type: z.ZodString;
								value: z.ZodString;
							},
							z.core.$strip
						>;
					},
					z.core.$strip
				>;
			},
			z.core.$strip
		>,
		z.ZodObject<
			{
				event: z.ZodLiteral<"charge.dispute.create">;
				data: z.ZodObject<
					{
						id: z.ZodNumber;
						refund_amount: z.ZodNumber;
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
						resolution: z.ZodNullable<z.ZodUnknown>;
						domain: z.ZodString;
						transaction: z.ZodObject<
							{
								id: z.ZodNumber;
								domain: z.ZodString;
								status: z.ZodString;
								reference: z.ZodString;
								amount: z.ZodNumber;
								message: z.ZodNullable<z.ZodString>;
								gateway_response: z.ZodString;
								paid_at: z.ZodISODateTime;
								created_at: z.ZodISODateTime;
								channel: z.ZodString;
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
								ip_address: z.ZodNullable<z.ZodIPv4>;
								metadata: z.ZodAny;
								log: z.ZodNullable<
									z.ZodObject<
										{
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
										},
										z.core.$strip
									>
								>;
								fees: z.ZodNumber;
								fees_split: z.ZodNullable<z.ZodUnknown>;
								authorization: z.ZodOptional<
									z.ZodObject<
										{
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
										},
										z.core.$strip
									>
								>;
								customer: z.ZodObject<
									{
										international_format_phone: z.ZodNullable<z.ZodString>;
									},
									z.core.$strip
								>;
								plan: z.ZodObject<
									{
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
									},
									z.core.$strip
								>;
								subaccount: z.ZodOptional<
									z.ZodObject<
										{
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
										},
										z.core.$strip
									>
								>;
								split: z.ZodOptional<z.ZodObject<{}, z.core.$strip>>;
								order_id: z.ZodNullable<z.ZodString>;
								paidAt: z.ZodISODateTime;
								requested_amount: z.ZodNumber;
								pos_transaction_data: z.ZodNullable<z.ZodUnknown>;
							},
							z.core.$strip
						>;
						transaction_reference: z.ZodNullable<z.ZodString>;
						category: z.ZodString;
						customer: z.ZodObject<
							{
								id: z.ZodNumber;
								first_name: z.ZodNullable<z.ZodString>;
								last_name: z.ZodNullable<z.ZodString>;
								email: z.ZodEmail;
								phone: z.ZodNullable<z.ZodString>;
								metadata: z.ZodNullable<z.ZodAny>;
								customer_code: z.ZodString;
								risk_action: z.ZodString;
								international_format_phone: z.ZodNullable<z.ZodString>;
							},
							z.core.$strip
						>;
						bin: z.ZodString;
						last4: z.ZodString;
						dueAt: z.ZodISODateTime;
						resolvedAt: z.ZodNullable<z.ZodISODateTime>;
						evidence: z.ZodNullable<z.ZodUnknown>;
						attachments: z.ZodNullable<z.ZodUnknown>;
						note: z.ZodNullable<z.ZodUnknown>;
						history: z.ZodArray<
							z.ZodObject<
								{
									status: z.ZodString;
									by: z.ZodEmail;
									created_at: z.ZodISODateTime;
								},
								z.core.$strip
							>
						>;
						messages: z.ZodArray<
							z.ZodObject<
								{
									sender: z.ZodEmail;
									body: z.ZodString;
									created_at: z.ZodISODateTime;
								},
								z.core.$strip
							>
						>;
						created_at: z.ZodISODateTime;
						updated_at: z.ZodISODateTime;
					},
					z.core.$strip
				>;
			},
			z.core.$strip
		>,
		z.ZodObject<
			{
				event: z.ZodLiteral<"charge.dispute.remind">;
				data: z.ZodObject<
					{
						id: z.ZodNumber;
						refund_amount: z.ZodNumber;
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
						resolution: z.ZodNullable<z.ZodUnknown>;
						domain: z.ZodString;
						transaction: z.ZodObject<
							{
								id: z.ZodNumber;
								domain: z.ZodString;
								status: z.ZodString;
								reference: z.ZodString;
								amount: z.ZodNumber;
								message: z.ZodNullable<z.ZodString>;
								gateway_response: z.ZodString;
								paid_at: z.ZodISODateTime;
								created_at: z.ZodISODateTime;
								channel: z.ZodString;
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
								ip_address: z.ZodNullable<z.ZodIPv4>;
								metadata: z.ZodAny;
								log: z.ZodNullable<
									z.ZodObject<
										{
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
										},
										z.core.$strip
									>
								>;
								fees: z.ZodNumber;
								fees_split: z.ZodNullable<z.ZodUnknown>;
								authorization: z.ZodOptional<
									z.ZodObject<
										{
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
										},
										z.core.$strip
									>
								>;
								customer: z.ZodObject<
									{
										international_format_phone: z.ZodNullable<z.ZodString>;
									},
									z.core.$strip
								>;
								plan: z.ZodObject<
									{
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
									},
									z.core.$strip
								>;
								subaccount: z.ZodOptional<
									z.ZodObject<
										{
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
										},
										z.core.$strip
									>
								>;
								split: z.ZodOptional<z.ZodObject<{}, z.core.$strip>>;
								order_id: z.ZodNullable<z.ZodString>;
								paidAt: z.ZodISODateTime;
								requested_amount: z.ZodNumber;
								pos_transaction_data: z.ZodNullable<z.ZodUnknown>;
							},
							z.core.$strip
						>;
						transaction_reference: z.ZodNullable<z.ZodString>;
						category: z.ZodString;
						customer: z.ZodObject<
							{
								id: z.ZodNumber;
								first_name: z.ZodNullable<z.ZodString>;
								last_name: z.ZodNullable<z.ZodString>;
								email: z.ZodEmail;
								phone: z.ZodNullable<z.ZodString>;
								metadata: z.ZodNullable<z.ZodAny>;
								customer_code: z.ZodString;
								risk_action: z.ZodString;
								international_format_phone: z.ZodNullable<z.ZodString>;
							},
							z.core.$strip
						>;
						bin: z.ZodString;
						last4: z.ZodString;
						dueAt: z.ZodISODateTime;
						resolvedAt: z.ZodNullable<z.ZodISODateTime>;
						evidence: z.ZodNullable<z.ZodUnknown>;
						attachments: z.ZodNullable<z.ZodUnknown>;
						note: z.ZodNullable<z.ZodUnknown>;
						history: z.ZodArray<
							z.ZodObject<
								{
									status: z.ZodString;
									by: z.ZodEmail;
									created_at: z.ZodISODateTime;
								},
								z.core.$strip
							>
						>;
						messages: z.ZodArray<
							z.ZodObject<
								{
									sender: z.ZodEmail;
									body: z.ZodString;
									created_at: z.ZodISODateTime;
								},
								z.core.$strip
							>
						>;
						created_at: z.ZodISODateTime;
						updated_at: z.ZodISODateTime;
					},
					z.core.$strip
				>;
			},
			z.core.$strip
		>,
		z.ZodObject<
			{
				event: z.ZodLiteral<"charge.dispute.resolve">;
				data: z.ZodObject<
					{
						id: z.ZodNumber;
						refund_amount: z.ZodNumber;
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
						resolution: z.ZodNullable<z.ZodUnknown>;
						domain: z.ZodString;
						transaction: z.ZodObject<
							{
								id: z.ZodNumber;
								domain: z.ZodString;
								status: z.ZodString;
								reference: z.ZodString;
								amount: z.ZodNumber;
								message: z.ZodNullable<z.ZodString>;
								gateway_response: z.ZodString;
								paid_at: z.ZodISODateTime;
								created_at: z.ZodISODateTime;
								channel: z.ZodString;
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
								ip_address: z.ZodNullable<z.ZodIPv4>;
								metadata: z.ZodAny;
								log: z.ZodNullable<
									z.ZodObject<
										{
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
										},
										z.core.$strip
									>
								>;
								fees: z.ZodNumber;
								fees_split: z.ZodNullable<z.ZodUnknown>;
								authorization: z.ZodOptional<
									z.ZodObject<
										{
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
										},
										z.core.$strip
									>
								>;
								customer: z.ZodObject<
									{
										international_format_phone: z.ZodNullable<z.ZodString>;
									},
									z.core.$strip
								>;
								plan: z.ZodObject<
									{
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
									},
									z.core.$strip
								>;
								subaccount: z.ZodOptional<
									z.ZodObject<
										{
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
										},
										z.core.$strip
									>
								>;
								split: z.ZodOptional<z.ZodObject<{}, z.core.$strip>>;
								order_id: z.ZodNullable<z.ZodString>;
								paidAt: z.ZodISODateTime;
								requested_amount: z.ZodNumber;
								pos_transaction_data: z.ZodNullable<z.ZodUnknown>;
							},
							z.core.$strip
						>;
						transaction_reference: z.ZodNullable<z.ZodString>;
						category: z.ZodString;
						customer: z.ZodObject<
							{
								id: z.ZodNumber;
								first_name: z.ZodNullable<z.ZodString>;
								last_name: z.ZodNullable<z.ZodString>;
								email: z.ZodEmail;
								phone: z.ZodNullable<z.ZodString>;
								metadata: z.ZodNullable<z.ZodAny>;
								customer_code: z.ZodString;
								risk_action: z.ZodString;
								international_format_phone: z.ZodNullable<z.ZodString>;
							},
							z.core.$strip
						>;
						bin: z.ZodString;
						last4: z.ZodString;
						dueAt: z.ZodISODateTime;
						resolvedAt: z.ZodNullable<z.ZodISODateTime>;
						evidence: z.ZodNullable<z.ZodUnknown>;
						attachments: z.ZodNullable<z.ZodUnknown>;
						note: z.ZodNullable<z.ZodUnknown>;
						history: z.ZodArray<
							z.ZodObject<
								{
									status: z.ZodString;
									by: z.ZodEmail;
									created_at: z.ZodISODateTime;
								},
								z.core.$strip
							>
						>;
						messages: z.ZodArray<
							z.ZodObject<
								{
									sender: z.ZodEmail;
									body: z.ZodString;
									created_at: z.ZodISODateTime;
								},
								z.core.$strip
							>
						>;
						created_at: z.ZodISODateTime;
						updated_at: z.ZodISODateTime;
					},
					z.core.$strip
				>;
			},
			z.core.$strip
		>,
		z.ZodObject<
			{
				event: z.ZodLiteral<"dedicatedaccount.assign.failed">;
				data: z.ZodObject<
					{
						customer: z.ZodObject<
							{
								id: z.ZodNumber;
								first_name: z.ZodNullable<z.ZodString>;
								last_name: z.ZodNullable<z.ZodString>;
								email: z.ZodEmail;
								phone: z.ZodNullable<z.ZodString>;
								metadata: z.ZodNullable<z.ZodAny>;
								customer_code: z.ZodString;
								risk_action: z.ZodString;
								international_format_phone: z.ZodNullable<z.ZodString>;
							},
							z.core.$strip
						>;
						dedicated_account: z.ZodNullable<z.ZodUnknown>;
						identification: z.ZodObject<
							{
								status: z.ZodString;
							},
							z.core.$strip
						>;
					},
					z.core.$strip
				>;
			},
			z.core.$strip
		>,
		z.ZodObject<
			{
				event: z.ZodLiteral<"dedicatedaccount.assign.success">;
				data: z.ZodObject<
					{
						customer: z.ZodObject<
							{
								id: z.ZodNumber;
								first_name: z.ZodNullable<z.ZodString>;
								last_name: z.ZodNullable<z.ZodString>;
								email: z.ZodEmail;
								phone: z.ZodNullable<z.ZodString>;
								metadata: z.ZodNullable<z.ZodAny>;
								customer_code: z.ZodString;
								risk_action: z.ZodString;
								international_format_phone: z.ZodNullable<z.ZodString>;
							},
							z.core.$strip
						>;
						dedicated_account: z.ZodObject<
							{
								bank: z.ZodObject<
									{
										name: z.ZodString;
										id: z.ZodNumber;
										slug: z.ZodString;
									},
									z.core.$strip
								>;
								account_name: z.ZodString;
								account_number: z.ZodString;
								assigned: z.ZodBoolean;
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
								active: z.ZodBoolean;
								id: z.ZodNumber;
								created_at: z.ZodISODateTime;
								updated_at: z.ZodISODateTime;
							},
							z.core.$strip
						>;
						assignment: z.ZodObject<
							{
								integration: z.ZodNumber;
								assignee_id: z.ZodNumber;
								assignee_type: z.ZodString;
								expired: z.ZodBoolean;
								account_type: z.ZodString;
								assigned_at: z.ZodISODateTime;
								expired_at: z.ZodNullable<z.ZodISODateTime>;
							},
							z.core.$strip
						>;
					},
					z.core.$strip
				>;
				identification: z.ZodObject<
					{
						status: z.ZodString;
					},
					z.core.$strip
				>;
			},
			z.core.$strip
		>,
		z.ZodObject<
			{
				event: z.ZodLiteral<"invoice.create">;
				data: z.ZodObject<
					{
						domain: z.ZodString;
						invoice_code: z.ZodString;
						amount: z.ZodNumber;
						period_start: z.ZodISODateTime;
						period_end: z.ZodISODateTime;
						status: z.ZodString;
						paid: z.ZodBoolean;
						paid_at: z.ZodNullable<z.ZodISODateTime>;
						description: z.ZodNullable<z.ZodString>;
						authorization: z.ZodObject<
							{
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
							},
							z.core.$strip
						>;
						subscription: z.ZodObject<
							{
								status: z.ZodString;
								subscription_code: z.ZodString;
								email_token: z.ZodString;
								amount: z.ZodNumber;
								cron_expression: z.ZodString;
								next_payment_date: z.ZodISODateTime;
								open_invoice: z.ZodNullable<z.ZodUnknown>;
							},
							z.core.$strip
						>;
						customer: z.ZodObject<
							{
								email: z.ZodEmail;
								metadata: z.ZodNullable<z.ZodAny>;
								id: z.ZodNumber;
								first_name: z.ZodNullable<z.ZodString>;
								last_name: z.ZodNullable<z.ZodString>;
								phone: z.ZodNullable<z.ZodString>;
								customer_code: z.ZodString;
								risk_action: z.ZodString;
							},
							z.core.$strip
						>;
						transaction: z.ZodObject<
							{
								reference: z.ZodUUID;
								status: z.ZodString;
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
							},
							z.core.$strip
						>;
						created_at: z.ZodISODateTime;
					},
					z.core.$strip
				>;
			},
			z.core.$strip
		>,
		z.ZodObject<
			{
				event: z.ZodLiteral<"invoice.payment_failed">;
				data: z.ZodObject<
					{
						domain: z.ZodString;
						invoice_code: z.ZodString;
						amount: z.ZodNumber;
						period_start: z.ZodISODateTime;
						period_end: z.ZodISODateTime;
						status: z.ZodString;
						paid: z.ZodBoolean;
						paid_at: z.ZodNullable<z.ZodISODateTime>;
						description: z.ZodNullable<z.ZodString>;
						authorization: z.ZodObject<
							{
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
							},
							z.core.$strip
						>;
						subscription: z.ZodObject<
							{
								status: z.ZodString;
								subscription_code: z.ZodString;
								email_token: z.ZodString;
								amount: z.ZodNumber;
								cron_expression: z.ZodString;
								next_payment_date: z.ZodISODateTime;
								open_invoice: z.ZodNullable<z.ZodUnknown>;
							},
							z.core.$strip
						>;
						customer: z.ZodObject<
							{
								email: z.ZodEmail;
								metadata: z.ZodNullable<z.ZodAny>;
								id: z.ZodNumber;
								first_name: z.ZodNullable<z.ZodString>;
								last_name: z.ZodNullable<z.ZodString>;
								phone: z.ZodNullable<z.ZodString>;
								customer_code: z.ZodString;
								risk_action: z.ZodString;
							},
							z.core.$strip
						>;
						transaction: z.ZodObject<
							{
								reference: z.ZodOptional<z.ZodUUID>;
								status: z.ZodOptional<z.ZodString>;
								amount: z.ZodOptional<z.ZodNumber>;
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
							},
							z.core.$strip
						>;
						created_at: z.ZodISODateTime;
					},
					z.core.$strip
				>;
			},
			z.core.$strip
		>,
		z.ZodObject<
			{
				event: z.ZodLiteral<"invoice.update">;
				data: z.ZodObject<
					{
						domain: z.ZodString;
						invoice_code: z.ZodString;
						amount: z.ZodNumber;
						period_start: z.ZodISODateTime;
						period_end: z.ZodISODateTime;
						status: z.ZodString;
						paid: z.ZodBoolean;
						paid_at: z.ZodNullable<z.ZodISODateTime>;
						description: z.ZodNullable<z.ZodString>;
						authorization: z.ZodObject<
							{
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
							},
							z.core.$strip
						>;
						subscription: z.ZodObject<
							{
								status: z.ZodString;
								subscription_code: z.ZodString;
								email_token: z.ZodString;
								amount: z.ZodNumber;
								cron_expression: z.ZodString;
								next_payment_date: z.ZodISODateTime;
								open_invoice: z.ZodNullable<z.ZodUnknown>;
							},
							z.core.$strip
						>;
						customer: z.ZodObject<
							{
								email: z.ZodEmail;
								metadata: z.ZodNullable<z.ZodAny>;
								id: z.ZodNumber;
								first_name: z.ZodNullable<z.ZodString>;
								last_name: z.ZodNullable<z.ZodString>;
								phone: z.ZodNullable<z.ZodString>;
								customer_code: z.ZodString;
								risk_action: z.ZodString;
							},
							z.core.$strip
						>;
						transaction: z.ZodObject<
							{
								reference: z.ZodUUID;
								status: z.ZodString;
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
							},
							z.core.$strip
						>;
					},
					z.core.$strip
				>;
			},
			z.core.$strip
		>,
		z.ZodObject<
			{
				event: z.ZodLiteral<"paymentrequest.pending">;
				data: z.ZodObject<
					{
						id: z.ZodNumber;
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
						due_date: z.ZodNullable<z.ZodISODateTime>;
						has_invoice: z.ZodBoolean;
						invoice_number: z.ZodNullable<z.ZodString>;
						description: z.ZodNullable<z.ZodString>;
						pdf_url: z.ZodNullable<z.ZodURL>;
						line_items: z.ZodArray<z.ZodUnknown>;
						tax: z.ZodArray<z.ZodUnknown>;
						request_code: z.ZodString;
						status: z.ZodString;
						paid: z.ZodBoolean;
						paid_at: z.ZodNullable<z.ZodISODateTime>;
						metadata: z.ZodNullable<z.ZodAny>;
						notifications: z.ZodArray<
							z.ZodObject<
								{
									sent_at: z.ZodISODateTime;
									channel: z.ZodString;
								},
								z.core.$strip
							>
						>;
						offline_reference: z.ZodNullable<z.ZodString>;
						customer: z.ZodNumber;
						created_at: z.ZodISODateTime;
					},
					z.core.$strip
				>;
			},
			z.core.$strip
		>,
		z.ZodObject<
			{
				event: z.ZodLiteral<"paymentrequest.success">;
				data: z.ZodObject<
					{
						id: z.ZodNumber;
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
						due_date: z.ZodNullable<z.ZodISODateTime>;
						has_invoice: z.ZodBoolean;
						invoice_number: z.ZodNullable<z.ZodString>;
						description: z.ZodNullable<z.ZodString>;
						pdf_url: z.ZodNullable<z.ZodURL>;
						line_items: z.ZodArray<z.ZodUnknown>;
						tax: z.ZodArray<z.ZodUnknown>;
						request_code: z.ZodString;
						status: z.ZodString;
						paid: z.ZodBoolean;
						paid_at: z.ZodNullable<z.ZodISODateTime>;
						metadata: z.ZodNullable<z.ZodAny>;
						notifications: z.ZodArray<
							z.ZodObject<
								{
									sent_at: z.ZodISODateTime;
									channel: z.ZodString;
								},
								z.core.$strip
							>
						>;
						offline_reference: z.ZodNullable<z.ZodString>;
						customer: z.ZodNumber;
						created_at: z.ZodISODateTime;
					},
					z.core.$strip
				>;
			},
			z.core.$strip
		>,
		z.ZodObject<
			{
				event: z.ZodLiteral<"refund.failed">;
				data: z.ZodObject<
					{
						status: z.ZodString;
						transaction_reference: z.ZodString;
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
						processor: z.ZodString;
						customer: z.ZodObject<
							{
								email: z.ZodEmail;
								first_name: z.ZodNullable<z.ZodString>;
								last_name: z.ZodNullable<z.ZodString>;
							},
							z.core.$strip
						>;
						integration: z.ZodNumber;
						domain: z.ZodString;
						refund_reference: z.ZodString;
					},
					z.core.$strip
				>;
			},
			z.core.$strip
		>,
		z.ZodObject<
			{
				event: z.ZodLiteral<"refund.pending">;
				data: z.ZodObject<
					{
						status: z.ZodString;
						transaction_reference: z.ZodString;
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
						processor: z.ZodString;
						customer: z.ZodObject<
							{
								email: z.ZodEmail;
								first_name: z.ZodNullable<z.ZodString>;
								last_name: z.ZodNullable<z.ZodString>;
							},
							z.core.$strip
						>;
						integration: z.ZodNumber;
						domain: z.ZodString;
						refund_reference: z.ZodNullable<z.ZodString>;
					},
					z.core.$strip
				>;
			},
			z.core.$strip
		>,
		z.ZodObject<
			{
				event: z.ZodLiteral<"refund.processed">;
				data: z.ZodObject<
					{
						status: z.ZodString;
						transaction_reference: z.ZodString;
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
						processor: z.ZodString;
						customer: z.ZodObject<
							{
								email: z.ZodEmail;
								first_name: z.ZodNullable<z.ZodString>;
								last_name: z.ZodNullable<z.ZodString>;
							},
							z.core.$strip
						>;
						integration: z.ZodNumber;
						domain: z.ZodString;
						refund_reference: z.ZodString;
					},
					z.core.$strip
				>;
			},
			z.core.$strip
		>,
		z.ZodObject<
			{
				event: z.ZodLiteral<"refund.processing">;
				data: z.ZodObject<
					{
						status: z.ZodString;
						transaction_reference: z.ZodString;
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
						processor: z.ZodString;
						customer: z.ZodObject<
							{
								email: z.ZodEmail;
								first_name: z.ZodNullable<z.ZodString>;
								last_name: z.ZodNullable<z.ZodString>;
							},
							z.core.$strip
						>;
						integration: z.ZodNumber;
						domain: z.ZodString;
						refund_reference: z.ZodNullable<z.ZodString>;
					},
					z.core.$strip
				>;
			},
			z.core.$strip
		>,
		z.ZodObject<
			{
				event: z.ZodLiteral<"subscription.create">;
				data: z.ZodObject<
					{
						domain: z.ZodString;
						status: z.ZodString;
						subscription_code: z.ZodString;
						amount: z.ZodNumber;
						cron_expression: z.ZodString;
						next_payment_date: z.ZodISODateTime;
						open_invoice: z.ZodNullable<z.ZodUnknown>;
						plan: z.ZodObject<
							{
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
							},
							z.core.$strip
						>;
						authorization: z.ZodObject<
							{
								bank: z.ZodOptional<z.ZodNullable<z.ZodString>>;
								account_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
								authorization_code: z.ZodOptional<z.ZodString>;
								channel: z.ZodOptional<z.ZodString>;
								bin: z.ZodOptional<z.ZodString>;
								last4: z.ZodOptional<z.ZodString>;
								exp_month: z.ZodOptional<z.ZodString>;
								exp_year: z.ZodOptional<z.ZodString>;
								card_type: z.ZodOptional<z.ZodString>;
								country_code: z.ZodOptional<z.ZodString>;
								brand: z.ZodOptional<z.ZodString>;
							},
							z.core.$strip
						>;
						customer: z.ZodObject<
							{
								email: z.ZodEmail;
								metadata: z.ZodNullable<z.ZodAny>;
								first_name: z.ZodNullable<z.ZodString>;
								last_name: z.ZodNullable<z.ZodString>;
								phone: z.ZodNullable<z.ZodString>;
								customer_code: z.ZodString;
								risk_action: z.ZodString;
							},
							z.core.$strip
						>;
						created_at: z.ZodISODateTime;
						createdAt: z.ZodISODateTime;
					},
					z.core.$strip
				>;
			},
			z.core.$strip
		>,
		z.ZodObject<
			{
				event: z.ZodLiteral<"subscription.disable">;
				data: z.ZodObject<
					{
						domain: z.ZodString;
						status: z.ZodString;
						subscription_code: z.ZodString;
						amount: z.ZodNumber;
						cron_expression: z.ZodString;
						next_payment_date: z.ZodISODateTime;
						open_invoice: z.ZodNullable<z.ZodUnknown>;
						plan: z.ZodObject<
							{
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
							},
							z.core.$strip
						>;
						authorization: z.ZodObject<
							{
								bank: z.ZodOptional<z.ZodNullable<z.ZodString>>;
								account_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
								authorization_code: z.ZodOptional<z.ZodString>;
								channel: z.ZodOptional<z.ZodString>;
								bin: z.ZodOptional<z.ZodString>;
								last4: z.ZodOptional<z.ZodString>;
								exp_month: z.ZodOptional<z.ZodString>;
								exp_year: z.ZodOptional<z.ZodString>;
								card_type: z.ZodOptional<z.ZodString>;
								country_code: z.ZodOptional<z.ZodString>;
								brand: z.ZodOptional<z.ZodString>;
							},
							z.core.$strip
						>;
						customer: z.ZodObject<
							{
								email: z.ZodEmail;
								metadata: z.ZodNullable<z.ZodAny>;
								first_name: z.ZodNullable<z.ZodString>;
								last_name: z.ZodNullable<z.ZodString>;
								phone: z.ZodNullable<z.ZodString>;
								customer_code: z.ZodString;
								risk_action: z.ZodString;
							},
							z.core.$strip
						>;
						created_at: z.ZodISODateTime;
						email_token: z.ZodString;
					},
					z.core.$strip
				>;
			},
			z.core.$strip
		>,
		z.ZodObject<
			{
				event: z.ZodLiteral<"subscription.not_renew">;
				data: z.ZodObject<
					{
						id: z.ZodNumber;
						domain: z.ZodString;
						status: z.ZodString;
						subscription_code: z.ZodString;
						email_token: z.ZodString;
						amount: z.ZodNumber;
						cron_expression: z.ZodString;
						next_payment_date: z.ZodISODateTime;
						open_invoice: z.ZodNullable<z.ZodUnknown>;
						integration: z.ZodNumber;
						plan: z.ZodObject<
							{
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
							},
							z.core.$strip
						>;
						authorization: z.ZodObject<
							{
								bank: z.ZodOptional<z.ZodNullable<z.ZodString>>;
								account_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
								authorization_code: z.ZodOptional<z.ZodString>;
								channel: z.ZodOptional<z.ZodString>;
								bin: z.ZodOptional<z.ZodString>;
								last4: z.ZodOptional<z.ZodString>;
								exp_month: z.ZodOptional<z.ZodString>;
								exp_year: z.ZodOptional<z.ZodString>;
								card_type: z.ZodOptional<z.ZodString>;
								country_code: z.ZodOptional<z.ZodString>;
								brand: z.ZodOptional<z.ZodString>;
							},
							z.core.$strip
						>;
						customer: z.ZodObject<
							{
								id: z.ZodNumber;
								first_name: z.ZodNullable<z.ZodString>;
								last_name: z.ZodNullable<z.ZodString>;
								email: z.ZodEmail;
								phone: z.ZodNullable<z.ZodString>;
								metadata: z.ZodNullable<z.ZodAny>;
								customer_code: z.ZodString;
								risk_action: z.ZodString;
								international_format_phone: z.ZodNullable<z.ZodString>;
							},
							z.core.$strip
						>;
						invoices: z.ZodArray<z.ZodUnknown>;
						invoices_history: z.ZodArray<z.ZodUnknown>;
						invoice_limit: z.ZodNumber;
						split_code: z.ZodNullable<z.ZodString>;
						most_recent_invoice: z.ZodNullable<z.ZodUnknown>;
						created_at: z.ZodISODateTime;
					},
					z.core.$strip
				>;
			},
			z.core.$strip
		>,
		z.ZodObject<
			{
				event: z.ZodLiteral<"subscription.expiring_cards">;
				data: z.ZodArray<
					z.ZodObject<
						{
							expiry_date: z.ZodISODateTime;
							description: z.ZodString;
							brand: z.ZodEnum<{
								visa: "visa";
								mastercard: "mastercard";
								verve: "verve";
							}>;
							subscription: z.ZodObject<
								{
									id: z.ZodNumber;
									subscription_code: z.ZodString;
									amount: z.ZodNumber;
									next_payment_date: z.ZodISODateTime;
									plan: z.ZodObject<
										{
											id: z.ZodNumber;
											name: z.ZodString;
											plan_code: z.ZodString;
											interval: z.ZodString;
										},
										z.core.$strip
									>;
								},
								z.core.$strip
							>;
							customer: z.ZodObject<
								{
									email: z.ZodEmail;
									id: z.ZodNumber;
									first_name: z.ZodNullable<z.ZodString>;
									last_name: z.ZodNullable<z.ZodString>;
									customer_code: z.ZodString;
								},
								z.core.$strip
							>;
						},
						z.core.$strip
					>
				>;
			},
			z.core.$strip
		>,
		z.ZodObject<
			{
				event: z.ZodLiteral<"charge.success">;
				data: z.ZodObject<
					{
						status: z.ZodString;
						message: z.ZodNullable<z.ZodString>;
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
						id: z.ZodNumber;
						domain: z.ZodString;
						amount: z.ZodNumber;
						reference: z.ZodString;
						gateway_response: z.ZodString;
						channel: z.ZodString;
						ip_address: z.ZodNullable<z.ZodString>;
						fees_split: z.ZodNullable<z.ZodUnknown>;
						order_id: z.ZodNullable<z.ZodString>;
						requested_amount: z.ZodNumber;
						pos_transaction_data: z.ZodNullable<z.ZodUnknown>;
						connect: z.ZodNullable<z.ZodUnknown>;
						log: z.ZodNullable<
							z.ZodObject<
								{
									success: z.ZodBoolean;
									input: z.ZodArray<z.ZodUnknown>;
									errors: z.ZodNumber;
									time_spent: z.ZodNumber;
									attempts: z.ZodNumber;
									mobile: z.ZodBoolean;
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
									authentication: z.ZodString;
								},
								z.core.$strip
							>
						>;
						metadata: z.ZodAny;
						paid_at: z.ZodISODateTime;
						created_at: z.ZodISODateTime;
						fees: z.ZodNullable<z.ZodNumber>;
						customer: z.ZodObject<
							{
								email: z.ZodEmail;
								metadata: z.ZodNullable<z.ZodAny>;
								first_name: z.ZodNullable<z.ZodString>;
								last_name: z.ZodNullable<z.ZodString>;
								phone: z.ZodNullable<z.ZodString>;
								customer_code: z.ZodString;
								risk_action: z.ZodString;
							},
							z.core.$strip
						>;
						authorization: z.ZodObject<
							{
								bank: z.ZodOptional<z.ZodNullable<z.ZodString>>;
								account_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
								authorization_code: z.ZodOptional<z.ZodString>;
								channel: z.ZodOptional<z.ZodString>;
								bin: z.ZodOptional<z.ZodString>;
								last4: z.ZodOptional<z.ZodString>;
								exp_month: z.ZodOptional<z.ZodString>;
								exp_year: z.ZodOptional<z.ZodString>;
								card_type: z.ZodOptional<z.ZodString>;
								country_code: z.ZodOptional<z.ZodString>;
								brand: z.ZodOptional<z.ZodString>;
							},
							z.core.$strip
						>;
					},
					z.core.$strip
				>;
			},
			z.core.$strip
		>,
		z.ZodObject<
			{
				event: z.ZodLiteral<"transfer.success">;
				data: z.ZodObject<
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
						domain: z.ZodString;
						failures: z.ZodNullable<z.ZodUnknown>;
						id: z.ZodNumber;
						integration: z.ZodObject<
							{
								id: z.ZodNumber;
								is_live: z.ZodBoolean;
								business_name: z.ZodString;
							},
							z.core.$strip
						>;
						reason: z.ZodString;
						reference: z.ZodString;
						source: z.ZodString;
						source_details: z.ZodNullable<z.ZodUnknown>;
						status: z.ZodString;
						titan_code: z.ZodNullable<z.ZodString>;
						transfer_code: z.ZodString;
						transferred_at: z.ZodNullable<z.ZodISODateTime>;
						session: z.ZodObject<
							{
								provider: z.ZodNullable<z.ZodString>;
								id: z.ZodNullable<z.ZodString>;
							},
							z.core.$strip
						>;
						created_at: z.ZodOptional<z.ZodISODateTime>;
						updated_at: z.ZodOptional<z.ZodISODateTime>;
						recipient: z.ZodObject<
							{
								active: z.ZodBoolean;
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
								description: z.ZodNullable<z.ZodString>;
								domain: z.ZodString;
								email: z.ZodNullable<z.ZodEmail>;
								id: z.ZodNumber;
								integration: z.ZodNumber;
								metadata: z.ZodNullable<z.ZodAny>;
								name: z.ZodString;
								recipient_code: z.ZodString;
								type: z.ZodString;
								is_deleted: z.ZodBoolean;
								created_at: z.ZodOptional<z.ZodISODateTime>;
								updated_at: z.ZodOptional<z.ZodISODateTime>;
								details: z.ZodObject<
									{
										account_number: z.ZodString;
										account_name: z.ZodNullable<z.ZodString>;
										bank_code: z.ZodString;
										bank_name: z.ZodString;
									},
									z.core.$strip
								>;
							},
							z.core.$strip
						>;
					},
					z.core.$strip
				>;
			},
			z.core.$strip
		>,
		z.ZodObject<
			{
				event: z.ZodLiteral<"transfer.failed">;
				data: z.ZodObject<
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
						domain: z.ZodString;
						failures: z.ZodNullable<z.ZodUnknown>;
						id: z.ZodNumber;
						integration: z.ZodObject<
							{
								id: z.ZodNumber;
								is_live: z.ZodBoolean;
								business_name: z.ZodString;
							},
							z.core.$strip
						>;
						reason: z.ZodString;
						reference: z.ZodString;
						source: z.ZodString;
						source_details: z.ZodNullable<z.ZodUnknown>;
						status: z.ZodString;
						titan_code: z.ZodNullable<z.ZodString>;
						transfer_code: z.ZodString;
						transferred_at: z.ZodNullable<z.ZodISODateTime>;
						session: z.ZodObject<
							{
								provider: z.ZodNullable<z.ZodString>;
								id: z.ZodNullable<z.ZodString>;
							},
							z.core.$strip
						>;
						created_at: z.ZodOptional<z.ZodISODateTime>;
						updated_at: z.ZodOptional<z.ZodISODateTime>;
						recipient: z.ZodObject<
							{
								active: z.ZodBoolean;
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
								description: z.ZodNullable<z.ZodString>;
								domain: z.ZodString;
								email: z.ZodNullable<z.ZodEmail>;
								id: z.ZodNumber;
								integration: z.ZodNumber;
								metadata: z.ZodNullable<z.ZodAny>;
								name: z.ZodString;
								recipient_code: z.ZodString;
								type: z.ZodString;
								is_deleted: z.ZodBoolean;
								created_at: z.ZodOptional<z.ZodISODateTime>;
								updated_at: z.ZodOptional<z.ZodISODateTime>;
								details: z.ZodObject<
									{
										account_number: z.ZodString;
										account_name: z.ZodNullable<z.ZodString>;
										bank_code: z.ZodString;
										bank_name: z.ZodString;
										authorization_code: z.ZodNullable<z.ZodString>;
									},
									z.core.$strip
								>;
							},
							z.core.$strip
						>;
					},
					z.core.$strip
				>;
			},
			z.core.$strip
		>,
		z.ZodObject<
			{
				event: z.ZodLiteral<"transfer.reversed">;
				data: z.ZodObject<
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
						domain: z.ZodString;
						failures: z.ZodNullable<z.ZodUnknown>;
						id: z.ZodNumber;
						integration: z.ZodObject<
							{
								id: z.ZodNumber;
								is_live: z.ZodBoolean;
								business_name: z.ZodString;
							},
							z.core.$strip
						>;
						reason: z.ZodString;
						reference: z.ZodString;
						source: z.ZodString;
						source_details: z.ZodNullable<z.ZodUnknown>;
						status: z.ZodString;
						titan_code: z.ZodNullable<z.ZodString>;
						transfer_code: z.ZodString;
						transferred_at: z.ZodNullable<z.ZodISODateTime>;
						session: z.ZodObject<
							{
								provider: z.ZodNullable<z.ZodString>;
								id: z.ZodNullable<z.ZodString>;
							},
							z.core.$strip
						>;
						created_at: z.ZodOptional<z.ZodISODateTime>;
						updated_at: z.ZodOptional<z.ZodISODateTime>;
						recipient: z.ZodObject<
							{
								active: z.ZodBoolean;
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
								description: z.ZodNullable<z.ZodString>;
								domain: z.ZodString;
								email: z.ZodNullable<z.ZodEmail>;
								id: z.ZodNumber;
								integration: z.ZodNumber;
								metadata: z.ZodNullable<z.ZodAny>;
								name: z.ZodString;
								recipient_code: z.ZodString;
								type: z.ZodString;
								is_deleted: z.ZodBoolean;
								created_at: z.ZodOptional<z.ZodISODateTime>;
								updated_at: z.ZodOptional<z.ZodISODateTime>;
								details: z.ZodObject<
									{
										account_number: z.ZodString;
										account_name: z.ZodNullable<z.ZodString>;
										bank_code: z.ZodString;
										bank_name: z.ZodString;
										authorization_code: z.ZodNullable<z.ZodString>;
									},
									z.core.$strip
								>;
							},
							z.core.$strip
						>;
					},
					z.core.$strip
				>;
			},
			z.core.$strip
		>,
	]
> = z.discriminatedUnion("event", [
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
