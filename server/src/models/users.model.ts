
import mongoose, { Document, Schema } from "mongoose";
//this file is the model for the user schema in the database
//this is the interface for the user schema or blueprint
interface User extends Document {
    name: string;
    email: string;
    password: string;
    profileUrl: string;
}  


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
    },
    profileUrl: {
        type: String,
        required: false,
    }
}, { timestamps: true }); //this is the schema for the user model

const User = mongoose.model<User>("User", userSchema);

export default User;