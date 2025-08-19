import { spyOn } from "bun:test";
import type { z } from "zod";
import type { genericResponse } from "../../zod";

export * from "./miscellaneous";
export * from "./split";
export * from "./transaction";
export * from "./transfer";
export * from "./verification";
export * from "./virtual";
export * from "./webhook";

export const mockErrorResponse: z.infer<typeof genericResponse> = {
	status: false,
	message: "Invalid key",
};

/**
 * Mock for the global fetch function
 * @param response - The response body to return
 * @param ok - Whether the response should be successful (status 200) or not (status 400)
 * @returns A spy on the global fetch function
 */
export const mockFetch = (response: unknown, ok: boolean) => {
	return spyOn(global, "fetch").mockResolvedValue(
		new Response(JSON.stringify(response), {
			status: ok ? 200 : 400,
			headers: { "Content-Type": "application/json" },
		}),
	);
};

export function mockFetcher<T>(data: T, ok: boolean) {
	return async () => {
		return {
			response: {
				ok,
				status: ok ? 200 : 400,
			},
			raw: data,
		};
	};
}
