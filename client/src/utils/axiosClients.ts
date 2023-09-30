import axios from "axios";

export const apiInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    headers: {
        "Content-Type": "application/json",
    },
    signal: new AbortController().signal,
});
