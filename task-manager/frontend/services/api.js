import axios from 'axios';

const API = axios.create({
    baseURL: 'https://turbo-winner-74gv96gww67fx95v-5000.app.github.dev/api',
});

API.interceptors.request.use((config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
