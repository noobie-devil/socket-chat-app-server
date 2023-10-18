import User from "../models/user.model.js";

const createNewUser = async({username}) => {
    return await User.create({username})
}

export {
    createNewUser
}
