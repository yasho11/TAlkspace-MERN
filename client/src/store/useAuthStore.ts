import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import axios from "axios";


interface AuthStore {
    authUser: any; // Replace 'any' with the appropriate type
    checkAuth: () => void;
    isCheckingAuth: boolean;
    isSigningUp: boolean;
    signup: (data: any) => void; // Replace 'any' with the appropriate type
}

export const useAuthStore = create<AuthStore>((set) => ({
    authUser: null,
    isSigningUp: false,
    isSigningIn: false,
    isSigningOut: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,


    checkAuth: async () => { //this function is used to check if the user is authenticated
        try {
            const response = await axiosInstance.get("/auth/check"); //this is the route that checks if the user is authenticated
            set({ authUser: response.data });//if the user is authenticated, the response is stored in the authUser state
        } catch (error) {
            console.log("Error in checkAuth: ",error);
            set({authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

   signup: async (data) => {
        try {
            set({ isSigningUp: true });
            const response = await axiosInstance.post("/auth/signup", data);
            set({ authUser: response.data });
            toast.success("Account created successfully!");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Signup error:", error.response?.data);
                toast.error(error.response?.data?.message || "Signup failed!");
            } else {
                console.error("Unexpected error:", error);
                toast.error("Something went wrong!");
            }
        } finally {
            set({ isSigningUp: false });
        }
    },
    

}));