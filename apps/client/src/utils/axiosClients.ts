import axios from "axios";

export const apiInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    signal: new AbortController().signal,
});
