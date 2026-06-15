function collectErrorMessages(error: unknown): string {
  const messages: string[] = []
  let current: unknown = error

  for (let depth = 0; depth < 6 && current; depth += 1) {
    if (current instanceof Error) {
      messages.push(current.message)
      current = current.cause
      continue
    }

    if (typeof current === 'object' && current && 'message' in current) {
      messages.push(String((current as { message: unknown }).message))
    }

    break
  }

  return messages.join(' ').toLowerCase()
}

export function isTransientRemoteError(error: unknown): boolean {
  const text = collectErrorMessages(error)

  return (
    text.includes('502') ||
    text.includes('503') ||
    text.includes('504') ||
    text.includes('429') ||
    text.includes('d1_error') ||
    text.includes('failed to parse body as json') ||
    text.includes('econnreset') ||
    text.includes('etimedout') ||
    text.includes('fetch failed') ||
    text.includes('socket hang up')
  )
}

export async function retryTransient<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number
    baseDelayMs?: number
    label?: string
  } = {},
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? 5
  const baseDelayMs = options.baseDelayMs ?? 2000
  const label = options.label ?? 'operation'

  let lastError: unknown

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      if (!isTransientRemoteError(error) || attempt === maxAttempts) {
        throw error
      }

      const delayMs = baseDelayMs * attempt
      console.warn(
        `  ${label}: transient remote error (attempt ${attempt}/${maxAttempts}), retrying in ${delayMs}ms...`,
      )
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }

  throw lastError
}
