// src/services/api.ts
import axios from "axios"
import { registerInterceptors } from "./interceptors"

// @ts-ignore - import.meta provided by Vite at build/runtime
export const USE_MOCK_API = String(import.meta.env.VITE_USE_MOCK_API || 'false').toLowerCase() === 'true'

export const api = axios.create({
  // Fallback to Render if VITE_API_BASE is not defined
  baseURL: import.meta.env.VITE_API_BASE || 'https://trc-backend.onrender.com/api',
  timeout: 90000,
})

// @ts-ignore
if (typeof window !== 'undefined') { window.__TRC_API__ = api; }
console.info('[API] Base URL:', api.defaults.baseURL)


registerInterceptors(api)