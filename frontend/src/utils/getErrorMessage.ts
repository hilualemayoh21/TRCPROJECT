export function getErrorMessage(err: unknown, fallback = 'Something went wrong.'): string {
  const anyErr = err as any

  // 1. Direct parsed interceptor JSON format (err.error.message)
  if (anyErr?.error?.message && typeof anyErr.error.message === 'string') {
    return anyErr.error.message
  }

  // 2. Axios response format (err.response.data.error.message)
  if (anyErr?.response?.data?.error?.message && typeof anyErr.response.data.error.message === 'string') {
    return anyErr.response.data.error.message
  }

  // 3. Axios fallback message (err.response.data.message)
  if (anyErr?.response?.data?.message && typeof anyErr.response.data.message === 'string') {
    return anyErr.response.data.message
  }

  // 4. Standalone string in err.error
  if (anyErr?.error && typeof anyErr.error === 'string') {
    return anyErr.error
  }

  // 5. Native JS error message
  if (anyErr?.message && typeof anyErr.message === 'string') {
    return anyErr.message
  }

  return fallback
}

