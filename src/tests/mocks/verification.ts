import type { z } from "zod";
import type {
	verificationResolveAccountSuccess,
	verificationResolveCardBinSuccess,
	verificationValidateAccountResponse,
} from "../../zod/verification";

export const mockResolveAccountResponse: z.infer<
	typeof verificationResolveAccountSuccess
> = {
	status: true,
	message: "Account resolved",
	data: {
		account_number: "0123456789",
		account_name: "John Doe",
	},
};

export const mockValidateAccountResponse: z.infer<
	typeof verificationValidateAccountResponse
> = {
	status: true,
	message: "Account validated",
	data: {
		verified: true,
		verificationMessage: "Account is valid",
	},
};

export const mockResolveCardBinResponse: z.infer<
	typeof verificationResolveCardBinSuccess
> = {
	status: true,
	message: "Card BIN resolved",
	data: {
		bin: "408408",
		brand: "Verve",
		sub_brand: "",
		country_code: "NG",
		country_name: "Nigeria",
		card_type: "DEBIT",
		bank: "Test Bank",
		linked_bank_id: 1,
	},
};
