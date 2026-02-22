import { z } from "zod";
import { currency, genericInput, genericResponse, meta, subaccount } from ".";

export const type: z.ZodEnum<{
	flat: "flat";
	percentage: "percentage";
}> = z.enum(["percentage", "flat"]);
export const bearer_type: z.ZodEnum<{
	subaccount: "subaccount";
	account: "account";
	"all-proportional": "all-proportional";
	all: "all";
}> = z.enum(["subaccount", "account", "all-proportional", "all"]);

export const splitCreateInput: z.ZodObject<{
	name: z.ZodString;
	type: z.ZodEnum<{
		flat: "flat";
		percentage: "percentage";
	}>;
	currency: z.ZodDefault<
		z.ZodEnum<{
			NGN: "NGN";
			USD: "USD";
			GHS: "GHS";
			ZAR: "ZAR";
			KES: "KES";
			XOF: "XOF";
		}>
	>;
	subaccounts: z.ZodArray<
		z.ZodObject<
			{
				subaccount: z.ZodString;
				share: z.ZodNumber;
			},
			z.core.$strip
		>
	>;
	bearer_type: z.ZodEnum<{
		subaccount: "subaccount";
		account: "account";
		"all-proportional": "all-proportional";
		all: "all";
	}>;
	bearer_subaccount: z.ZodString;
}> = z.object({
	name: z.string(),
	type,
	currency,
	subaccounts: z.array(
		z.object({
			subaccount: z.string().startsWith("ACCT_"),
			share: z.number(),
		}),
	),
	bearer_type,
	bearer_subaccount: z.string(),
});

export const baseSplitSchema: z.ZodObject<{
	id: z.ZodNumber;
	name: z.ZodString;
	type: z.ZodEnum<{
		flat: "flat";
		percentage: "percentage";
	}>;
	currency: z.ZodDefault<
		z.ZodEnum<{
			NGN: "NGN";
			USD: "USD";
			GHS: "GHS";
			ZAR: "ZAR";
			KES: "KES";
			XOF: "XOF";
		}>
	>;
	integration: z.ZodNumber;
	domain: z.ZodString;
	split_code: z.ZodString;
	active: z.ZodBoolean;
	bearer_type: z.ZodEnum<{
		subaccount: "subaccount";
		account: "account";
		"all-proportional": "all-proportional";
		all: "all";
	}>;
	createdAt: z.ZodISODateTime;
	updatedAt: z.ZodISODateTime;
	is_dynamic: z.ZodBoolean;
	subaccounts: z.ZodArray<
		z.ZodObject<
			{
				subaccount: z.ZodObject<
					{
						id: z.ZodNumber;
						subaccount_code: z.ZodString;
						business_name: z.ZodString;
						description: z.ZodString;
						primary_contact_name: z.ZodNullable<z.ZodString>;
						primary_contact_email: z.ZodNullable<z.ZodEmail>;
						primary_contact_phone: z.ZodNullable<z.ZodString>;
						metadata: z.ZodNullable<z.ZodAny>;
						settlement_bank: z.ZodString;
						currency: z.ZodDefault<
							z.ZodEnum<{
								NGN: "NGN";
								USD: "USD";
								GHS: "GHS";
								ZAR: "ZAR";
								KES: "KES";
								XOF: "XOF";
							}>
						>;
						account_number: z.ZodString;
					},
					z.core.$strip
				>;
				share: z.ZodNumber;
			},
			z.core.$strip
		>
	>;
}> = z.object({
	id: z.number(),
	name: z.string(),
	type,
	currency,
	integration: z.number(),
	domain: z.string(),
	split_code: z.string(),
	active: z.boolean(),
	bearer_type,
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
	is_dynamic: z.boolean(),
	subaccounts: z.array(
		z.object({
			subaccount,
			share: z.number(),
		}),
	),
});

