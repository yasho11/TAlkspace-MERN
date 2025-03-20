import axios from "axios";

// Create an axios instance
// This instance will be used to make all API requests
// The baseURL is the base URL of the API
// withCredentials is set to true to send cookies along with the request
// This is important for authentication
export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:1256/api/" : "/api",
    withCredentials: true,
});