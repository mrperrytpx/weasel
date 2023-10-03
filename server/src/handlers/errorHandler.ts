import { ApiError } from "../utils/ApiError";
import { Request, ErrorRequestHandler, Response, NextFunction } from "express";

const errorHandler = (
    err: ErrorRequestHandler,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.log("ERROR:", err);
    if (err instanceof ApiError) {
        res.status(err.code).json(err.message);
        return;
    }

    res.status(500).json("Something went wrong");
};

export { errorHandler };