export const splitCreateSuccess: z.ZodObject<{
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
			id: z.ZodNumber;
			name: z.ZodString;
			type: z.ZodEnum<{
				flat: "flat";
				percentage: "percentage";
			}>;
			currency: z.ZodDefault<
				z.ZodEnum<{
					NGN: "NGN";
					USD: "USD";
					GHS: "GHS";
					ZAR: "ZAR";
					KES: "KES";
					XOF: "XOF";
				}>
			>;
			integration: z.ZodNumber;
			domain: z.ZodString;
			split_code: z.ZodString;
			active: z.ZodBoolean;
			bearer_type: z.ZodEnum<{
				subaccount: "subaccount";
				account: "account";
				"all-proportional": "all-proportional";
				all: "all";
			}>;
			createdAt: z.ZodISODateTime;
			updatedAt: z.ZodISODateTime;
			is_dynamic: z.ZodBoolean;
			subaccounts: z.ZodArray<
				z.ZodObject<
					{
						subaccount: z.ZodObject<
							{
								id: z.ZodNumber;
								subaccount_code: z.ZodString;
								business_name: z.ZodString;
								description: z.ZodString;
								primary_contact_name: z.ZodNullable<z.ZodString>;
								primary_contact_email: z.ZodNullable<z.ZodEmail>;
								primary_contact_phone: z.ZodNullable<z.ZodString>;
								metadata: z.ZodNullable<z.ZodAny>;
								settlement_bank: z.ZodString;
								currency: z.ZodDefault<
									z.ZodEnum<{
										NGN: "NGN";
										USD: "USD";
										GHS: "GHS";
										ZAR: "ZAR";
										KES: "KES";
										XOF: "XOF";
									}>
								>;
								account_number: z.ZodString;
							},
							z.core.$strip
						>;
						share: z.ZodNumber;
					},
					z.core.$strip
				>
			>;
		},
		z.core.$strip
	>;
}> = genericResponse.extend({
	data: baseSplitSchema,
});

export const splitListInput: z.ZodObject<{
	perPage: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
	page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
	from: z.ZodOptional<z.ZodISODateTime>;
	to: z.ZodOptional<z.ZodISODateTime>;
	name: z.ZodString;
	active: z.ZodBoolean;
	sort_by: z.ZodOptional<z.ZodString>;
}> = genericInput.extend({
	name: z.string(),
	active: z.boolean(),
	sort_by: z.string().optional(),
});

export const splitListSuccess: z.ZodObject<{
	status: z.ZodBoolean;
	message: z.ZodString;
	data: z.ZodArray<
		z.ZodObject<
			{
				id: z.ZodNumber;
				name: z.ZodString;
				type: z.ZodEnum<{
					flat: "flat";
					percentage: "percentage";
				}>;
				currency: z.ZodDefault<
					z.ZodEnum<{
						NGN: "NGN";
						USD: "USD";
						GHS: "GHS";
						ZAR: "ZAR";
						KES: "KES";
						XOF: "XOF";
					}>
				>;
				integration: z.ZodNumber;
				domain: z.ZodString;
				split_code: z.ZodString;
				active: z.ZodBoolean;
				bearer_type: z.ZodEnum<{
					subaccount: "subaccount";
					account: "account";
					"all-proportional": "all-proportional";
					all: "all";
				}>;
				createdAt: z.ZodISODateTime;
				updatedAt: z.ZodISODateTime;
				is_dynamic: z.ZodBoolean;
				subaccounts: z.ZodArray<
					z.ZodObject<
						{
							subaccount: z.ZodObject<
								{
									id: z.ZodNumber;
									subaccount_code: z.ZodString;
									business_name: z.ZodString;
									description: z.ZodString;
									primary_contact_name: z.ZodNullable<z.ZodString>;
									primary_contact_email: z.ZodNullable<z.ZodEmail>;
									primary_contact_phone: z.ZodNullable<z.ZodString>;
									metadata: z.ZodNullable<z.ZodAny>;
									settlement_bank: z.ZodString;
									currency: z.ZodDefault<
										z.ZodEnum<{
											NGN: "NGN";
											USD: "USD";
											GHS: "GHS";
											ZAR: "ZAR";
											KES: "KES";
											XOF: "XOF";
										}>
									>;
									account_number: z.ZodString;
								},
								z.core.$strip
							>;
							share: z.ZodNumber;
						},
						z.core.$strip
					>
				>;
				bearer_subaccount: z.ZodNullable<z.ZodString>;
				total_subaccounts: z.ZodNumber;
			},
			z.core.$strip
		>
	>;
	meta: z.ZodObject<
		{
			total: z.ZodOptional<z.ZodNumber>;
			skipped: z.ZodOptional<z.ZodNumber>;
			perPage: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
			page: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
			pageCount: z.ZodOptional<z.ZodNumber>;
		},
		z.core.$strip
	>;
}> = genericResponse.extend({
	data: z.array(
		baseSplitSchema.extend({
			bearer_subaccount: z.string().nullable(),
			total_subaccounts: z.number(),
		}),
	),
	meta,
});

