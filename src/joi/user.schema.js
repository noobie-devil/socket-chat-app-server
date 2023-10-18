import Joi from "joi";

const registerSchema = Joi.object({
    username: Joi.string()
        .required()
        .min(2)
        .max(50)
        .not("")
        .not(null)
})


export {
    registerSchema
}
