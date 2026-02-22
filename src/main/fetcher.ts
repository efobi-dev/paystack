/**
 * The Fetcher class provides a base for making API requests to Paystack.
 * It handles authentication and basic request/response parsing.
 */
export class Fetcher {
	protected secretKey: string;
	private baseUrl: string;

	/**
	 * Creates an instance of the Fetcher.
	 * @param secretKey - Your Paystack secret key.
	 * @param baseUrl - The base URL for the Paystack API.
	 */
	constructor(secretKey: string, baseUrl: string) {
		this.secretKey = secretKey;
		this.baseUrl = baseUrl;
	}

	/**
	 * Makes an API request to Paystack.
	 * @param path - The API endpoint path.
	 * @param method - The HTTP method (GET, POST, PUT, DELETE). Defaults to GET.
	 * @param body - The request body for POST and PUT requests.
	 * @returns A Promise that resolves to an object containing the raw response and the parsed JSON data.
	 */
	async fetcher(
		path: string,
		method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
		body?: object,
	): Promise<{
		response: Response;
		raw: unknown;
	}> {
		let url = `${this.baseUrl}${path}`;
		const init: RequestInit = {
			method,
			headers: {
				Authorization: `Bearer ${this.secretKey}`,
			},
		};

		if (method === "GET" && body && Object.keys(body).length) {
			const params = new URLSearchParams();
			for (const [key, value] of Object.entries(body)) {
				if (value == null) continue;
				if (Array.isArray(value)) {
					for (const v of value) params.append(key, String(v));
				} else {
					params.append(key, String(value));
				}
			}
			const qs = params.toString();
			if (qs) url += (url.includes("?") ? "&" : "?") + qs;
		} else if (body !== undefined) {
			init.headers = {
				...init.headers,
				"Content-Type": "application/json",
			};
			init.body = JSON.stringify(body);
		}

		const response = await fetch(url, init);
		const raw = await response.json().catch(() => null as unknown);

		if (!response.ok) {
			console.error("API Error Response:", raw);
		}
		return { response, raw };
	}
}
