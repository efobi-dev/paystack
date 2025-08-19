import { beforeAll, describe, expect, test } from "bun:test";
import { Paystack } from "../../index";

const secretKey = process.env.PAYSTACK_SECRET_KEY as string;
const shouldRun = secretKey?.startsWith("sk_test_");

// Conditionally skip the tests if the secret key is not available
const describeIf = (condition: boolean) => (condition ? describe : describe);

describeIf(shouldRun)("Miscellaneous Module (Integration)", () => {
	let paystack: Paystack;

	beforeAll(() => {
		paystack = new Paystack(secretKey as string);
	});

	test("should list all supported banks", async () => {
		const { data, error } = await paystack.miscellaneous.listBanks({
			country: "nigeria",
			perPage: 10,
			use_cursor: false,
		});

		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
		expect(data?.data).toBeArray();
	});

	test("should list all supported countries", async () => {
		const { data, error } = await paystack.miscellaneous.listCountries();

		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
		expect(data?.data).toBeArray();
	});

	test("should list all supported states in a country", async () => {
		const { data, error } = await paystack.miscellaneous.listStates({
			country: "US",
		});

		expect(error).toBeUndefined();
		expect(data).toBeDefined();
		expect(data?.status).toBe(true);
		expect(data?.data).toBeArray();
	});
});
