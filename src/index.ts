import { Split } from "./main/split";
import { Transaction } from "./main/transaction";
import { VirtualAccount } from "./main/virtual";
import { Webhook } from "./main/webhook";

export class Paystack {
	private baseUrl = "https://api.paystack.co";
	private secretKey: `sk_live_${string}` | `sk_test_${string}`;

	public transaction: Transaction;
	public split: Split;
	public virtualAccount: VirtualAccount;
	public webhook: Webhook;

	constructor(secretKey: `sk_live_${string}` | `sk_test_${string}`) {
		this.secretKey = secretKey;
		this.transaction = new Transaction(this.secretKey, this.baseUrl);
		this.split = new Split(this.secretKey, this.baseUrl);
		this.virtualAccount = new VirtualAccount(this.secretKey, this.baseUrl);
		this.webhook = new Webhook(this.secretKey, this.baseUrl);
	}
}
