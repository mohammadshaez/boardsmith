import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

export const API_BASE = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_BASE,
});

export const fileUrl = (id) => `${API_BASE}/files/${id}`;

export const resolveFileUrl = (payload) => {
  if (!payload) return "";
  if (typeof payload === "string") return payload;
  if (payload.url) return payload.url;
  if (payload.s3Url) return payload.s3Url;
  if (payload.id) return fileUrl(payload.id);
  return "";
};
