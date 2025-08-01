import z from "zod";
import { Miscellaneous } from "./main/miscellaneous";
import { Split } from "./main/split";
import { Transaction } from "./main/transaction";
import { Verification } from "./main/verification";
import { VirtualAccount } from "./main/virtual";
import { Webhook } from "./main/webhook";

export class Paystack {
	private baseUrl = "https://api.paystack.co";
	private secretKey: string;

	public transaction: Transaction;
	public split: Split;
	public virtualAccount: VirtualAccount;
	public webhook: Webhook;
	public verification: Verification;
	public miscellaneous: Miscellaneous;

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
	}
}
