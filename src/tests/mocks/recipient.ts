export const mockCreateRecipientResponse = {
	status: true,
	message: "Recipient created",
	data: {
		active: true,
		createdAt: "2020-05-27T11:43:04.000Z",
		currency: "NGN",
		domain: "test",
		id: 28,
		integration: 100032,
		name: "John Doe",
		recipient_code: "RCP_1a2b3c4d5e6f7g8",
		type: "nuban",
		updatedAt: "2020-05-27T11:43:04.000Z",
		is_deleted: false,
		details: {
			authorization_code: null,
			account_number: "0000000000",
			account_name: "John Doe",
			bank_code: "058",
			bank_name: "Guaranty Trust Bank",
		},
	},
};

export const mockBulkCreateRecipientResponse = {
	status: true,
	message: "Recipients created",
	data: {
		success: [
			{
				domain: "test",
				name: "John Doe",
				type: "nuban" as const,
				description: "Test recipient",
				currency: "NGN" as const,
				metadata: null,
				details: {
					account_number: "0000000000",
					account_name: "John Doe",
					bank_code: "058",
					bank_name: "Guaranty Trust Bank",
				},
				recipient_code: "RCP_1a2b3c4d5e6f7g8",
				active: true,
				id: 28,
				isDeleted: false,
				createdAt: "2020-05-27T11:43:04.000Z",
				updatedAt: "2020-05-27T11:43:04.000Z",
			},
		],
		errors: [],
	},
};

export const mockListRecipientsResponse = {
	status: true,
	message: "Recipients retrieved",
	data: [
		{
			domain: "test",
			type: "nuban" as const,
			currency: "NGN" as const,
			name: "John Doe",
			details: {
				account_number: "0000000000",
				account_name: "John Doe",
				bank_code: "058",
				bank_name: "Guaranty Trust Bank",
			},
			metadata: {},
			recipient_code: "RCP_1a2b3c4d5e6f7g8",
			active: true,
			id: 28,
			createdAt: "2020-05-27T11:43:04.000Z",
			updatedAt: "2020-05-27T11:43:04.000Z",
		},
	],
	meta: {
		total: 1,
		skipped: 0,
		perPage: 50,
		page: 1,
		pageCount: 1,
	},
};

export const mockFetchRecipientResponse = {
	status: true,
	message: "Recipient retrieved",
	data: {
		integration: 100032,
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
		recipient_code: "RCP_1a2b3c4d5e6f7g8",
		active: true,
		email: null,
		id: 28,
		isDeleted: false,
		createdAt: "2020-05-27T11:43:04.000Z",
		updatedAt: "2020-05-27T11:43:04.000Z",
	},
};

export const mockUpdateRecipientResponse = {
	status: true,
	message: "Recipient updated",
};

export const mockDeleteRecipientResponse = {
	status: true,
	message: "Recipient has been deleted",
};

export const mockRecipientErrorResponse = {
	status: false,
	message: "Invalid key",
};