export const splitSingleSuccess: z.ZodObject<{
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
			id: z.ZodNumber;
			name: z.ZodString;
			type: z.ZodEnum<{
				flat: "flat";
				percentage: "percentage";
			}>;
			currency: z.ZodDefault<
				z.ZodEnum<{
					NGN: "NGN";
					USD: "USD";
					GHS: "GHS";
					ZAR: "ZAR";
					KES: "KES";
					XOF: "XOF";
				}>
			>;
			integration: z.ZodNumber;
			domain: z.ZodString;
			split_code: z.ZodString;
			active: z.ZodBoolean;
			bearer_type: z.ZodEnum<{
				subaccount: "subaccount";
				account: "account";
				"all-proportional": "all-proportional";
				all: "all";
			}>;
			createdAt: z.ZodISODateTime;
			updatedAt: z.ZodISODateTime;
			is_dynamic: z.ZodBoolean;
			subaccounts: z.ZodArray<
				z.ZodObject<
					{
						subaccount: z.ZodObject<
							{
								id: z.ZodNumber;
								subaccount_code: z.ZodString;
								business_name: z.ZodString;
								description: z.ZodString;
								primary_contact_name: z.ZodNullable<z.ZodString>;
								primary_contact_email: z.ZodNullable<z.ZodEmail>;
								primary_contact_phone: z.ZodNullable<z.ZodString>;
								metadata: z.ZodNullable<z.ZodAny>;
								settlement_bank: z.ZodString;
								currency: z.ZodDefault<
									z.ZodEnum<{
										NGN: "NGN";
										USD: "USD";
										GHS: "GHS";
										ZAR: "ZAR";
										KES: "KES";
										XOF: "XOF";
									}>
								>;
								account_number: z.ZodString;
							},
							z.core.$strip
						>;
						share: z.ZodNumber;
					},
					z.core.$strip
				>
			>;
			total_subaccounts: z.ZodNumber;
		},
		z.core.$strip
	>;
}> = genericResponse.extend({
	data: baseSplitSchema.extend({
		total_subaccounts: z.number(),
	}),
});

export const splitUpdateInput: z.ZodObject<{
	id: z.ZodString;
	name: z.ZodString;
	active: z.ZodBoolean;
	bearer_type: z.ZodOptional<
		z.ZodEnum<{
			subaccount: "subaccount";
			account: "account";
			"all-proportional": "all-proportional";
			all: "all";
		}>
	>;
	bearer_subaccount: z.ZodOptional<z.ZodString>;
}> = z.object({
	id: z.string(),
	name: z.string(),
	active: z.boolean(),
	bearer_type: z.optional(bearer_type),
	bearer_subaccount: z.string().optional(),
});

export const splitSubaccountInput: z.ZodObject<{
	id: z.ZodString;
	subaccount: z.ZodString;
	share: z.ZodNumber;
}> = z.object({
	id: z.string(),
	subaccount: z.string().startsWith("ACCT_"),
	share: z.number(),
});

