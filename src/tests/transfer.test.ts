import { describe, expect, test } from "bun:test";
import { Paystack } from "../index";
import {
	transferBulkInitiateSuccess,
	transferFinalizeSuccess,
	transferInitiateSuccess,
	transferListSuccess,
	transferSingleSuccess,
} from "../zod/transfer";
import { mockFetcher } from "./mocks";

const secretKey = "sk_test_1234567890";
const paystack = new Paystack(secretKey);

describe("Transfer Module (Unit)", () => {
	test("should initialize a transfer", async () => {
		const input = {
			source: "balance",
			amount: "5000",
			recipient: "RCP_123456",
			reason: "Holiday groove",
		};
		const expectedData = transferInitiateSuccess.parse({
			status: true,
			message: "Transfer has been queued",
			data: {
				integration: 100073,
				domain: "test",
				amount: 5000,
				currency: "NGN",
				source: "balance",
				reason: "Holiday groove",
				recipient: 22,
				status: "pending",
				transfer_code: "TRF_123456",
				id: 1,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				reference: "ref_123",
				titan_code: "titan_123",
				request: 123,
				transfersessionid: [],
				transfertrials: [],
				failures: null,
			},
		});

		paystack.transfer.fetcher = mockFetcher(expectedData, true);
		const { data, error } = await paystack.transfer.initialize(input);
		expect(error).toBeUndefined();
		expect(data).toEqual(expectedData);
	});

	test("should finalize a transfer", async () => {
		const input = {
			transfer_code: "TRF_123456",
			otp: "123456",
		};
		const expectedData = transferFinalizeSuccess.parse({
			status: true,
			message: "Transfer has been completed",
			data: {
				integration: 100073,
				domain: "test",
				amount: 5000,
				currency: "NGN",
				source: "balance",
				reason: "Holiday groove",
				recipient: 22,
				status: "success",
				transfer_code: "TRF_123456",
				id: 1,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				reference: "ref_123",
				titan_code: "titan_123",
				request: 123,
				failures: null,
				source_details: null,
			},
		});

		paystack.transfer.fetcher = mockFetcher(expectedData, true);
		const { data, error } = await paystack.transfer.finalize(input);
		expect(error).toBeUndefined();
		expect(data).toEqual(expectedData);
	});

	test("should initiate a bulk transfer", async () => {
		const input = {
			source: "balance",
			transfers: [
				{
					amount: "5000",
					recipient: "RCP_123456",
				},
			],
		};
		const expectedData = transferBulkInitiateSuccess.parse({
			status: true,
			message: "2 transfers have been queued",
			data: [
				{
					amount: 20000,
					recipient: "RCP_123456",
					reference: "ref_123",
					currency: "NGN",
					status: "pending",
				},
				{
					amount: 30000,
					recipient: "RCP_123456",
					reference: "ref_456",
					currency: "NGN",
					status: "pending",
				},
			],
		});

		paystack.transfer.fetcher = mockFetcher(expectedData, true);
		const { data, error } = await paystack.transfer.initiateBulk(input);
		expect(error).toBeUndefined();
		expect(data).toEqual(expectedData);
	});

	test("should list transfers", async () => {
		const expectedData = transferListSuccess.parse({
			status: true,
			message: "Transfers retrieved",
			data: [],
			meta: {
				total: 1,
				skipped: 0,
				perPage: 50,
				page: 1,
				pageCount: 1,
			},
		});

		paystack.transfer.fetcher = mockFetcher(expectedData, true);
		const { data, error } = await paystack.transfer.list({});
		expect(error).toBeUndefined();
		expect(data).toEqual(expectedData);
	});

	test("should get a transfer by id", async () => {
		const expectedData = transferSingleSuccess.parse({
			status: true,
			message: "Transfer retrieved",
			data: {
				integration: 100073,
				domain: "test",
				amount: 5000,
				currency: "NGN",
				source: "balance",
				reason: "Holiday groove",
				recipient: {
					domain: "test",
					type: "nuban",
					currency: "NGN",
					name: "John Doe",
					details: {
						account_number: "0000000000",
						account_name: "John Doe",
						bank_code: "058",
						bank_name: "Guaranty Trust Bank",
					},
					description: "Test recipient",
					metadata: null,
					recipient_code: "RCP_123456",
					active: true,
					id: 1,
					integration: 100073,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				},
				status: "success",
				transfer_code: "TRF_123456",
				id: 1,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				reference: "ref_123",
				titan_code: "titan_123",
				request: 123,
				failures: null,
				session: {
					provider: null,
					id: null,
				},
				fees_charged: 0,
				fees_breakdown: null,
				gateway_response: null,
				source_details: null,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			},
		});

		paystack.transfer.fetcher = mockFetcher(expectedData, true);
		const { data, error } = await paystack.transfer.getTransferById("TRF_123456");
		expect(error).toBeUndefined();
		expect(data).toEqual(expectedData);
	});

	test("should verify a transfer", async () => {
		const expectedData = transferSingleSuccess.parse({
			status: true,
			message: "Transfer retrieved",
			data: {
				integration: 100073,
				domain: "test",
				amount: 5000,
				currency: "NGN",
				source: "balance",
				reason: "Holiday groove",
				recipient: {
					domain: "test",
					type: "nuban",
					currency: "NGN",
					name: "John Doe",
					details: {
						account_number: "0000000000",
						account_name: "John Doe",
						bank_code: "058",
						bank_name: "Guaranty Trust Bank",
					},
					description: "Test recipient",
					metadata: null,
					recipient_code: "RCP_123456",
					active: true,
					id: 1,
					integration: 100073,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				},
				status: "success",
				transfer_code: "TRF_123456",
				id: 1,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				reference: "ref_123",
				titan_code: "titan_123",
				request: 123,
				failures: null,
				session: {
					provider: null,
					id: null,
				},
				fees_charged: 0,
				fees_breakdown: null,
				gateway_response: null,
				source_details: null,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			},
		});

		paystack.transfer.fetcher = mockFetcher(expectedData, true);
		const { data, error } = await paystack.transfer.verify("TRF_123456");
		expect(error).toBeUndefined();
		expect(data).toEqual(expectedData);
	});
});
