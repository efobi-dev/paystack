import { Split } from "./main/split";
import { Transaction } from "./main/transaction";

export class Paystack {
	private baseUrl = "https://api.paystack.co";
	private secretKey: `sk_live_${string}` | `sk_test_${string}`;

	public transaction: Transaction;
	public split: Split;

	constructor(secretKey: `sk_live_${string}` | `sk_test_${string}`) {
		this.secretKey = secretKey;
		this.transaction = new Transaction(this.secretKey, this.baseUrl);
		this.split = new Split(this.secretKey, this.baseUrl);
	}
}
