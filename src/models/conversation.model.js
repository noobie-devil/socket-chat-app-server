import mongoose, {Schema} from "mongoose";
import {dateToNumber, longTimestampsPlugin} from "../utils/common.utils.js";

const ConversationSchema = new Schema({
    userJoined: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    messages: [
        {
            message: {
                type: String,
                required: true
            },
            messageType: {
                type: String,
                required: true
            },
            sender: {
                type: String,
                required: true
            },
            seen: {
                type: Boolean,
                default: false
            },
            sendAt: {
                type: Number,
                default: Date,
                set: dateToNumber
            }
        }
    ],
    lastMessage: {
        type: String,
        required: true
    },
    lastMessageType: {
        type: String,
        required: true
    },
    lastSender: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

ConversationSchema.plugin(longTimestampsPlugin)
ConversationSchema.index({createdBy: 1, userJoined: 1}, {})

const Conversation = mongoose.model("Conversation", ConversationSchema)
export default Conversation
