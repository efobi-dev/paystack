import { z } from "zod";
import { genericResponse } from ".";

export const verificationResolveAccountInput: z.ZodObject<{
	account_number: z.ZodString;
	bank_code: z.ZodString;
}> = z.object({
	account_number: z.string(),
	bank_code: z.string(),
});

export const verificationResolveAccountSuccess: z.ZodObject<{
	status: z.ZodBoolean;
	message: z.ZodString;
	meta: z.ZodOptional<
		z.ZodObject<
			{
				total: z.ZodOptional<z.ZodNumber>;
				skipped: z.ZodOptional<z.ZodNumber>;
				perPage: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
				page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
				pageCount: z.ZodOptional<z.ZodNumber>;
			},
			z.core.$strip
		>
	>;
	data: z.ZodObject<
		{
			account_number: z.ZodString;
			account_name: z.ZodString;
		},
		z.core.$strip
	>;
}> = genericResponse.extend({
	data: z.object({
		account_number: z.string(),
		account_name: z.string(),
	}),
});

export const verificationValidateAccountInput: z.ZodObject<{
	account_name: z.ZodString;
	account_number: z.ZodString;
	account_type: z.ZodEnum<{
		personal: "personal";
		business: "business";
	}>;
	bank_code: z.ZodString;
	country_code: z.ZodString;
	document_type: z.ZodEnum<{
		identityNumber: "identityNumber";
		passportNumber: "passportNumber";
		businessRegistrationNumber: "businessRegistrationNumber";
	}>;
	document_number: z.ZodOptional<z.ZodString>;
}> = z.object({
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

export const verificationValidateAccountResponse: z.ZodObject<{
	status: z.ZodBoolean;
	message: z.ZodString;
	meta: z.ZodOptional<
		z.ZodObject<
			{
				total: z.ZodOptional<z.ZodNumber>;
				skipped: z.ZodOptional<z.ZodNumber>;
				perPage: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
				page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
				pageCount: z.ZodOptional<z.ZodNumber>;
			},
			z.core.$strip
		>
	>;
	data: z.ZodObject<
		{
			verified: z.ZodBoolean;
			verificationMessage: z.ZodString;
		},
		z.core.$strip
	>;
}> = genericResponse.extend({
	data: z.object({
		verified: z.boolean(),
		verificationMessage: z.string(),
	}),
});

export const verificationResolveCardBinInput: z.ZodObject<{
	card_bin: z.ZodString;
}> = z.object({
	card_bin: z.string(),
});

export const verificationResolveCardBinSuccess: z.ZodObject<{
	status: z.ZodBoolean;
	message: z.ZodString;
	meta: z.ZodOptional<
		z.ZodObject<
			{
				total: z.ZodOptional<z.ZodNumber>;
				skipped: z.ZodOptional<z.ZodNumber>;
				perPage: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
				page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
				pageCount: z.ZodOptional<z.ZodNumber>;
			},
			z.core.$strip
		>
	>;
	data: z.ZodObject<
		{
			bin: z.ZodString;
			brand: z.ZodString;
			sub_brand: z.ZodString;
			country_code: z.ZodString;
			country_name: z.ZodString;
			card_type: z.ZodString;
			bank: z.ZodString;
			linked_bank_id: z.ZodNumber;
		},
		z.core.$strip
	>;
}> = genericResponse.extend({
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

// Explicit type aliases — prevents TypeScript from inline-expanding z.infer<> in .d.ts files
export type VerificationResolveAccountInput = z.infer<
	typeof verificationResolveAccountInput
>;
export type VerificationResolveAccountSuccess = z.infer<
	typeof verificationResolveAccountSuccess
>;
export type VerificationValidateAccountInput = z.infer<
	typeof verificationValidateAccountInput
>;
export type VerificationValidateAccountResponse = z.infer<
	typeof verificationValidateAccountResponse
>;
export type VerificationResolveCardBinInput = z.infer<
	typeof verificationResolveCardBinInput
>;
export type VerificationResolveCardBinSuccess = z.infer<
	typeof verificationResolveCardBinSuccess
>;
