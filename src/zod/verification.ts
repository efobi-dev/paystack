import { z } from "zod";
import { genericResponse } from ".";

export const verificationResolveAccountInput = z.object({
	account_number: z.string(),
	bank_code: z.string(),
});

export const verificationResolveAccountSuccess = genericResponse.extend({
	data: z.object({
		account_number: z.string(),
		account_name: z.string(),
	}),
});

export const verificationValidateAccountInput = z.object({
	account_name: z.string(),
	account_number: z.string(),
	account_type: z.enum(["personal", "business"]),
	bank_code: z.string(),
	country_code: z.string(),
	document_type: z.enum([
		"identityNumber",
		"passportNumber",
		"businessRegistrationNumber",
	]),
	document_number: z.string().optional(),
});

export const verificationValidateAccountResponse = genericResponse.extend({
	data: z.object({
		verified: z.boolean(),
		verificationMessage: z.string(),
	}),
});

export const verificationResolveCardBinInput = z.object({
	card_bin: z.string(),
});

export const verificationResolveCardBinSuccess = genericResponse.extend({
	data: z.object({
		bin: z.string(),
		brand: z.string(),
		sub_brand: z.string(),
		country_code: z.string(),
		country_name: z.string(),
		card_type: z.string(),
		bank: z.string(),
		linked_bank_id: z.number(),
	}),
});
