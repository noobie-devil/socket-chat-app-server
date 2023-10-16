import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { Server } from "socket.io";
import {createServer} from "node:http";
import Conversation from "./models/conversation.model.js";
import User from "./models/user.model.js";
import mongoose from "mongoose";


const app = express()
app
    .use(bodyParser.json())
    .use(helmet())
    .use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}))
    .use(helmet.hidePoweredBy())
    .use(helmet.noSniff())
    .use(helmet.permittedCrossDomainPolicies())
    .use(compression())
    .use(cors())

const httpServer = createServer(app)
const io = new Server(httpServer, {})

const users = {}
const rooms = {}

const publishActionNs = io.of("/")
publishActionNs.on("connection", (socket) => {
    socket.on('register', (data) => {
        const { id, username } = data
        users[id] = {
            socketId: socket.id,
            username: username
        }
    })

    socket.on("newConversation", async (data, callback) => {
        const {receiverId, senderId, message, messageType, senderUsername, sendAt} = data
        const conversation = existConversation(receiverId, senderId)
        let conversationId = null
        if (!conversation) {
            try {
                const nwConv = await Conversation.create(newConversationObj(receiverId, senderId, message, messageType, senderUsername, sendAt))
                await User.findByIdAndUpdate(receiverId, { $push: {conversations: nwConv._id}})
                await User.findByIdAndUpdate(senderId, { $push: {conversations: nwConv._id}})
                conversationId = nwConv._id
            } catch (e) {

            }
        } else {
            conversationId = conversation._id
        }
        if(conversationId !== null) {
            const receiverSocketId = users[receiverId].socketId
            const senderSocketId = users[senderId].socketId
            if(receiverSocketId) {
                publishActionNs.to(receiverSocketId).socketsJoin(conversationId)
                publishActionNs.to(receiverSocketId).emit('newConversation', { conversationId: conversationId})

            }
            if(senderSocketId) {
                publishActionNs.to(senderSocketId).socketsJoin(conversationId)
                rooms[conversationId] = publishActionNs.to(conversationId)
                callback({success: true, data: {conversationId: conversationId} })
            }
            return
        }
        callback({success: false, errorMessage: "Error occurred"})

    })

    socket.on("message", async (data, callback) => {
        const {conversationId, senderId, receiverId, lastMessage, lastMessageType, sendAt} = data
        if (!rooms[conversationId]) {
            const sender = users[senderId]
            if (sender) {
                const senderSocketId = sender.socketId
                const senderName = sender.username
                await Conversation.findByIdAndUpdate(conversationId, {
                    lastMessage,
                    lastMessageType,
                    lastSender: senderName,
                    updatedAt: sendAt,
                    $push: {
                        messages: {
                            message: lastMessage,
                            messageType: lastMessageType,
                            sender: senderName,
                            sendAt
                        }
                    }
                })
            }
        }
    })
})

const newConversationObj = (receiverId, senderId, message, messageType, senderUsername, sendAt) => {
    return {
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
    }
}

const existConversation = async(receiverId, senderId) => {
    try {
        const found = await User.findOne({ _id: senderId}, 'conversations')
            .populate({
                path: 'conversations',
                match: {
                    $or: [
                        { createdBy: receiverId},
                        { userJoined: { "$in": [receiverId] }}
                    ]
                }
            }, 'conversations')
        if(!found.conversations && found.conversations.length > 0) {
            return found.conversations[0]
        }
        return null
    } catch (e) {
        console.log(e)
    }
}

export {
    httpServer, io
}
