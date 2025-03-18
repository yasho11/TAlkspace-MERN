import User from "../models/users.model";
import Message from "../models/message.model";
import { Response, Request } from "express";
import cloudinary from "../libs/cloudinary";

// ✅ Extend Express Request Type

interface AuthRequest extends Request {
    user?: any;  // You can replace `any` with `UserType` if you have a TypeScript type for User
}   


//?------------------------------------------------------------------------------------------------------
//! @name: getUsersForSidebar
//! @param: req, res
//! @desc: Get all users except the logged in user


export const getUsersForSidebar = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const loggedInUser = req.user;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUser._id } }).select("-password");


        res.status(200).json({ Users:   filteredUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error_area: "getUsersForSidebar" });
    }
};

//?------------------------------------------------------------------------------------------------------
//! @name: getMessages
//! @param: req, res
//! @desc: Get messages between two users


export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const loggedInUser = req.user;
        const otherUserId = req.params.id;
        const messages = await Message.find({
            $or: [
                { from: loggedInUser._id, to: otherUserId },
                { from: otherUserId, to: loggedInUser._id }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json({ Messages: messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error_area: "getMessages" });
    }
};


//?------------------------------------------------------------------------------------------------------
//! @name: SendMessage
//! @param: req, res
//! @desc: Send message to user

// ✅ Send Message

export const SendMessage = async (req: AuthRequest, res: Response): Promise<void> => {  
    const { id:to, text,image } = req.body;
    try {
        const from = req.user._id;
        let imageUrl;

        if(image){
            //Upload base64 image to cloudinary
            const uploadedResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadedResponse.secure_url;
        }


        const newMessage = new Message({ from, to, text , image: imageUrl});

     
        await newMessage.save();


        res.status(201).json({ message: "Message sent successfully", New_Message: newMessage });


        //to-do: Realtime functionality goes here=> Emit socket event

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error_area: "SendMessage" });
    }
};