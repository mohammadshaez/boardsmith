import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const API_BASE = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_BASE,
});

export const fileUrl = (id) => `${API_BASE}/files/${id}`;

export const resolveFileUrl = (payload) =>
  payload?.url || (payload?.id ? fileUrl(payload.id) : "");
