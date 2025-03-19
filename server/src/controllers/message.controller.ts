import User from "../models/users.model";
import Message from "../models/message.model";
import { Response, Request } from "express";
import cloudinary from "../libs/cloudinary";
import { getReceiverSocketId, io } from "../libs/socket";

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
        const {id: otherUserId} = req.params;

        // Check if both users are provided
        if (!loggedInUser) {
         res.status(400).json({ message: "User IDs are required." });
        }
        if (!otherUserId) {
            res.status(400).json({ message: "Other User IDs are required." });
           }
   
        // Fetch messages between the logged-in user and the other user
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUser._id, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: loggedInUser._id }
            ]
        })
        .sort({ createdAt: 1 }) // Sorting messages by creation date
        .lean(); // Use .lean() for better performance if you don't need Mongoose documents

        console.log(messages);
        
        if (messages.length === 0) {
            res.status(404).json({ message: "No messages found between users." });
        }

        // Return the fetched messages
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
    const {  text, image } = req.body;
    const {id: to} = req.params;
    try {
        const from = req.user._id;  // sender's ID
        let imageUrl;

        // Handle image upload to Cloudinary if provided
        if (image) {
            const uploadedResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadedResponse.secure_url;
        }

        // Create the new message with correct field names for sender and receiver
        const newMessage = new Message({ senderId: from, receiverId: to, text, image: imageUrl });

        // Save the message to the database
        await newMessage.save();
        
        console.log("message sent: " , newMessage);
        // Find the receiver's socket ID for real-time messaging
        const receiverSocketId = getReceiverSocketId(to);
        if (receiverSocketId) {
            // Emit the new message to the receiver
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        // Respond with the message sent successfully
        res.status(201).json({ message: "Message sent successfully", New_Message: newMessage });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error_area: "SendMessage" });
    }
};
