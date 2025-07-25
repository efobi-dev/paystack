import { createHmac } from "node:crypto";
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

export class Webhook extends Fetcher {
	private handlers: HandlersMap = {};

	/**
	 * Verifies the signature of an incoming webhook request.
	 * @param rawBody - The raw, unparsed request body.
	 * @param signature - The value of the 'x-paystack-signature' header.
	 * @returns {boolean} - True if the signature is valid, false otherwise.
	 */
	private verifySignature(rawBody: string, signature: string): boolean {
		const hash = createHmac("sha512", this.secretKey)
			.update(rawBody)
			.digest("hex");
		return hash === signature;
	}

	/**
	 * Registers a handler function for a specific webhook event.
	 * @param event - The event to listen for (e.g., 'charge.success').
	 * @param handler - The function to execute when the event is received.
	 */
	public on<T extends PaystackWebhookPayload["event"]>(
		event: T,
		handler: WebhookHandler<Extract<PaystackWebhookPayload, { event: T }>>,
	) {
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
	public async process(rawBody: string, signature: string | null | undefined) {
		if (!signature) {
			throw new Error("Missing 'x-paystack-signature' header.");
		}
		if (!this.verifySignature(rawBody, signature)) {
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
