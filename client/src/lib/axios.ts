import axios from "axios";


export const axiosInstance = axios.create({
    baseURL: "http://localhost:1256/api/",
    withCredentials: true,
});