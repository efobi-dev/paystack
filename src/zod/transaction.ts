import { z } from "zod";
import {
	authorization,
	currency,
	customer,
	genericInput,
	genericResponse,
	history,
	log,
	plan,
	subaccount,
} from ".";
import { baseSplitSchema } from "./split";

export const txnInitializeInput: z.ZodObject<{
	amount: z.ZodString;
	email: z.ZodEmail;
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
	reference: z.ZodOptional<z.ZodString>;
	callback_url: z.ZodOptional<z.ZodURL>;
	plan: z.ZodOptional<z.ZodString>;
	invoice_limit: z.ZodOptional<z.ZodNumber>;
	metadata: z.ZodOptional<z.ZodAny>;
	channels: z.ZodOptional<
		z.ZodArray<
			z.ZodEnum<{
				mobile_money: "mobile_money";
				card: "card";
				bank: "bank";
				apple_pay: "apple_pay";
				ussd: "ussd";
				qr: "qr";
				bank_transfer: "bank_transfer";
				eft: "eft";
			}>
		>
	>;
	split_code: z.ZodOptional<z.ZodString>;
	subaccount: z.ZodOptional<z.ZodString>;
	transaction_charge: z.ZodOptional<z.ZodString>;
	bearer: z.ZodOptional<
		z.ZodEnum<{
			subaccount: "subaccount";
			account: "account";
		}>
	>;
}> = z.object({
	amount: z.string(),
	email: z.email(),
	currency: z.optional(currency),
	reference: z.string().optional(),
	callback_url: z.url().optional(),
	plan: z.string().optional(),
	invoice_limit: z.number().optional(),
	metadata: z.any().optional(),
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

export const txnInitializeSuccess: z.ZodObject<{
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
			authorization_url: z.ZodURL;
			access_code: z.ZodString;
			reference: z.ZodString;
		},
		z.core.$strip
	>;
}> = genericResponse.extend({
	data: z.object({
		authorization_url: z.url(),
		access_code: z.string(),
		reference: z.string(),
	}),
});

export const transactionShared: z.ZodObject<{
	id: z.ZodNumber;
	domain: z.ZodString;
	status: z.ZodString;
	reference: z.ZodString;
	receipt_number: z.ZodNullable<z.ZodString>;
	amount: z.ZodNumber;
	message: z.ZodNullable<z.ZodString>;
	gateway_response: z.ZodString;
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
	ip_address: z.ZodNullable<z.ZodString>;
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
	fees: z.ZodNullable<z.ZodNumber>;
	fees_split: z.ZodNullable<z.ZodUnknown>;
	authorization: z.ZodNullable<
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
	order_id: z.ZodNullable<z.ZodString>;
	paidAt: z.ZodNullable<z.ZodISODateTime>;
	createdAt: z.ZodISODateTime;
	requested_amount: z.ZodNumber;
	pos_transaction_data: z.ZodNullable<z.ZodUnknown>;
	connect: z.ZodNullable<z.ZodUnknown>;
}> = z.object({
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
});

const transaction = transactionShared.extend({
	metadata: z.any().nullable(),
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
});

const transactionVerify = transactionShared.extend({
	metadata: z.any(),
	customer: customer.extend({
		metadata: z.any().nullable(),
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
});

export const txnVerifySuccess: z.ZodObject<{
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
			id: z.ZodNumber;
			domain: z.ZodString;
			status: z.ZodString;
			reference: z.ZodString;
			receipt_number: z.ZodNullable<z.ZodString>;
			amount: z.ZodNumber;
			message: z.ZodNullable<z.ZodString>;
			gateway_response: z.ZodString;
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
			ip_address: z.ZodNullable<z.ZodString>;
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
			fees: z.ZodNullable<z.ZodNumber>;
			fees_split: z.ZodNullable<z.ZodUnknown>;
			authorization: z.ZodNullable<
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
			order_id: z.ZodNullable<z.ZodString>;
			paidAt: z.ZodNullable<z.ZodISODateTime>;
			createdAt: z.ZodISODateTime;
			requested_amount: z.ZodNumber;
			pos_transaction_data: z.ZodNullable<z.ZodUnknown>;
			connect: z.ZodNullable<z.ZodUnknown>;
			metadata: z.ZodAny;
			customer: z.ZodObject<
				{
					id: z.ZodNumber;
					first_name: z.ZodNullable<z.ZodString>;
					last_name: z.ZodNullable<z.ZodString>;
					email: z.ZodEmail;
					phone: z.ZodNullable<z.ZodString>;
					customer_code: z.ZodString;
					risk_action: z.ZodString;
					metadata: z.ZodNullable<z.ZodAny>;
					international_format_phone: z.ZodNullable<z.ZodString>;
				},
				z.core.$strip
			>;
			plan: z.ZodNullable<
				z.ZodObject<
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
				>
			>;
			split: z.ZodPipe<
				z.ZodPipe<z.ZodUnknown, z.ZodTransform<unknown, unknown>>,
				z.ZodNullable<
					z.ZodObject<
						{
							id: z.ZodNumber;
							name: z.ZodString;
							type: z.ZodEnum<{
								flat: "flat";
								percentage: "percentage";
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
							integration: z.ZodNumber;
							domain: z.ZodString;
							split_code: z.ZodString;
							active: z.ZodBoolean;
							bearer_type: z.ZodEnum<{
								subaccount: "subaccount";
								account: "account";
								"all-proportional": "all-proportional";
								all: "all";
							}>;
							createdAt: z.ZodISODateTime;
							updatedAt: z.ZodISODateTime;
							is_dynamic: z.ZodBoolean;
							subaccounts: z.ZodArray<
								z.ZodObject<
									{
										subaccount: z.ZodObject<
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
										>;
										share: z.ZodNumber;
									},
									z.core.$strip
								>
							>;
						},
						z.core.$strip
					>
				>
			>;
			source: z.ZodNullable<z.ZodUnknown>;
			fees_breakdown: z.ZodNullable<z.ZodUnknown>;
			transaction_date: z.ZodString;
			plan_object: z.ZodRecord<z.ZodString, z.ZodUnknown>;
			subaccount: z.ZodPipe<
				z.ZodPipe<z.ZodUnknown, z.ZodTransform<unknown, unknown>>,
				z.ZodNullable<
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
				>
			>;
		},
		z.core.$strip
	>;
}> = genericResponse.extend({
	data: transactionVerify,
});

export const txnListInput: z.ZodObject<{
	perPage: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
	page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
	to: z.ZodOptional<z.ZodISODateTime>;
	customer: z.ZodOptional<z.ZodString>;
	terminalId: z.ZodOptional<z.ZodString>;
	status: z.ZodOptional<
		z.ZodEnum<{
			success: "success";
			failed: "failed";
			abandoned: "abandoned";
		}>
	>;
	from: z.ZodOptional<z.ZodDate>;
}> = genericInput.extend({
	customer: z.string().optional(),
	terminalId: z.string().optional(),
	status: z.enum(["success", "failed", "abandoned"]).optional(),
	from: z.date().optional(),
});

export const txnSingleSuccess: z.ZodObject<{
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
			id: z.ZodNumber;
			domain: z.ZodString;
			status: z.ZodString;
			reference: z.ZodString;
			receipt_number: z.ZodNullable<z.ZodString>;
			amount: z.ZodNumber;
			message: z.ZodNullable<z.ZodString>;
			gateway_response: z.ZodString;
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
			ip_address: z.ZodNullable<z.ZodString>;
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
			fees: z.ZodNullable<z.ZodNumber>;
			fees_split: z.ZodNullable<z.ZodUnknown>;
			authorization: z.ZodNullable<
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
			order_id: z.ZodNullable<z.ZodString>;
			paidAt: z.ZodNullable<z.ZodISODateTime>;
			createdAt: z.ZodISODateTime;
			requested_amount: z.ZodNumber;
			pos_transaction_data: z.ZodNullable<z.ZodUnknown>;
			connect: z.ZodNullable<z.ZodUnknown>;
			metadata: z.ZodNullable<z.ZodAny>;
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
			plan: z.ZodNullable<
				z.ZodObject<
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
				>
			>;
			split: z.ZodNullable<
				z.ZodObject<
					{
						id: z.ZodNumber;
						name: z.ZodString;
						type: z.ZodEnum<{
							flat: "flat";
							percentage: "percentage";
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
						integration: z.ZodNumber;
						domain: z.ZodString;
						split_code: z.ZodString;
						active: z.ZodBoolean;
						bearer_type: z.ZodEnum<{
							subaccount: "subaccount";
							account: "account";
							"all-proportional": "all-proportional";
							all: "all";
						}>;
						createdAt: z.ZodISODateTime;
						updatedAt: z.ZodISODateTime;
						is_dynamic: z.ZodBoolean;
						subaccounts: z.ZodArray<
							z.ZodObject<
								{
									subaccount: z.ZodObject<
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
									>;
									share: z.ZodNumber;
								},
								z.core.$strip
							>
						>;
					},
					z.core.$strip
				>
			>;
			subaccount: z.ZodNullable<
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
			source: z.ZodNullable<
				z.ZodObject<
					{
						source: z.ZodString;
						type: z.ZodString;
						identifier: z.ZodNullable<z.ZodString>;
						entry_point: z.ZodString;
					},
					z.core.$strip
				>
			>;
		},
		z.core.$strip
	>;
}> = genericResponse.extend({
	data: transaction,
});

export const txnListSuccess: z.ZodObject<{
	status: z.ZodBoolean;
	message: z.ZodString;
	data: z.ZodArray<
		z.ZodObject<
			{
				id: z.ZodNumber;
				domain: z.ZodString;
				status: z.ZodString;
				reference: z.ZodString;
				receipt_number: z.ZodNullable<z.ZodString>;
				amount: z.ZodNumber;
				message: z.ZodNullable<z.ZodString>;
				gateway_response: z.ZodString;
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
				ip_address: z.ZodNullable<z.ZodString>;
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
				fees: z.ZodNullable<z.ZodNumber>;
				fees_split: z.ZodNullable<z.ZodUnknown>;
				authorization: z.ZodNullable<
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
				order_id: z.ZodNullable<z.ZodString>;
				paidAt: z.ZodNullable<z.ZodISODateTime>;
				createdAt: z.ZodISODateTime;
				requested_amount: z.ZodNumber;
				pos_transaction_data: z.ZodNullable<z.ZodUnknown>;
				connect: z.ZodNullable<z.ZodUnknown>;
				metadata: z.ZodNullable<z.ZodAny>;
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
				plan: z.ZodNullable<
					z.ZodObject<
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
					>
				>;
				split: z.ZodNullable<
					z.ZodObject<
						{
							id: z.ZodNumber;
							name: z.ZodString;
							type: z.ZodEnum<{
								flat: "flat";
								percentage: "percentage";
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
							integration: z.ZodNumber;
							domain: z.ZodString;
							split_code: z.ZodString;
							active: z.ZodBoolean;
							bearer_type: z.ZodEnum<{
								subaccount: "subaccount";
								account: "account";
								"all-proportional": "all-proportional";
								all: "all";
							}>;
							createdAt: z.ZodISODateTime;
							updatedAt: z.ZodISODateTime;
							is_dynamic: z.ZodBoolean;
							subaccounts: z.ZodArray<
								z.ZodObject<
									{
										subaccount: z.ZodObject<
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
										>;
										share: z.ZodNumber;
									},
									z.core.$strip
								>
							>;
						},
						z.core.$strip
					>
				>;
				subaccount: z.ZodNullable<
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
				source: z.ZodNullable<
					z.ZodObject<
						{
							source: z.ZodString;
							type: z.ZodString;
							identifier: z.ZodNullable<z.ZodString>;
							entry_point: z.ZodString;
						},
						z.core.$strip
					>
				>;
			},
			z.core.$strip
		>
	>;
	meta: z.ZodObject<
		{
			next: z.ZodNullable<z.ZodString>;
			previous: z.ZodNullable<z.ZodString>;
			perPage: z.ZodNumber;
		},
		z.core.$strip
	>;
}> = genericResponse.extend({
	data: z.array(transaction),
	meta: z.object({
		next: z.nullable(z.string()),
		previous: z.nullable(z.string()),
		perPage: z.number(),
	}),
});

export const txnChargeInput: z.ZodObject<{
	amount: z.ZodNumber;
	email: z.ZodEmail;
	authorization_code: z.ZodString;
	reference: z.ZodOptional<z.ZodString>;
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
	metadata: z.ZodOptional<z.ZodAny>;
	channels: z.ZodOptional<
		z.ZodArray<
			z.ZodEnum<{
				card: "card";
				bank: "bank";
			}>
		>
	>;
	subaccount: z.ZodOptional<z.ZodString>;
	transaction_charge: z.ZodOptional<z.ZodNumber>;
	bearer: z.ZodOptional<
		z.ZodDefault<
			z.ZodEnum<{
				subaccount: "subaccount";
				account: "account";
			}>
		>
	>;
	queue: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}> = z.object({
	amount: z.number(),
	email: z.email(),
	authorization_code: z.string(),
	reference: z.string().optional(),
	currency: z.optional(currency),
	metadata: z.any().optional(),
	channels: z.array(z.enum(["card", "bank"])).optional(),
	subaccount: z.string().optional(),
	transaction_charge: z.number().optional(),
	bearer: z.enum(["account", "subaccount"]).default("account").optional(),
	queue: z.boolean().default(false).optional(),
});

export const txnChargeSuccess: z.ZodObject<{
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
			transaction_date: z.ZodISODateTime;
			status: z.ZodString;
			reference: z.ZodString;
			domain: z.ZodString;
			metadata: z.ZodNullable<z.ZodAny>;
			gateway_response: z.ZodString;
			message: z.ZodNullable<z.ZodString>;
			channel: z.ZodString;
			ip_address: z.ZodNullable<z.ZodIPv4>;
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
			plan: z.ZodNullable<z.ZodNumber>;
			id: z.ZodNumber;
		},
		z.core.$strip
	>;
}> = genericResponse.extend({
	data: z.object({
		amount: z.number(),
		currency,
		transaction_date: z.iso.datetime(),
		status: z.string(),
		reference: z.string(),
		domain: z.string(),
		metadata: z.nullable(z.any()),
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
	}),
});

export const txnTimelineSuccess: z.ZodObject<{
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
			start_time: z.ZodISOTime;
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
	>;
}> = genericResponse.extend({
	data: z.object({
		start_time: z.iso.time(),
		time_spent: z.number(),
		attempts: z.number(),
		errors: z.number(),
		success: z.boolean(),
		mobile: z.boolean(),
		input: z.array(z.unknown()),
		history,
	}),
});

export const txnTotalsSuccess: z.ZodObject<{
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
			total_transactions: z.ZodNumber;
			total_volume: z.ZodNumber;
			total_volume_by_currency: z.ZodArray<
				z.ZodObject<
					{
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
						amount: z.ZodNumber;
					},
					z.core.$strip
				>
			>;
			pending_transfers: z.ZodNumber;
			pending_transfers_by_currency: z.ZodArray<
				z.ZodObject<
					{
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
						amount: z.ZodNumber;
					},
					z.core.$strip
				>
			>;
		},
		z.core.$strip
	>;
}> = genericResponse.extend({
	data: z.object({
		total_transactions: z.number(),
		total_volume: z.number(),
		total_volume_by_currency: z.array(
			z.object({ currency, amount: z.number() }),
		),
		pending_transfers: z.number(),
		pending_transfers_by_currency: z.array(
			z.object({ currency, amount: z.number() }),
		),
	}),
});

export const txnExportInput: z.ZodObject<{
	perPage: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
	page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
	from: z.ZodOptional<z.ZodISODateTime>;
	to: z.ZodOptional<z.ZodISODateTime>;
	customer: z.ZodOptional<z.ZodString>;
	status: z.ZodOptional<
		z.ZodEnum<{
			success: "success";
			failed: "failed";
			abandoned: "abandoned";
		}>
	>;
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
	amount: z.ZodOptional<z.ZodNumber>;
	settled: z.ZodOptional<z.ZodBoolean>;
	settlement: z.ZodOptional<z.ZodNumber>;
	payment_page: z.ZodOptional<z.ZodNumber>;
}> = genericInput.extend({
	customer: z.string().optional(),
	status: z.enum(["success", "failed", "abandoned"]).optional(),
	currency: z.optional(currency),
	amount: z.number().optional(),
	settled: z.boolean().optional(),
	settlement: z.number().optional(),
	payment_page: z.number().optional(),
});

export const txnExportSuccess: z.ZodObject<{
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
			path: z.ZodURL;
			expiresAt: z.ZodISODateTime;
		},
		z.core.$strip
	>;
}> = genericResponse.extend({
	data: z.object({
		path: z.url(),
		expiresAt: z.iso.datetime(),
	}),
});

export const txnPartialDebitInput: z.ZodObject<{
	authorization_code: z.ZodString;
	currency: z.ZodDefault<
		z.ZodEnum<{
			NGN: "NGN";
			GHS: "GHS";
		}>
	>;
	amount: z.ZodNumber;
	email: z.ZodEmail;
	reference: z.ZodOptional<z.ZodString>;
	at_least: z.ZodOptional<z.ZodNumber>;
}> = z.object({
	authorization_code: z.string(),
	currency: z.enum(["NGN", "GHS"]).default("NGN"),
	amount: z.number(),
	email: z.email(),
	reference: z.string().optional(),
	at_least: z.number().optional(),
});

export const txnPartialDebitSuccess: z.ZodObject<{
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
			transaction_date: z.ZodISODateTime;
			status: z.ZodString;
			reference: z.ZodString;
			domain: z.ZodString;
			metadata: z.ZodNullable<z.ZodAny>;
			gateway_response: z.ZodString;
			message: z.ZodNullable<z.ZodString>;
			channel: z.ZodString;
			ip_address: z.ZodNullable<z.ZodIPv4>;
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
			plan: z.ZodNullable<z.ZodNumber>;
			id: z.ZodNumber;
			requested_amount: z.ZodNumber;
		},
		z.core.$strip
	>;
}> = genericResponse.extend({
	data: txnChargeSuccess.shape.data.extend({
		requested_amount: z.number(),
	}),
});

