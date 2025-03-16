import mongoose from "mongoose";
import { Document, Schema } from "mongoose";


interface Message extends Document {
   senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    text: string;
    image:  string;

}

const messageSchema = new Schema({
    senderId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    },
    receiverId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    },
    text: {
        type: String,
        required: false,
    }, 
    image: {
        type: String,
        required: false,
    }
}, { timestamps: true });

const Message = mongoose.model<Message>("Message", messageSchema);

export default Message;