import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import axios from "axios";
import {io, Socket} from "socket.io-client";

// Define BASE_URL or import it from your environment configuration
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:1256":"/";


interface AuthStore {
    authUser: any; // Replace 'any' with the appropriate type
    isCheckingAuth: boolean;
    isSigningUp: boolean;
    isSigningOut: boolean;
    isSigningIn: boolean;
    isUpdatingProfile: boolean;
    socket: Socket | null;
    onlineUsers: String[] ;
    connectSocket: () => void;
    disconnectSocket: () => void;
    checkAuth: () => void;
    signin: (data: any) => void; // Replace 'any' with the appropriate type
    logout: () => void;
    signup: (data: any) => void; // Replace 'any' with the appropriate type
    updateProfile: (data: any) => void; // Replace 'any' with the appropriate type
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isSigningIn: false,
    isSigningOut: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    socket: null,
    onlineUsers: [],
    //?--------------------------------------------------------------
    //! @name: checkAuth
    //! @description: This function is used to check if the user is authenticated

    checkAuth: async () => { //this function is used to check if the user is authenticated
        try {
            const response = await axiosInstance.get("/auth/check"); //this is the route that checks if the user is authenticated
            set({ authUser: response.data });//if the user is authenticated, the response is stored in the authUser state
            console.log("Auth user: ", response.data);
        } catch (error) {
            console.log("Error in checkAuth: ",error);
            set({authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    //?--------------------------------------------------------------
    //! @name: signup
    //! @param: data
    //! @description: This function is used to create a new account

   signup: async (data) => {
        try {
            set({ isSigningUp: true });
            const response = await axiosInstance.post("/auth/signup", data);
            set({ authUser: response.data });
            toast.success("Account created successfully!");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Signup error:", error.response?.data);
                console.log("Before toast");
                toast.error(error.response?.data?.message || "Signup failed!");
                console.log("After toast");
            } else {
                console.error("Unexpected error:", error);
                toast.error("Something went wrong!");
            }
        } finally {
            set({ isSigningUp: false });
        }
    },
     
    //?--------------------------------------------------------------
    //! @name: signout
    //! @description: This function is used to sign out the user
    logout: async () => {
        try {
            set({ isSigningOut: true });
            await axiosInstance.post("/auth/signout");
            set({ authUser: null });
            toast.success("Signed out successfully!");
        } catch (error) {
            console.error("Signout error:", error);
            toast.error("Signout failed!");
        } finally {
            set({ isSigningOut: false });
        }
    },

    //?--------------------------------------------------------------
    //! @name: signin
    //! @param: data
    //! @description: This function is used to sign in the user
    signin: async (data) => {
        try {
            set({ isSigningIn: true });
            const response = await axiosInstance.post("/auth/signin", data);
            set({ authUser: response.data });
            toast.success("Signed in successfully!");
        } catch (error) {  
            if (axios.isAxiosError(error)) {
                console.error("Signin error:", error.response?.data);
                toast.error(error.response?.data?.message || "Signin failed!");
            } else {
                console.error("Unexpected error:", error);
                toast.error("Something went wrong!");
            }
        } finally {
            set({ isSigningIn: false });
        }
    },

    //?--------------------------------------------------------------
    //! @name: updateProfile
    //! @param: data
    //! @description: This function is used to update the user's profile
    updateProfile: async (data) => {
        try {
            set({ isUpdatingProfile: true });
            const response = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: response.data });
            toast.success("Profile updated successfully!");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Update profile error:", error.response?.data);
                toast.error(error.response?.data?.message || "Update profile failed!");
            } else {
                console.error("Unexpected error:", error);
                toast.error("Something went wrong!");
            }
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () =>{
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });
        socket.connect();

        set({socket: socket});

        socket.on("getOnlineUsers", (userIds)=>{
            set({onlineUsers: userIds});
        });
    },
    disconnectSocket: () =>{
        const socket = get().socket;
        if (socket && socket.connected) socket.disconnect();
    },

}));