import { z } from "zod";
import { currency, customer, genericResponse, meta } from ".";

export const virtualAccountCreateInput: z.ZodObject<{
	customer: z.ZodString;
	preferred_bank: z.ZodOptional<z.ZodString>;
	subaccount: z.ZodOptional<z.ZodString>;
	split_code: z.ZodOptional<z.ZodString>;
	first_name: z.ZodOptional<z.ZodString>;
	last_name: z.ZodOptional<z.ZodString>;
	phone: z.ZodOptional<z.ZodString>;
}> = z.object({
	customer: z.string(),
	preferred_bank: z.string().optional(),
	subaccount: z.string().optional(),
	split_code: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	phone: z.string().optional(),
});

export const virtualAccountAssignmentSchema: z.ZodObject<{
	integration: z.ZodNumber;
	assignee_id: z.ZodNumber;
	assignee_type: z.ZodString;
	expired: z.ZodBoolean;
	account_type: z.ZodString;
	assigned_at: z.ZodISODateTime;
}> = z.object({
	integration: z.number(),
	assignee_id: z.number(),
	assignee_type: z.string(),
	expired: z.boolean(),
	account_type: z.string(),
	assigned_at: z.iso.datetime(),
});

export const virtualAccountBaseSchema: z.ZodObject<{
	bank: z.ZodObject<
		{
			name: z.ZodString;
			id: z.ZodNumber;
			slug: z.ZodString;
		},
		z.core.$strip
	>;
	account_name: z.ZodString;
	account_number: z.ZodString;
	assigned: z.ZodBoolean;
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
	metadata: z.ZodNullable<z.ZodAny>;
	active: z.ZodBoolean;
	id: z.ZodNumber;
	created_at: z.ZodISODateTime;
	updated_at: z.ZodISODateTime;
}> = z.object({
	bank: z.object({
		name: z.string(),
		id: z.number(),
		slug: z.string(),
	}),
	account_name: z.string(),
	account_number: z.string(),
	assigned: z.boolean(),
	currency,
	metadata: z.nullable(z.any()),
	active: z.boolean(),
	id: z.number(),
	created_at: z.iso.datetime(),
	updated_at: z.iso.datetime(),
});

export const virtualAccountCreateSuccess: z.ZodObject<{
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
			bank: z.ZodObject<
				{
					name: z.ZodString;
					id: z.ZodNumber;
					slug: z.ZodString;
				},
				z.core.$strip
			>;
			account_name: z.ZodString;
			account_number: z.ZodString;
			assigned: z.ZodBoolean;
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
			metadata: z.ZodNullable<z.ZodAny>;
			active: z.ZodBoolean;
			id: z.ZodNumber;
			created_at: z.ZodISODateTime;
			updated_at: z.ZodISODateTime;
			assignment: z.ZodObject<
				{
					integration: z.ZodNumber;
					assignee_id: z.ZodNumber;
					assignee_type: z.ZodString;
					expired: z.ZodBoolean;
					account_type: z.ZodString;
					assigned_at: z.ZodISODateTime;
				},
				z.core.$strip
			>;
			customer: z.ZodObject<
				{
					id: z.ZodNumber;
					email: z.ZodEmail;
					first_name: z.ZodNullable<z.ZodString>;
					last_name: z.ZodNullable<z.ZodString>;
					phone: z.ZodNullable<z.ZodString>;
					customer_code: z.ZodString;
					risk_action: z.ZodString;
				},
				z.core.$strip
			>;
		},
		z.core.$strip
	>;
}> = genericResponse.extend({
	data: virtualAccountBaseSchema.extend({
		assignment: virtualAccountAssignmentSchema,
		customer: customer.omit({
			metadata: true,
			international_format_phone: true,
		}),
	}),
});

