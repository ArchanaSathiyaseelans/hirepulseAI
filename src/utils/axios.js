import axios from "axios";

// Single-deployment setup:
// Route all /api requests to the same origin ("") so Vercel or Express serves them directly.
// Only use a custom VITE_BACKEND_URL if it is a valid non-localhost remote URL.
const rawUrl = (import.meta.env.VITE_BACKEND_URL || '').trim();
let baseURL = "";

if (rawUrl && !rawUrl.includes("localhost") && !rawUrl.includes("127.0.0.1")) {
  baseURL = rawUrl;
}

const api = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 30000,
});

api.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem('hirepulse_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            config.headers['x-session-id'] = token;
        }
    } catch (e) {
        // localStorage might be restricted in strict iframe sandboxes
    }
    return config;
});

export default api;