// Explicit type aliases — prevents TypeScript from inline-expanding z.infer<> in .d.ts files
export type TxnInitializeInput = z.infer<typeof txnInitializeInput>;
export type TxnInitializeSuccess = z.infer<typeof txnInitializeSuccess>;
export type TransactionShared = z.infer<typeof transactionShared>;
export type TxnVerifySuccess = z.infer<typeof txnVerifySuccess>;
export type TxnListInput = z.infer<typeof txnListInput>;
export type TxnSingleSuccess = z.infer<typeof txnSingleSuccess>;
export type TxnListSuccess = z.infer<typeof txnListSuccess>;
export type TxnChargeInput = z.infer<typeof txnChargeInput>;
export type TxnChargeSuccess = z.infer<typeof txnChargeSuccess>;
export type TxnTimelineSuccess = z.infer<typeof txnTimelineSuccess>;
export type TxnTotalsSuccess = z.infer<typeof txnTotalsSuccess>;
export type TxnExportInput = z.infer<typeof txnExportInput>;
export type TxnExportSuccess = z.infer<typeof txnExportSuccess>;
export type TxnPartialDebitInput = z.infer<typeof txnPartialDebitInput>;
export type TxnPartialDebitSuccess = z.infer<typeof txnPartialDebitSuccess>;
