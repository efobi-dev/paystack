import { describe, expect, test } from "bun:test";
import { Paystack } from "../index";

describe("SDK Initialization", () => {
	test("should instantiate the Paystack class without errors", () => {
		const secret = "sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
		const instance = new Paystack(secret);
		expect(instance).toBeInstanceOf(Paystack);
		expect(instance.miscellaneous).toBeDefined();
		expect(instance.split).toBeDefined();
		expect(instance.transaction).toBeDefined();
		expect(instance.transfer).toBeDefined();
		expect(instance.verification).toBeDefined();
		expect(instance.webhook).toBeDefined();
	});
});
