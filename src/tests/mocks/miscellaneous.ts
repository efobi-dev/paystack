import type { z } from "zod";
import type {
	miscellaneousListBanksSuccess,
	miscellaneousListCountriesSuccess,
	miscellaneousListStatesSuccess,
} from "../../zod/miscellaneous";

export const mockListBanksResponse: z.infer<
	typeof miscellaneousListBanksSuccess
> = {
	status: true,
	message: "Banks retrieved",
	data: [
		{
			name: "Test Bank",
			slug: "test-bank",
			code: "000",
			longcode: "000000",
			gateway: null,
			pay_with_bank: true,
			active: true,
			is_deleted: false,
			country: "Nigeria",
			currency: "NGN",
			type: "nuban",
			id: 1,
			createdAt: "2024-01-01T12:00:00.000Z",
			updatedAt: "2024-01-01T12:00:00.000Z",
		},
	],
};

export const mockListCountriesResponse: z.infer<
	typeof miscellaneousListCountriesSuccess
> = {
	status: true,
	message: "Countries retrieved",
	data: [
		{
			id: 1,
			name: "Nigeria",
			iso_code: "NG",
			default_currency_code: "NGN",
			integration_defaults: {},
			relationships: {
				currency: { type: "currency", data: ["NGN"] },
				integration_feature: { type: "integration_feature", data: [] },
				integration_type: { type: "integration_type", data: [] },
				payment_method: { type: "payment_method", data: [] },
			},
		},
	],
};

export const mockListStatesResponse: z.infer<
	typeof miscellaneousListStatesSuccess
> = {
	status: true,
	message: "States retrieved",
	data: [
		{
			name: "Lagos",
			slug: "lagos",
			abbreviation: "LA",
		},
	],
};
