import {
	type PaystackWebhookPayload,
	paystackWebhookSchema,
} from "../zod/webhook";
import { Fetcher } from "./fetcher";

type WebhookHandler<T extends PaystackWebhookPayload> = (
	payload: T["data"],
) => void | Promise<void>;

type HandlersMap = {
	[K in PaystackWebhookPayload["event"]]?: WebhookHandler<
		Extract<PaystackWebhookPayload, { event: K }>
	>;
};

/**
 * The Webhook class provides methods for verifying and processing Paystack webhooks.
 */
export class Webhook extends Fetcher {
	private handlers: HandlersMap = {};

	/**
	 * Verifies the signature of an incoming webhook request using the Web Crypto API.
	 * @param rawBody - The raw, unparsed request body.
	 * @param signature - The value of the 'x-paystack-signature' header.
	 * @returns {Promise<boolean>} - True if the signature is valid, false otherwise.
	 */
	/**
	 * Verifies the signature of an incoming webhook request using the Web Crypto API.
	 * @param rawBody - The raw, unparsed request body.
	 * @param signature - The value of the 'x-paystack-signature' header.
	 * @returns True if the signature is valid, false otherwise.
	 */
	private async verifySignature(
		rawBody: string,
		signature: string,
	): Promise<boolean> {
		const secretKeyData = new TextEncoder().encode(this.secretKey);
		const key = await crypto.subtle.importKey(
			"raw",
			secretKeyData,
			{ name: "HMAC", hash: "SHA-512" },
			false,
			["sign"],
		);
		const signatureData = new TextEncoder().encode(rawBody);
		const hashBuffer = await crypto.subtle.sign("HMAC", key, signatureData);

		// Convert ArrayBuffer to hex string
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashHex = hashArray
			.map((b) => b.toString(16).padStart(2, "0"))
			.join("");

		return hashHex === signature;
	}

	/**
	 * Registers a handler function for a specific webhook event.
	 * @param event - The event to listen for (e.g., 'charge.success').
	 * @param handler - The function to execute when the event is received.
	 */
	/**
	 * Registers a handler function for a specific webhook event.
	 * @param event - The event to listen for (e.g., 'charge.success').
	 * @param handler - The function to execute when the event is received.
	 * @returns The Webhook instance for chaining.
	 */
	public on<T extends PaystackWebhookPayload["event"]>(
		event: T,
		handler: WebhookHandler<Extract<PaystackWebhookPayload, { event: T }>>,
	): this {
		// biome-ignore lint/suspicious/noExplicitAny: <Type assertion is needed due to TypeScript's limitation with mapped types>
		(this.handlers as any)[event] = handler;
		return this; // Allow chaining
	}