export const virtualAccountAssignInput: z.ZodObject<{
	email: z.ZodEmail;
	first_name: z.ZodString;
	last_name: z.ZodString;
	phone: z.ZodString;
	country: z.ZodEnum<{
		NG: "NG";
		GH: "GH";
	}>;
	account_number: z.ZodOptional<z.ZodString>;
	bvn: z.ZodOptional<z.ZodString>;
	bank_code: z.ZodOptional<z.ZodString>;
	subaccount: z.ZodOptional<z.ZodString>;
	split_code: z.ZodOptional<z.ZodString>;
}> = z.object({
	email: z.email(),
	first_name: z.string(),
	last_name: z.string(),
	phone: z.string(),
	country: z.enum(["NG", "GH"]),
	account_number: z.string().optional(),
	bvn: z.string().optional(),
	bank_code: z.string().optional(),
	subaccount: z.string().optional(),
	split_code: z.string().optional(),
});

export const virtualAccountListInput: z.ZodObject<{
	active: z.ZodBoolean;
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
	provider_slug: z.ZodOptional<z.ZodString>;
	bank_id: z.ZodOptional<z.ZodString>;
	customer: z.ZodOptional<z.ZodString>;
}> = z.object({
	active: z.boolean(),
	currency,
	provider_slug: z.string().optional(),
	bank_id: z.string().optional(),
	customer: z.string().optional(),
});

export const virtualAccountListSuccess: z.ZodObject<{
	status: z.ZodBoolean;
	message: z.ZodString;
	data: z.ZodArray<
		z.ZodObject<
			{
				bank: z.ZodObject<
					{
						name: z.ZodString;
						id: z.ZodNumber;
						slug: z.ZodString;
					},
					z.core.$strip
				>;
				account_name: z.ZodString;
				account_number: z.ZodString;
				assigned: z.ZodBoolean;
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
				metadata: z.ZodNullable<z.ZodAny>;
				active: z.ZodBoolean;
				id: z.ZodNumber;
				created_at: z.ZodISODateTime;
				updated_at: z.ZodISODateTime;
				assignment: z.ZodObject<
					{
						integration: z.ZodNumber;
						assignee_id: z.ZodNumber;
						assignee_type: z.ZodString;
						expired: z.ZodBoolean;
						account_type: z.ZodString;
						assigned_at: z.ZodISODateTime;
					},
					z.core.$strip
				>;
				customer: z.ZodObject<
					{
						id: z.ZodNumber;
						email: z.ZodEmail;
						first_name: z.ZodNullable<z.ZodString>;
						last_name: z.ZodNullable<z.ZodString>;
						phone: z.ZodNullable<z.ZodString>;
						customer_code: z.ZodString;
						risk_action: z.ZodString;
					},
					z.core.$strip
				>;
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
		virtualAccountBaseSchema.extend({
			assignment: virtualAccountAssignmentSchema,
			customer: customer.omit({
				metadata: true,
				international_format_phone: true,
			}),
		}),
	),
	meta,
});

export const virtualAccountFetchSuccess: z.ZodObject<{
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
			bank: z.ZodObject<
				{
					name: z.ZodString;
					id: z.ZodNumber;
					slug: z.ZodString;
				},
				z.core.$strip
			>;
			account_name: z.ZodString;
			account_number: z.ZodString;
			assigned: z.ZodBoolean;
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
			metadata: z.ZodNullable<z.ZodAny>;
			active: z.ZodBoolean;
			id: z.ZodNumber;
			created_at: z.ZodISODateTime;
			updated_at: z.ZodISODateTime;
			assignment: z.ZodObject<
				{
					integration: z.ZodNumber;
					assignee_id: z.ZodNumber;
					assignee_type: z.ZodString;
					expired: z.ZodBoolean;
					account_type: z.ZodString;
					assigned_at: z.ZodISODateTime;
				},
				z.core.$strip
			>;
			customer: z.ZodObject<
				{
					id: z.ZodNumber;
					first_name: z.ZodNullable<z.ZodString>;
					last_name: z.ZodNullable<z.ZodString>;
					email: z.ZodEmail;
					phone: z.ZodNullable<z.ZodString>;
					metadata: z.ZodNullable<z.ZodAny>;
					customer_code: z.ZodString;
					risk_action: z.ZodString;
					international_format_phone: z.ZodNullable<z.ZodString>;
				},
				z.core.$strip
			>;
			split_config: z.ZodString;
		},
		z.core.$strip
	>;
}> = genericResponse.extend({
	data: virtualAccountBaseSchema.extend({
		assignment: virtualAccountAssignmentSchema,
		customer,
		split_config: z.string(),
	}),
});

