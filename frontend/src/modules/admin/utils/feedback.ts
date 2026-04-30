import { message } from 'ant-design-vue'
import { getErrorMessage } from '@/utils/getErrorMessage'

export function notifyAdminSuccess(text: string) {
  message.success(text)
}

export function notifyAdminError(error: unknown, fallback = 'Action failed.') {
  const resolved = getErrorMessage(error, fallback)
  message.error(resolved)
  return resolved
}

