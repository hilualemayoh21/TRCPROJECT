import type { AxiosRequestConfig } from 'axios'
import { api } from './api.adapter'

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await api.get<T>(url, config)
  return ((res.data as any)?.data ?? res.data) as T
}

export async function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await api.post<T>(url, data, config)
  return ((res.data as any)?.data ?? res.data) as T
}

export async function patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await api.patch<T>(url, data, config)
  return ((res.data as any)?.data ?? res.data) as T
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await api.delete<T>(url, config)
  return ((res.data as any)?.data ?? res.data) as T
}

