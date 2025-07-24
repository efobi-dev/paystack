export class Fetcher {
	private secretKey: string;
	private baseUrl: string;

	constructor(secretKey: string, baseUrl: string) {
		this.secretKey = secretKey;
		this.baseUrl = baseUrl;
	}

	async fetcher(
		path: string,
		method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
		body?: object,
		searchParams?: URLSearchParams,
	) {
		const url = searchParams
			? `${this.baseUrl}${path}?${searchParams}`
			: `${this.baseUrl}${path}`;

		const response = await fetch(url, {
			method,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.secretKey}`,
			},
			...(body && { body: JSON.stringify(body) }),
		});

		const raw = await response.json();
		return { response, raw };
	}
}
