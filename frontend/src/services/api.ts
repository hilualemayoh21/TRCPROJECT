// src/services/api.ts
import axios from "axios"
import { registerInterceptors } from "./interceptors"

// @ts-ignore - import.meta provided by Vite at build/runtime
export const USE_MOCK_API = String(import.meta.env.VITE_USE_MOCK_API || 'false').toLowerCase() === 'true'

export const api = axios.create({
  // Hardcoded to ensure it works even if env is missing
  baseURL: 'https://trc-backend.onrender.com',
  timeout: 90000, // 90s — extremely safe for slow cold starts
  headers: {
    "Content-Type": "application/json"
  }
})

// @ts-ignore
if (typeof window !== 'undefined') { window.__TRC_API__ = api; }
console.info('[API] Base URL:', api.defaults.baseURL)


registerInterceptors(api)