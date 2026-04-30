export function getErrorMessage(err: unknown, fallback = 'Something went wrong.'): string {
  const anyErr = err as any

  return (
    anyErr?.response?.data?.message ||
    anyErr?.message ||
    anyErr?.error ||
    anyErr?.response?.data?.error ||
    fallback
  )
}

