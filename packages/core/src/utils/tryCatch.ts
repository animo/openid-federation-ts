type Result<T> = { success: true; value: T } | { success: false; error: unknown }

export function tryCatch<T>(fn: () => T): Result<T>
export function tryCatch<T>(fn: () => Promise<T>): Promise<Result<T>>
export function tryCatch<T>(fn: () => T | Promise<T>): Result<T> | Promise<Result<T>> {
  try {
    const result = fn()

    if (result instanceof Promise) {
      return result
        .then((value) => ({ success: true, value }) as const)
        .catch((error: unknown) => ({ success: false, error }) as const)
    }

    return { success: true, value: result }
  } catch (error) {
    return { success: false, error }
  }
}
