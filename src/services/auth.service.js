import {registerSchema} from "../joi/user.schema.js";
import User from "../models/user.model.js";
import {ValidationError} from "../response/error/validation.error.js";
import {createNewUser} from "../repositories/user.repository.js";


export const register = async(req) => {
    await registerSchema.validateAsync(req.body)
    const existUser = await User.findOne(req.body).lean()
    if(existUser) throw new ValidationError({
        message: 'This username is already been registered',
        statusCode: 409
    })
    return createNewUser(req.body)
}
