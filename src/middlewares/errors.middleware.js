import {NotFoundError} from "../response/error/notFound.error.js";
import {ValidationError} from "../response/error/validation.error.js";
import {BaseError} from "../response/error/base.error.js";
import {InternalServerError} from "../response/error/internalServer.error.js";
import Joi from "joi";

export const notFound = (req, res, next) => {
    const error = new NotFoundError();
    next(error);
}

export const errorHandler = (err, req, res, next) => {
    console.log("Error caught in errorHandler:", err.stack);

    if(err instanceof Joi.ValidationError) {
        err = new ValidationError({
            error: err
        })
    }
    if(!(err instanceof BaseError)) {
        err = new InternalServerError();
    }
    if(err.errorMessage) {
        return res.status(err.statusCode).json({ error: err.errorMessage });
    } else {
        return res.status(err.statusCode);

    }
}
