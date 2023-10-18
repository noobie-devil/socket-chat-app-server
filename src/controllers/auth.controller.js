import {CreatedResponse} from "../response/success/success.response.js";
import * as authService from "../services/auth.service.js"

export const register = async(req, res, next) => {
    new CreatedResponse({
        message: "Register success",
        data: await authService.register(req)
    }).send(res)
}
