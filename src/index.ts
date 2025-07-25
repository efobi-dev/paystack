import { Split } from "./main/split";
import { Transaction } from "./main/transaction";
import { VirtualAccount } from "./main/virtual";

export * from "./zod";
export * from "./zod/transaction";
export * from "./zod/split";
export * from "./zod/virtual";

export class Paystack {
	private baseUrl = "https://api.paystack.co";
	private secretKey: `sk_live_${string}` | `sk_test_${string}`;

	public transaction: Transaction;
	public split: Split;
	public virtualAccount: VirtualAccount;

	constructor(secretKey: `sk_live_${string}` | `sk_test_${string}`) {
		this.secretKey = secretKey;
		this.transaction = new Transaction(this.secretKey, this.baseUrl);
		this.split = new Split(this.secretKey, this.baseUrl);
		this.virtualAccount = new VirtualAccount(this.secretKey, this.baseUrl);
	}
}
