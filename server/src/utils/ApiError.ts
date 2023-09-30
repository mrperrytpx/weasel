class ApiError extends Error {
    code: number;
    url: string;

    constructor(message: string, code: number, url: string) {
        super(message);
        this.code = code;
        this.url = url;
    }
}

export { ApiError };