	/**
	 * Processes an incoming webhook request. Verifies, parses, and dispatches it.
	 * This is the platform-agnostic core.
	 * @param rawBody - The raw, unparsed request body.
	 * @param signature - The value of the 'x-paystack-signature' header.
	 * @returns The parsed and validated payload if successful.
	 * @throws An error if verification or parsing fails.
	 */
	/**
	 * Processes an incoming webhook request. Verifies, parses, and dispatches it.
	 * This is the platform-agnostic core.
	 * @param rawBody - The raw, unparsed request body.
	 * @param signature - The value of the 'x-paystack-signature' header.
	 * @returns The parsed and validated payload if successful.
	 * @throws An error if verification or parsing fails.
	 */
	public async process(
		rawBody: string,
		signature: string | null | undefined,
	): Promise<
		| {
				event: "customeridentification.failed";
				data: {
					customer_id: string;
					customer_code: string;
					email: string;
					identification: {
						country: "NG" | "GH";
						type: string;
						bvn: string;
						account_number: string;
						bank_code: string;
					};
				};
				reason: string;
		  }
		| {
				event: "customeridentification.success";
				data: {
					customer_id: string;
					customer_code: string;
					email: string;
					identification: {
						country: "NG" | "GH";
						type: string;
						value: string;
					};
				};
		  }
		| {
				event: "charge.dispute.create";
				data: {
					id: number;
					refund_amount: number;
					currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
					status: string;
					resolution: unknown;
					domain: string;
					transaction: {
						id: number;
						domain: string;
						status: string;
						reference: string;
						amount: number;
						message: string | null;
						gateway_response: string;
						paid_at: string;
						created_at: string;
						channel: string;
						currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
						ip_address: string | null;
						metadata: any;
						log: {
							start_time: number;
							time_spent: number;
							attempts: number;
							errors: number;
							success: boolean;
							mobile: boolean;
							input: unknown[];
							history: {
								type: string;
								message: string;
								time: number;
							}[];
						} | null;
						fees: number;
						fees_split: unknown;
						customer: {
							international_format_phone: string | null;
						};
						plan: {
							id: number;
							name: string;
							plan_code: string;
							description: string | null;
							amount: number;
							interval: string;
							send_invoices: boolean;
							send_sms: boolean;
							currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
						};
						order_id: string | null;
						paidAt: string;
						requested_amount: number;
						pos_transaction_data: unknown;
						authorization?:
							| {
									authorization_code?: string | undefined;
									bin?: string | undefined;
									last4?: string | undefined;
									exp_month?: string | undefined;
									exp_year?: string | undefined;
									channel?: string | undefined;
									card_type?: string | undefined;
									bank?: string | null | undefined;
									country_code?: string | undefined;
									brand?: string | undefined;
									reusable?: boolean | undefined;
									signature?: string | undefined;
									account_name?: string | null | undefined;
							  }
							| undefined;
						subaccount?:
							| {
									id: number;
									subaccount_code: string;
									business_name: string;
									description: string;
									primary_contact_name: string | null;
									primary_contact_email: string | null;
									primary_contact_phone: string | null;
									metadata: any;
									settlement_bank: string;
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									account_number: string;
							  }
							| undefined;
						split?: Record<string, never> | undefined;
					};
					transaction_reference: string | null;
					category: string;
					customer: {
						id: number;
						first_name: string | null;
						last_name: string | null;
						email: string;
						phone: string | null;
						metadata: any;
						customer_code: string;
						risk_action: string;
						international_format_phone: string | null;
					};
					bin: string;
					last4: string;
					dueAt: string;
					resolvedAt: string | null;
					evidence: unknown;
					attachments: unknown;
					note: unknown;
					history: {
						status: string;
						by: string;
						created_at: string;
					}[];
					messages: {
						sender: string;
						body: string;
						created_at: string;
					}[];
					created_at: string;
					updated_at: string;
				};
		  }
		| {
				event: "charge.dispute.remind";
				data: {
					id: number;
					refund_amount: number;
					currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
					status: string;
					resolution: unknown;
					domain: string;
					transaction: {
						id: number;
						domain: string;
						status: string;
						reference: string;
						amount: number;
						message: string | null;
						gateway_response: string;
						paid_at: string;
						created_at: string;
						channel: string;
						currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
						ip_address: string | null;
						metadata: any;
						log: {
							start_time: number;
							time_spent: number;
							attempts: number;
							errors: number;
							success: boolean;
							mobile: boolean;
							input: unknown[];
							history: {
								type: string;
								message: string;
								time: number;
							}[];
						} | null;
						fees: number;
						fees_split: unknown;
						customer: {
							international_format_phone: string | null;
						};
						plan: {
							id: number;
							name: string;
							plan_code: string;
							description: string | null;
							amount: number;
							interval: string;
							send_invoices: boolean;
							send_sms: boolean;
							currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
						};
						order_id: string | null;
						paidAt: string;
						requested_amount: number;
						pos_transaction_data: unknown;
						authorization?:
							| {
									authorization_code?: string | undefined;
									bin?: string | undefined;
									last4?: string | undefined;
									exp_month?: string | undefined;
									exp_year?: string | undefined;
									channel?: string | undefined;
									card_type?: string | undefined;
									bank?: string | null | undefined;
									country_code?: string | undefined;
									brand?: string | undefined;
									reusable?: boolean | undefined;
									signature?: string | undefined;
									account_name?: string | null | undefined;
							  }
							| undefined;
						subaccount?:
							| {
									id: number;
									subaccount_code: string;
									business_name: string;
									description: string;
									primary_contact_name: string | null;
									primary_contact_email: string | null;
									primary_contact_phone: string | null;
									metadata: any;
									settlement_bank: string;
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									account_number: string;
							  }
							| undefined;
						split?: Record<string, never> | undefined;
					};
					transaction_reference: string | null;
					category: string;
					customer: {
						id: number;
						first_name: string | null;
						last_name: string | null;
						email: string;
						phone: string | null;
						metadata: any;
						customer_code: string;
						risk_action: string;
						international_format_phone: string | null;
					};
					bin: string;
					last4: string;
					dueAt: string;
					resolvedAt: string | null;
					evidence: unknown;
					attachments: unknown;
					note: unknown;
					history: {
						status: string;
						by: string;
						created_at: string;
					}[];
					messages: {
						sender: string;
						body: string;
						created_at: string;
					}[];
					created_at: string;
					updated_at: string;
				};
		  }
		| {
				event: "charge.dispute.resolve";
				data: {
					id: number;
					refund_amount: number;
					currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
					status: string;
					resolution: unknown;
					domain: string;
					transaction: {
						id: number;
						domain: string;
						status: string;
						reference: string;
						amount: number;
						message: string | null;
						gateway_response: string;
						paid_at: string;
						created_at: string;
						channel: string;
						currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
						ip_address: string | null;
						metadata: any;
						log: {
							start_time: number;
							time_spent: number;
							attempts: number;
							errors: number;
							success: boolean;
							mobile: boolean;
							input: unknown[];
							history: {
								type: string;
								message: string;
								time: number;
							}[];
						} | null;
						fees: number;
						fees_split: unknown;
						customer: {
							international_format_phone: string | null;
						};
						plan: {
							id: number;
							name: string;
							plan_code: string;
							description: string | null;
							amount: number;
							interval: string;
							send_invoices: boolean;
							send_sms: boolean;
							currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
						};
						order_id: string | null;
						paidAt: string;
						requested_amount: number;
						pos_transaction_data: unknown;
						authorization?:
							| {
									authorization_code?: string | undefined;
									bin?: string | undefined;
									last4?: string | undefined;
									exp_month?: string | undefined;
									exp_year?: string | undefined;
									channel?: string | undefined;
									card_type?: string | undefined;
									bank?: string | null | undefined;
									country_code?: string | undefined;
									brand?: string | undefined;
									reusable?: boolean | undefined;
									signature?: string | undefined;
									account_name?: string | null | undefined;
							  }
							| undefined;
						subaccount?:
							| {
									id: number;
									subaccount_code: string;
									business_name: string;
									description: string;
									primary_contact_name: string | null;
									primary_contact_email: string | null;
									primary_contact_phone: string | null;
									metadata: any;
									settlement_bank: string;
									currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
									account_number: string;
							  }
							| undefined;
						split?: Record<string, never> | undefined;
					};
					transaction_reference: string | null;
					category: string;
					customer: {
						id: number;
						first_name: string | null;
						last_name: string | null;
						email: string;
						phone: string | null;
						metadata: any;
						customer_code: string;
						risk_action: string;
						international_format_phone: string | null;
					};
					bin: string;
					last4: string;
					dueAt: string;
					resolvedAt: string | null;
					evidence: unknown;
					attachments: unknown;
					note: unknown;
					history: {
						status: string;
						by: string;
						created_at: string;
					}[];
					messages: {
						sender: string;
						body: string;
						created_at: string;
					}[];
					created_at: string;
					updated_at: string;
				};
		  }
		| {
				event: "dedicatedaccount.assign.failed";
				data: {
					customer: {
						id: number;
						first_name: string | null;
						last_name: string | null;
						email: string;
						phone: string | null;
						metadata: any;
						customer_code: string;
						risk_action: string;
						international_format_phone: string | null;
					};
					dedicated_account: unknown;
					identification: {
						status: string;
					};
				};
		  }
		| {
				event: "dedicatedaccount.assign.success";
				data: {
					customer: {
						id: number;
						first_name: string | null;
						last_name: string | null;
						email: string;
						phone: string | null;
						metadata: any;
						customer_code: string;
						risk_action: string;
						international_format_phone: string | null;
					};
					dedicated_account: {
						bank: {
							name: string;
							id: number;
							slug: string;
						};
						account_name: string;
						account_number: string;
						assigned: boolean;
						currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
						metadata: any;
						active: boolean;
						id: number;
						created_at: string;
						updated_at: string;
					};
					assignment: {
						integration: number;
						assignee_id: number;
						assignee_type: string;
						expired: boolean;
						account_type: string;
						assigned_at: string;
						expired_at: string | null;
					};
				};
				identification: {
					status: string;
				};
		  }
		| {
				event: "invoice.create";
				data: {
					domain: string;
					invoice_code: string;
					amount: number;
					period_start: string;
					period_end: string;
					status: string;
					paid: boolean;
					paid_at: string | null;
					description: string | null;
					authorization: {
						authorization_code?: string | undefined;
						bin?: string | undefined;
						last4?: string | undefined;
						exp_month?: string | undefined;
						exp_year?: string | undefined;
						channel?: string | undefined;
						card_type?: string | undefined;
						bank?: string | null | undefined;
						country_code?: string | undefined;
						brand?: string | undefined;
						reusable?: boolean | undefined;
						signature?: string | undefined;
						account_name?: string | null | undefined;
					};
					subscription: {
						status: string;
						subscription_code: string;
						email_token: string;
						amount: number;
						cron_expression: string;
						next_payment_date: string;
						open_invoice: unknown;
					};
					customer: {
						first_name: string | null;
						last_name: string | null;
						phone: string | null;
						id: number;
						metadata: any;
						email: string;
						customer_code: string;
						risk_action: string;
					};
					transaction: {
						reference: string;
						status: string;
						amount: number;
						currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
					};
					created_at: string;
				};
		  }
		| {
				event: "invoice.payment_failed";
				data: {
					domain: string;
					invoice_code: string;
					amount: number;
					period_start: string;
					period_end: string;
					status: string;
					paid: boolean;
					paid_at: string | null;
					description: string | null;
					authorization: {
						authorization_code?: string | undefined;
						bin?: string | undefined;
						last4?: string | undefined;
						exp_month?: string | undefined;
						exp_year?: string | undefined;
						channel?: string | undefined;
						card_type?: string | undefined;
						bank?: string | null | undefined;
						country_code?: string | undefined;
						brand?: string | undefined;
						reusable?: boolean | undefined;
						signature?: string | undefined;
						account_name?: string | null | undefined;
					};
					subscription: {
						status: string;
						subscription_code: string;
						email_token: string;
						amount: number;
						cron_expression: string;
						next_payment_date: string;
						open_invoice: unknown;
					};
					customer: {
						first_name: string | null;
						last_name: string | null;
						phone: string | null;
						id: number;
						metadata: any;
						email: string;
						customer_code: string;
						risk_action: string;
					};
					transaction: {
						reference?: string | undefined;
						status?: string | undefined;
						amount?: number | undefined;
						currency?:
							| "NGN"
							| "USD"
							| "GHS"
							| "ZAR"
							| "KES"
							| "XOF"
							| undefined;
					};
					created_at: string;
				};
		  }
		| {
				event: "invoice.update";
				data: {
					domain: string;
					invoice_code: string;
					amount: number;
					period_start: string;
					period_end: string;
					status: string;
					paid: boolean;
					paid_at: string | null;
					description: string | null;
					authorization: {
						authorization_code?: string | undefined;
						bin?: string | undefined;
						last4?: string | undefined;
						exp_month?: string | undefined;
						exp_year?: string | undefined;
						channel?: string | undefined;
						card_type?: string | undefined;
						bank?: string | null | undefined;
						country_code?: string | undefined;
						brand?: string | undefined;
						reusable?: boolean | undefined;
						signature?: string | undefined;
						account_name?: string | null | undefined;
					};
					subscription: {
						status: string;
						subscription_code: string;
						email_token: string;
						amount: number;
						cron_expression: string;
						next_payment_date: string;
						open_invoice: unknown;
					};
					customer: {
						first_name: string | null;
						last_name: string | null;
						phone: string | null;
						id: number;
						metadata: any;
						email: string;
						customer_code: string;
						risk_action: string;
					};
					transaction: {
						reference: string;
						status: string;
						amount: number;
						currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
					};
				};
		  }
		| {
				event: "paymentrequest.pending";
				data: {
					id: number;
					domain: string;
					amount: number;
					currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
					due_date: string | null;
					has_invoice: boolean;
					invoice_number: string | null;
					description: string | null;
					pdf_url: string | null;
					line_items: unknown[];
					tax: unknown[];
					request_code: string;
					status: string;
					paid: boolean;
					paid_at: string | null;
					metadata: any;
					notifications: {
						sent_at: string;
						channel: string;
					}[];
					offline_reference: string | null;
					customer: number;
					created_at: string;
				};
		  }
		| {
				event: "paymentrequest.success";
				data: {
					id: number;
					domain: string;
					amount: number;
					currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
					due_date: string | null;
					has_invoice: boolean;
					invoice_number: string | null;
					description: string | null;
					pdf_url: string | null;
					line_items: unknown[];
					tax: unknown[];
					request_code: string;
					status: string;
					paid: boolean;
					paid_at: string | null;
					metadata: any;
					notifications: {
						sent_at: string;
						channel: string;
					}[];
					offline_reference: string | null;
					customer: number;
					created_at: string;
				};
		  }
		| {
				event: "refund.failed";
				data: {
					status: string;
					transaction_reference: string;
					amount: number;
					currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
					processor: string;
					customer: {
						first_name: string | null;
						last_name: string | null;
						email: string;
					};
					integration: number;
					domain: string;
					refund_reference: string;
				};
		  }
		| {
				event: "refund.pending";
				data: {
					status: string;
					transaction_reference: string;
					amount: number;
					currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
					processor: string;
					customer: {
						first_name: string | null;
						last_name: string | null;
						email: string;
					};
					integration: number;
					domain: string;
					refund_reference: string | null;
				};
		  }
		| {
				event: "refund.processed";
				data: {
					status: string;
					transaction_reference: string;
					amount: number;
					currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
					processor: string;
					customer: {
						first_name: string | null;
						last_name: string | null;
						email: string;
					};
					integration: number;
					domain: string;
					refund_reference: string;
				};
		  }
		| {
				event: "refund.processing";
				data: {
					status: string;
					transaction_reference: string;
					amount: number;
					currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
					processor: string;
					customer: {
						first_name: string | null;
						last_name: string | null;
						email: string;
					};
					integration: number;
					domain: string;
					refund_reference: string | null;
				};
		  }
		| {
				event: "subscription.create";
				data: {
					domain: string;
					status: string;
					subscription_code: string;
					amount: number;
					cron_expression: string;
					next_payment_date: string;
					open_invoice: unknown;
					plan: {
						id: number;
						name: string;
						plan_code: string;
						description: string | null;
						amount: number;
						interval: string;
						send_invoices: boolean;
						send_sms: boolean;
						currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
					};
					authorization: {
						bank?: string | null | undefined;
						account_name?: string | null | undefined;
						authorization_code?: string | undefined;
						channel?: string | undefined;
						bin?: string | undefined;
						last4?: string | undefined;
						exp_month?: string | undefined;
						exp_year?: string | undefined;
						card_type?: string | undefined;
						country_code?: string | undefined;
						brand?: string | undefined;
					};
					customer: {
						first_name: string | null;
						last_name: string | null;
						phone: string | null;
						metadata: any;
						email: string;
						customer_code: string;
						risk_action: string;
					};
					created_at: string;
					createdAt: string;
				};
		  }
		| {
				event: "subscription.disable";
				data: {
					domain: string;
					status: string;
					subscription_code: string;
					amount: number;
					cron_expression: string;
					next_payment_date: string;
					open_invoice: unknown;
					plan: {
						id: number;
						name: string;
						plan_code: string;
						description: string | null;
						amount: number;
						interval: string;
						send_invoices: boolean;
						send_sms: boolean;
						currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
					};
					authorization: {
						bank?: string | null | undefined;
						account_name?: string | null | undefined;
						authorization_code?: string | undefined;
						channel?: string | undefined;
						bin?: string | undefined;
						last4?: string | undefined;
						exp_month?: string | undefined;
						exp_year?: string | undefined;
						card_type?: string | undefined;
						country_code?: string | undefined;
						brand?: string | undefined;
					};
					customer: {
						first_name: string | null;
						last_name: string | null;
						phone: string | null;
						metadata: any;
						email: string;
						customer_code: string;
						risk_action: string;
					};
					created_at: string;
					email_token: string;
				};
		  }
		| {
				event: "subscription.not_renew";
				data: {
					id: number;
					domain: string;
					status: string;
					subscription_code: string;
					email_token: string;
					amount: number;
					cron_expression: string;
					next_payment_date: string;
					open_invoice: unknown;
					integration: number;
					plan: {
						id: number;
						name: string;
						plan_code: string;
						description: string | null;
						amount: number;
						interval: string;
						send_invoices: boolean;
						send_sms: boolean;
						currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
					};
					authorization: {
						bank?: string | null | undefined;
						account_name?: string | null | undefined;
						authorization_code?: string | undefined;
						channel?: string | undefined;
						bin?: string | undefined;
						last4?: string | undefined;
						exp_month?: string | undefined;
						exp_year?: string | undefined;
						card_type?: string | undefined;
						country_code?: string | undefined;
						brand?: string | undefined;
					};
					customer: {
						id: number;
						first_name: string | null;
						last_name: string | null;
						email: string;
						phone: string | null;
						metadata: any;
						customer_code: string;
						risk_action: string;
						international_format_phone: string | null;
					};
					invoices: unknown[];
					invoices_history: unknown[];
					invoice_limit: number;
					split_code: string | null;
					most_recent_invoice: unknown;
					created_at: string;
				};
		  }
		| {
				event: "subscription.expiring_cards";
				data: {
					expiry_date: string;
					description: string;
					brand: "visa" | "mastercard" | "verve";
					subscription: {
						id: number;
						subscription_code: string;
						amount: number;
						next_payment_date: string;
						plan: {
							name: string;
							id: number;
							plan_code: string;
							interval: string;
						};
					};
					customer: {
						first_name: string | null;
						last_name: string | null;
						id: number;
						email: string;
						customer_code: string;
					};
				}[];
		  }
		| {
				event: "charge.success";
				data: {
					status: string;
					message: string | null;
					currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
					id: number;
					domain: string;
					amount: number;
					reference: string;
					gateway_response: string;
					channel: string;
					ip_address: string | null;
					fees_split: unknown;
					order_id: string | null;
					requested_amount: number;
					pos_transaction_data: unknown;
					connect: unknown;
					log: {
						input: unknown[];
						success: boolean;
						errors: number;
						history: {
							type: string;
							message: string;
							time: number;
						}[];
						time_spent: number;
						attempts: number;
						mobile: boolean;
						authentication: string;
					} | null;
					metadata: any;
					paid_at: string;
					created_at: string;
					fees: number | null;
					customer: {
						first_name: string | null;
						last_name: string | null;
						phone: string | null;
						metadata: any;
						email: string;
						customer_code: string;
						risk_action: string;
					};
					authorization: {
						bank?: string | null | undefined;
						account_name?: string | null | undefined;
						authorization_code?: string | undefined;
						channel?: string | undefined;
						bin?: string | undefined;
						last4?: string | undefined;
						exp_month?: string | undefined;
						exp_year?: string | undefined;
						card_type?: string | undefined;
						country_code?: string | undefined;
						brand?: string | undefined;
					};
				};
		  }
		| {
				event: "transfer.success";
				data: {
					amount: number;
					currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
					domain: string;
					failures: unknown;
					id: number;
					integration: {
						id: number;
						is_live: boolean;
						business_name: string;
					};
					reason: string;
					reference: string;
					source: string;
					source_details: unknown;
					status: string;
					titan_code: string | null;
					transfer_code: string;
					transferred_at: string | null;
					session: {
						provider: string | null;
						id: string | null;
					};
					recipient: {
						active: boolean;
						currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
						description: string | null;
						domain: string;
						email: string | null;
						id: number;
						integration: number;
						metadata: any;
						name: string;
						recipient_code: string;
						type: string;
						is_deleted: boolean;
						details: {
							account_number: string;
							account_name: string | null;
							bank_code: string;
							bank_name: string;
						};
						created_at?: string | undefined;
						updated_at?: string | undefined;
					};
					created_at?: string | undefined;
					updated_at?: string | undefined;
				};
		  }
		| {
				event: "transfer.failed";
				data: {
					amount: number;
					currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
					domain: string;
					failures: unknown;
					id: number;
					integration: {
						id: number;
						is_live: boolean;
						business_name: string;
					};
					reason: string;
					reference: string;
					source: string;
					source_details: unknown;
					status: string;
					titan_code: string | null;
					transfer_code: string;
					transferred_at: string | null;
					session: {
						provider: string | null;
						id: string | null;
					};
					recipient: {
						active: boolean;
						currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
						description: string | null;
						domain: string;
						email: string | null;
						id: number;
						integration: number;
						metadata: any;
						name: string;
						recipient_code: string;
						type: string;
						is_deleted: boolean;
						details: {
							account_number: string;
							account_name: string | null;
							bank_code: string;
							bank_name: string;
							authorization_code: string | null;
						};
						created_at?: string | undefined;
						updated_at?: string | undefined;
					};
					created_at?: string | undefined;
					updated_at?: string | undefined;
				};
		  }
		| {
				event: "transfer.reversed";
				data: {
					amount: number;
					currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
					domain: string;
					failures: unknown;
					id: number;
					integration: {
						id: number;
						is_live: boolean;
						business_name: string;
					};
					reason: string;
					reference: string;
					source: string;
					source_details: unknown;
					status: string;
					titan_code: string | null;
					transfer_code: string;
					transferred_at: string | null;
					session: {
						provider: string | null;
						id: string | null;
					};
					recipient: {
						active: boolean;
						currency: "NGN" | "USD" | "GHS" | "ZAR" | "KES" | "XOF";
						description: string | null;
						domain: string;
						email: string | null;
						id: number;
						integration: number;
						metadata: any;
						name: string;
						recipient_code: string;
						type: string;
						is_deleted: boolean;
						details: {
							account_number: string;
							account_name: string | null;
							bank_code: string;
							bank_name: string;
							authorization_code: string | null;
						};
						created_at?: string | undefined;
						updated_at?: string | undefined;
					};
					created_at?: string | undefined;
					updated_at?: string | undefined;
				};
		  }
	> {
		if (!signature) {
			throw new Error("Missing 'x-paystack-signature' header.");
		}
		if (!(await this.verifySignature(rawBody, signature))) {
			throw new Error("Invalid webhook signature.");
		}
		const parseResult = await paystackWebhookSchema.safeParseAsync(
			JSON.parse(rawBody),
		);
		if (!parseResult.success) {
			throw new Error("Failed to parse webhook payload.", {
				cause: parseResult.error,
			});
		}

		const payload = parseResult.data;
		const handler = this.handlers[payload.event];

		if (handler) {
			const specificHandler = handler as WebhookHandler<typeof payload>;
			await specificHandler(payload.data);
		}

		return payload;
	}
}
