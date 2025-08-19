import z from "zod";
import { Miscellaneous } from "./main/miscellaneous";
import { Recipient } from "./main/recipient";
import { Split } from "./main/split";
import { Transaction } from "./main/transaction";
import { Transfer } from "./main/transfer";
import { Verification } from "./main/verification";
import { VirtualAccount } from "./main/virtual";
import { Webhook } from "./main/webhook";

/**
 * The Paystack class provides access to various Paystack APIs.
 * It is the main entry point for the SDK.
 */
export class Paystack {
	private baseUrl = "https://api.paystack.co";
	private secretKey: string;

	public transaction: Transaction;
	public split: Split;
	public virtualAccount: VirtualAccount;
	public webhook: Webhook;
	public verification: Verification;
	public miscellaneous: Miscellaneous;
	public transfer: Transfer;
	public recipient: Recipient;

	/**
	 * Creates an instance of the Paystack SDK.
	 * @param secretKey - Your Paystack secret key. It should start with 'sk_live_' or 'sk_test_'.
	 * @throws {Error} If the secret key is invalid.
	 */
	constructor(secretKey: string) {
		const secretKeySchema = z
			.string()
			.startsWith("sk_live_")
			.or(z.string().startsWith("sk_test_"));
		if (!secretKeySchema.safeParse(secretKey).success) {
			throw new Error(
				"Invalid secret key. It must start with 'sk_live_' or 'sk_test_'.",
			);
		}
		this.secretKey = secretKey;
		this.transaction = new Transaction(this.secretKey, this.baseUrl);
		this.split = new Split(this.secretKey, this.baseUrl);
		this.virtualAccount = new VirtualAccount(this.secretKey, this.baseUrl);
		this.webhook = new Webhook(this.secretKey, this.baseUrl);
		this.verification = new Verification(this.secretKey, this.baseUrl);
		this.miscellaneous = new Miscellaneous(this.secretKey, this.baseUrl);
		this.transfer = new Transfer(this.secretKey, this.baseUrl);
		this.recipient = new Recipient(this.secretKey, this.baseUrl);
	}
}
