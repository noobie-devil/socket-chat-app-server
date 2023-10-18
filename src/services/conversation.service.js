import * as conversationRepo from "../repositories/conversation.repository.js";
import User from "../models/user.model.js";
export const createNewConversation = async(req) => {
    const {receiverId, senderId} = req.body
    const conversation = await conversationRepo.createNewConversation(req.body)
    await User.findByIdAndUpdate(receiverId, { $push: {conversations: conversation._id}})
    await User.findByIdAndUpdate(senderId, { $push: {conversations: conversation._id}})
    return conversation
}

export const findConversation = async(req) => {
    const {receiverId, senderId} = req.query

    return await conversationRepo.findConversation(receiverId, senderId)
}
