import express from "express";
import {asyncHandler} from "../utils/common.utils.js";
import {createNewConversation, findConversation} from "../controllers/conversation.controller.js";

const conversationRouter = express.Router()
conversationRouter.get("/find", asyncHandler(findConversation))
conversationRouter.post("/", asyncHandler(createNewConversation))

export default conversationRouter
