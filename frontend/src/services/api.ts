// src/services/api.ts
import axios from "axios"
import { registerInterceptors } from "./interceptors"

// @ts-ignore - import.meta provided by Vite at build/runtime
export const USE_MOCK_API = String(import.meta.env.VITE_USE_MOCK_API || 'false').toLowerCase() === 'true'

export const api = axios.create({
  // @ts-ignore - import.meta provided by Vite at build/runtime
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
})

registerInterceptors(api)