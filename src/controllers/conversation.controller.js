import {CreatedResponse, OkResponse} from "../response/success/success.response.js";
import * as conversationService from "../services/conversation.service.js";

export const createNewConversation = async (req, res, next) => {
    new CreatedResponse({
        data: await conversationService.createNewConversation(req)
    }).send(res)
}

export const findConversation = async(req, res, next) => {
    new OkResponse({
        data: await conversationService.findConversation(req)
    }).send(res)
}
