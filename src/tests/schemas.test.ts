import { describe, expect, test } from "bun:test";
import * as allSchemas from "../zod";
import * as miscSchemas from "../zod/miscellaneous";
import * as splitSchemas from "../zod/split";
import * as txnSchemas from "../zod/transaction";
import * as transferSchemas from "../zod/transfer";
import * as verificationSchemas from "../zod/verification";
import * as virtualSchemas from "../zod/virtual";
import * as webhookSchemas from "../zod/webhook";

describe("Zod Schema Integrity", () => {
	test("all schema modules should be loaded without errors", () => {
		expect(allSchemas).toBeDefined();
		expect(miscSchemas).toBeDefined();
		expect(splitSchemas).toBeDefined();
		expect(txnSchemas).toBeDefined();
		expect(verificationSchemas).toBeDefined();
		expect(virtualSchemas).toBeDefined();
		expect(webhookSchemas).toBeDefined();
		expect(transferSchemas).toBeDefined();
	});
});
