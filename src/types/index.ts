export type GenericResponse = {
	status: boolean;
	message: string;
	data?: object;
};

export type Meta = {
	total: number;
	skipped: number;
	perPage: number;
	page: number;
	pageCount: number;
};
