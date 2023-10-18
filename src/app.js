import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { Server } from "socket.io";
import {createServer} from "node:http";
import Conversation from "./models/conversation.model.js";
import User from "./models/user.model.js";
import router from "./routes/index.js";
import {errorHandler, notFound} from "./middlewares/errors.middleware.js";
import {findConversation} from "./repositories/conversation.repository.js";


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
    .use('/api', router)
    .use(notFound)
    .use(errorHandler)

const httpServer = createServer(app)
const io = new Server(httpServer, {})

let users = {}
let rooms = {}

const publishActionNs = io.of("/")
publishActionNs.on("connection", (socket) => {
    console.log(`Socket ${socket.id} connected`)

    socket.on('register', (data, callback) => {
        console.log(`register event: socket ${socket.id} - data: ` + data.toString())
        const { id, username } = data
        // users[id] = {
        //     socketId: socket.id,
        //     username: username
        // }
        const saved = {
            socketId: socket.id,
            username: username
        }
        users[id] = saved
        console.log(users)
        callback({success: true, data: { saved }})

    })

    socket.on("newConversation", async (data, callback) => {
        let {receiverId, senderId, message, messageType, senderUsername, sendAt} = data
        sendAt = new Date().getTime()
        const conversation = findConversation(receiverId, senderId)
        let conversationId = null
        if (!conversation) {
            try {
                const nwConv = await Conversation.create(newConversationObj(receiverId, senderId, message, messageType, senderUsername, sendAt))
                console.log(nwConv)
                await User.findByIdAndUpdate(receiverId, { $push: {conversations: nwConv._id}})
                await User.findByIdAndUpdate(senderId, { $push: {conversations: nwConv._id}})
                conversationId = nwConv._id
            } catch (e) {
                console.log(e)
            }
        } else {
            conversationId = conversation._id
        }
        if(conversationId !== null) {
            const receiverSocketId = users[receiverId].socketId
            const senderSocketId = users[senderId].socketId
            if(receiverSocketId) {
                publishActionNs.to(receiverSocketId).socketsJoin(conversationId)
                publishActionNs.to(receiverSocketId).emit('/', {
                    conversationId: conversationId,
                    event: "newConversation",
                    message,
                    messageType,
                    sender: senderUsername,
                    sendAt
                })

            }
            if(senderSocketId) {
                publishActionNs.to(senderSocketId).socketsJoin(conversationId)
                rooms[conversationId] = publishActionNs.to(conversationId)
                callback({success: true, data: {conversationId} })
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



export {
    httpServer, io
}
