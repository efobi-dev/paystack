export class Fetcher {
	protected secretKey: string;
	private baseUrl: string;

	constructor(secretKey: string, baseUrl: string) {
		this.secretKey = secretKey;
		this.baseUrl = baseUrl;
	}

	async fetcher(
		path: string,
		method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
		body?: object,
	) {
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
