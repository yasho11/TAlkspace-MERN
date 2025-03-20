import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

// Define User type
interface User {
    _id: string;
    name: string;
    email: string;
    profileUrl?: string; // Ensure consistency with `profilePic` field
}

interface MessageData {
    text: string;
    image: string | null;  // Since the image can be null before being selected
  }

// Define Message type
interface Message {
    _id: string; // MongoDB automatically assigns this
    senderId: string; // The ID of the sender
    receiverId: string; // The ID of the receiver
    text?: string; // Optional text message
    image?: string; // Optional image URL
    createdAt?: Date;// Timestamp for when the message was sent
    updatedAt?: Date; // Timestamp for last update (if any)
}


// Define Zustand Store Type
interface ChatStoreState {
    messages: Message[];  // Fixed incorrect `message` key
    users: User[];
    selectedUser: User | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    getUsers: () => Promise<void>;
    getMessages: (userId: string) => Promise<void>;
    SendMessage: (messageData:MessageData) => Promise<void>;
    subscribeToMessages: () => Promise<void>;
    unsubscribeFromMessages: ()=> Promise<void>;
    setMessages:(messages: any[])=> Promise<void>;
    setSelectedUser: (selectedUser: User | null) => void;
}
// Create Zustand Store
export const useChatStore = create<ChatStoreState>((set, get) => ({
    messages: [],  // Fixed key name from `message` to `messages`
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    // Fetch Users
    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            
            // Ensure users array exists before setting state
            if (res.data?.Users) {
                set({ users: res.data.Users });
                console.log("Users from chatstore:", res.data.Users);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch users");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    // Fetch Messages for Selected User
    getMessages: async (userId: string) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            // Correctly set messages from res.data.Messages
            set({ messages: Array.isArray(res.data.Messages) ? res.data.Messages : [] });
            console.log("Chat store: ", res.data.Messages); // Confirm correct data
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch messages");
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    
    SendMessage: async (messageData: MessageData) => {
        const { selectedUser, messages } = get();
        try {
            if (selectedUser) {
                const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
                set({ messages: [...messages, res.data] });
            }
        } catch (error: any) {
            console.error("SendMessage Error:", error);
    
            if (error.response) {
                // Handle API response errors (e.g., status code errors)
                toast.error(error.response.data?.message || "Failed to send message.");
            } else if (error.request) {
                // Handle network errors (request sent but no response)
                toast.error("Network error: No response from server.");
            } else {
                // Handle other errors
                toast.error("An unexpected error occurred.");
            }
        }
    },
    
    subscribeToMessages: async () => {
        return new Promise<void>((resolve) => {
            const { selectedUser } = get();
            if (selectedUser) {
                const socket = useAuthStore.getState().socket;

                if (socket) {
                    socket.on("newMessage", (newMessage) => {
                        const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;

                        if (!isMessageSentFromSelectedUser) return;

                        set({
                            messages: [...get().messages, newMessage],
                        });
                    });
                }
            }
            resolve();
        });
    },

    unsubscribeFromMessages: ()=>{
        return new Promise<void>((resolve)=>{
            const socket = useAuthStore.getState().socket;
            socket?.off("newMessage");
            resolve();
        })

    },

    // Set Selected User
    setSelectedUser: (selectedUser: User | null) => {
        set({ selectedUser, messages: [] }); // Clear messages before updating selectedUser
    },
    setMessages: (messages: any[]) => Promise.resolve(set({ messages })),
      



}));
