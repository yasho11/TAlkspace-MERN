import mongoose from "mongoose";
import { Document, Schema } from "mongoose";

//this file is the model for the message schema in the database 
interface Message extends Document { //this is the interface for the message schema or blueprint
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
}, { timestamps: true });//this is the schema for the message model

const Message = mongoose.model<Message>("Message", messageSchema);

export default Message;