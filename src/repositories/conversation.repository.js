import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";


const createNewConversation = async({receiverId, senderId, message, messageType, senderUsername, sendAt}) => {
    sendAt = new Date().getTime()
    return await Conversation.create({
        userJoined: [receiverId],
        lastMessage: message,
        lastMessageType: messageType,
        createdBy: senderId,
        lastSender: senderUsername,
        messages: [
            {
                message,
                messageType,
                sender: senderUsername,
                sendAt
            }
        ]
    })
}

const findConversation = async(receiverId, senderId) => {
    try {
        const found = await User.findOne({ _id: senderId}, 'conversations')
            .populate({
                path: 'conversations',
                match: {
                    $or: [
                        { createdBy: receiverId},
                        { userJoined: { "$in": [receiverId] }}
                    ]
                },
            })
        if(found.conversations && found.conversations.length > 0) {
            return found.conversations[0]
        }
        return null
    } catch (e) {
        console.log(e)
    }
}

export {
    createNewConversation,
    findConversation,
}