export const splitSubaccountUpdateSuccess: z.ZodObject<{
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
			id: z.ZodNumber;
			name: z.ZodString;
			type: z.ZodEnum<{
				flat: "flat";
				percentage: "percentage";
			}>;
			currency: z.ZodDefault<
				z.ZodEnum<{
					NGN: "NGN";
					USD: "USD";
					GHS: "GHS";
					ZAR: "ZAR";
					KES: "KES";
					XOF: "XOF";
				}>
			>;
			integration: z.ZodNumber;
			domain: z.ZodString;
			split_code: z.ZodString;
			active: z.ZodBoolean;
			bearer_type: z.ZodEnum<{
				subaccount: "subaccount";
				account: "account";
				"all-proportional": "all-proportional";
				all: "all";
			}>;
			createdAt: z.ZodISODateTime;
			updatedAt: z.ZodISODateTime;
			is_dynamic: z.ZodBoolean;
			subaccounts: z.ZodArray<
				z.ZodObject<
					{
						subaccount: z.ZodObject<
							{
								id: z.ZodNumber;
								subaccount_code: z.ZodString;
								business_name: z.ZodString;
								description: z.ZodString;
								primary_contact_name: z.ZodNullable<z.ZodString>;
								primary_contact_email: z.ZodNullable<z.ZodEmail>;
								primary_contact_phone: z.ZodNullable<z.ZodString>;
								metadata: z.ZodNullable<z.ZodAny>;
								settlement_bank: z.ZodString;
								currency: z.ZodDefault<
									z.ZodEnum<{
										NGN: "NGN";
										USD: "USD";
										GHS: "GHS";
										ZAR: "ZAR";
										KES: "KES";
										XOF: "XOF";
									}>
								>;
								account_number: z.ZodString;
							},
							z.core.$strip
						>;
						share: z.ZodNumber;
					},
					z.core.$strip
				>
			>;
			bearer_subaccount: z.ZodNullable<z.ZodString>;
			total_subaccounts: z.ZodNumber;
		},
		z.core.$strip
	>;
}> = genericResponse.extend({
	data: baseSplitSchema.extend({
		bearer_subaccount: z.string().nullable(),
		total_subaccounts: z.number(),
	}),
});

export const splitSubaccountRemoveInput: z.ZodObject<{
	id: z.ZodString;
	subaccount: z.ZodString;
}> = splitSubaccountInput.omit({
	share: true,
});

export const splitSubaccountRemoveError: z.ZodObject<{
	status: z.ZodBoolean;
	message: z.ZodString;
	data: z.ZodOptional<z.ZodObject<{}, z.core.$strip>>;
	meta: z.ZodObject<
		{
			nextStep: z.ZodOptional<z.ZodString>;
		},
		z.core.$strip
	>;
	type: z.ZodOptional<z.ZodString>;
	code: z.ZodOptional<z.ZodString>;
}> = genericResponse.extend({
	meta: z.object({
		nextStep: z.string().optional(),
	}),
	type: z.string().optional(),
	code: z.string().optional(),
});

// Explicit type aliases — prevents TypeScript from inline-expanding z.infer<> in .d.ts files
export type SplitType = z.infer<typeof type>;
export type BearerType = z.infer<typeof bearer_type>;
export type BaseSplitSchema = z.infer<typeof baseSplitSchema>;
export type SplitCreateInput = z.infer<typeof splitCreateInput>;
export type SplitCreateSuccess = z.infer<typeof splitCreateSuccess>;
export type SplitListInput = z.infer<typeof splitListInput>;
export type SplitListSuccess = z.infer<typeof splitListSuccess>;
export type SplitSingleSuccess = z.infer<typeof splitSingleSuccess>;
export type SplitUpdateInput = z.infer<typeof splitUpdateInput>;
export type SplitSubaccountInput = z.infer<typeof splitSubaccountInput>;
export type SplitSubaccountUpdateSuccess = z.infer<
	typeof splitSubaccountUpdateSuccess
>;
export type SplitSubaccountRemoveInput = z.infer<
	typeof splitSubaccountRemoveInput
>;
export type SplitSubaccountRemoveError = z.infer<
	typeof splitSubaccountRemoveError
>;
