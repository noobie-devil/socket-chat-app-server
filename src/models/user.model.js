import mongoose, {Schema} from "mongoose";
import {dateToNumber, longTimestampsPlugin} from "../utils/common.utils.js";

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    isOnline: {
        type: Boolean
    },
    conversations: [
        {
            type: Schema.Types.ObjectId,
            ref: "Conversation"
        }
    ]
}, {
    timestamps: true
})


UserSchema.plugin(longTimestampsPlugin)
UserSchema.index({username: 1}, {unique: true})

const User = mongoose.model("User", UserSchema)
export default User
