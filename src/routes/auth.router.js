import express from "express";
import {register} from "../controllers/auth.controller.js";
import {asyncHandler} from "../utils/common.utils.js";


const authRouter = express.Router()
authRouter.post('/register', asyncHandler(register))

export default authRouter