export const virtualAccountRequeryInput: z.ZodObject<{
	account_number: z.ZodString;
	provider_slug: z.ZodString;
	date: z.ZodOptional<z.ZodISODate>;
}> = z.object({
	account_number: z.string(),
	provider_slug: z.string(),
	date: z.iso.date().optional(),
});

export const virtualAccountDeleteSuccess: z.ZodObject<{
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
			bank: z.ZodObject<
				{
					name: z.ZodString;
					id: z.ZodNumber;
					slug: z.ZodString;
				},
				z.core.$strip
			>;
			account_name: z.ZodString;
			account_number: z.ZodString;
			assigned: z.ZodBoolean;
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
			metadata: z.ZodNullable<z.ZodAny>;
			active: z.ZodBoolean;
			id: z.ZodNumber;
			created_at: z.ZodISODateTime;
			updated_at: z.ZodISODateTime;
			assignment: z.ZodObject<
				{
					integration: z.ZodNumber;
					assignee_id: z.ZodNumber;
					assignee_type: z.ZodString;
					account_type: z.ZodString;
					assigned_at: z.ZodISODateTime;
				},
				z.core.$strip
			>;
			customer: z.ZodObject<
				{
					id: z.ZodNumber;
					first_name: z.ZodNullable<z.ZodString>;
					last_name: z.ZodNullable<z.ZodString>;
					email: z.ZodEmail;
					phone: z.ZodNullable<z.ZodString>;
					metadata: z.ZodNullable<z.ZodAny>;
					customer_code: z.ZodString;
					risk_action: z.ZodString;
					international_format_phone: z.ZodNullable<z.ZodString>;
				},
				z.core.$strip
			>;
			split_config: z.ZodString;
		},
		z.core.$strip
	>;
}> = genericResponse.extend({
	data: virtualAccountBaseSchema.extend({
		assignment: virtualAccountAssignmentSchema.omit({ expired: true }),
		customer,
		split_config: z.string(),
	}),
});

export const virtualAccountAddSplitInput: z.ZodObject<{
	customer: z.ZodString;
	subaccount: z.ZodOptional<z.ZodString>;
	split_code: z.ZodOptional<z.ZodString>;
	preferred_bank: z.ZodOptional<z.ZodString>;
}> = z.object({
	customer: z.string(),
	subaccount: z.string().optional(),
	split_code: z.string().optional(),
	preferred_bank: z.string().optional(),
});

export const virtualAccountAddSplitSuccess: z.ZodObject<{
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
			bank: z.ZodObject<
				{
					name: z.ZodString;
					id: z.ZodNumber;
					slug: z.ZodString;
				},
				z.core.$strip
			>;
			account_name: z.ZodString;
			account_number: z.ZodString;
			assigned: z.ZodBoolean;
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
			metadata: z.ZodNullable<z.ZodAny>;
			active: z.ZodBoolean;
			id: z.ZodNumber;
			created_at: z.ZodISODateTime;
			updated_at: z.ZodISODateTime;
			assignment: z.ZodObject<
				{
					integration: z.ZodNumber;
					assignee_id: z.ZodNumber;
					assignee_type: z.ZodString;
					expired: z.ZodBoolean;
					account_type: z.ZodString;
					assigned_at: z.ZodISODateTime;
					expired_at: z.ZodNullable<z.ZodISODateTime>;
				},
				z.core.$strip
			>;
			customer: z.ZodObject<
				{
					id: z.ZodNumber;
					metadata: z.ZodNullable<z.ZodAny>;
					email: z.ZodEmail;
					first_name: z.ZodNullable<z.ZodString>;
					last_name: z.ZodNullable<z.ZodString>;
					phone: z.ZodNullable<z.ZodString>;
					customer_code: z.ZodString;
					risk_action: z.ZodString;
				},
				z.core.$strip
			>;
			split_config: z.ZodObject<
				{
					split_code: z.ZodString;
				},
				z.core.$strip
			>;
		},
		z.core.$strip
	>;
}> = genericResponse.extend({
	data: virtualAccountBaseSchema.extend({
		assignment: virtualAccountAssignmentSchema.extend({
			expired_at: z.iso.datetime().nullable(),
		}),
		customer: customer.omit({
			international_format_phone: true,
		}),
		split_config: z.object({
			split_code: z.string(),
		}),
	}),
});

