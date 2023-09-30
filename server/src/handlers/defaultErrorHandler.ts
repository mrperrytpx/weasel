import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

const defaultErrorHandler = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const err = new ApiError("Resource not found", 404, req.url);
    console.log("METHOD: ", req.method);
    next(err);
};

export { defaultErrorHandler };
