import {create} from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";


interface useChatStore{
    isUsersLoading : boolean;
    isMessagesLoading: boolean;
    selectedUser: string | null;
    getMessages:(userId:string)=> void;
    setSelectedUser: () =>void;
    getUsers:()=> void;
}

interface User {
    id: string;
    name: string;
    // Add other user properties here
}

interface Message {
    id: string;
    text: string;
    userId: string;
    // Add other message properties here
}

interface ChatStoreState {
    message: Message[];
    users: User[];
    selectedUser: string | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    getUsers: () => Promise<void>;
    getMessages: (userId: string) => Promise<void>;
    setSelectedUser: (selectedUser: string | null) => void;
}

export const useChatStore = create<ChatStoreState>((set) => ({
    message: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId: string) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ users: res.data });
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    setSelectedUser: (selectedUser: string | null) => set({ selectedUser }),
}));
