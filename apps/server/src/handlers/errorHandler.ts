import { ApiError } from "../utils/ApiError";
import { Request, ErrorRequestHandler, Response, NextFunction } from "express";

const errorHandler = (
    err: ErrorRequestHandler,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    // console.log("ERROR:", err);
    if (err instanceof ApiError) {
        return res.status(err.code).end(err.message);
    }

    return res.status(500).end("Something went wrong");
};

export { errorHandler };