export const virtualAccountRemoveSplitInput: z.ZodObject<{
	account_number: z.ZodString;
}> = virtualAccountRequeryInput.omit({
	provider_slug: true,
	date: true,
});

export const virtualAccountRemoveSplitSuccess: z.ZodObject<{
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
			split_config: z.ZodObject<{}, z.core.$strip>;
			account_name: z.ZodString;
			account_number: z.ZodString;
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
			assigned: z.ZodBoolean;
			active: z.ZodBoolean;
			created_at: z.ZodISODateTime;
			updated_at: z.ZodISODateTime;
		},
		z.core.$strip
	>;
}> = genericResponse.extend({
	data: z.object({
		id: z.number(),
		split_config: z.object(),
		account_name: z.string(),
		account_number: z.string(),
		currency,
		assigned: z.boolean(),
		active: z.boolean(),
		created_at: z.iso.datetime(),
		updated_at: z.iso.datetime(),
	}),
});

export const fetchBanksSuccess: z.ZodObject<{
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
	data: z.ZodArray<
		z.ZodObject<
			{
				provider_slug: z.ZodString;
				bank_id: z.ZodNumber;
				bank_name: z.ZodString;
				id: z.ZodNumber;
			},
			z.core.$strip
		>
	>;
}> = genericResponse.extend({
	data: z.array(
		z.object({
			provider_slug: z.string(),
			bank_id: z.number(),
			bank_name: z.string(),
			id: z.number(),
		}),
	),
});

// Explicit type aliases — prevents TypeScript from inline-expanding z.infer<> in .d.ts files
export type VirtualAccountCreateInput = z.infer<
	typeof virtualAccountCreateInput
>;
export type VirtualAccountAssignment = z.infer<
	typeof virtualAccountAssignmentSchema
>;
export type VirtualAccountBase = z.infer<typeof virtualAccountBaseSchema>;
export type VirtualAccountCreateSuccess = z.infer<
	typeof virtualAccountCreateSuccess
>;
export type VirtualAccountAssignInput = z.infer<
	typeof virtualAccountAssignInput
>;
export type VirtualAccountListInput = z.infer<typeof virtualAccountListInput>;
export type VirtualAccountListSuccess = z.infer<
	typeof virtualAccountListSuccess
>;
export type VirtualAccountFetchSuccess = z.infer<
	typeof virtualAccountFetchSuccess
>;
export type VirtualAccountRequeryInput = z.infer<
	typeof virtualAccountRequeryInput
>;
export type VirtualAccountDeleteSuccess = z.infer<
	typeof virtualAccountDeleteSuccess
>;
export type VirtualAccountAddSplitInput = z.infer<
	typeof virtualAccountAddSplitInput
>;
export type VirtualAccountAddSplitSuccess = z.infer<
	typeof virtualAccountAddSplitSuccess
>;
export type VirtualAccountRemoveSplitInput = z.infer<
	typeof virtualAccountRemoveSplitInput
>;
export type VirtualAccountRemoveSplitSuccess = z.infer<
	typeof virtualAccountRemoveSplitSuccess
>;
export type FetchBanksSuccess = z.infer<typeof fetchBanksSuccess>;
