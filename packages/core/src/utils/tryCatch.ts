type Result<T> = { success: true; value: T } | { success: false; error: unknown }

export function tryCatch<TReturn>(
  fn: () => TReturn
): TReturn extends Promise<infer T> ? Promise<Result<T>> : Result<TReturn> {
  try {
    const result = fn()

    if (result instanceof Promise) {
      return result
        .then((value) => ({ success: true, value }) as const)
        .catch((error: unknown) => ({ success: false, error }) as const) as TReturn extends Promise<infer T>
        ? Promise<Result<T>>
        : never
    }

    return { success: true, value: result } as TReturn extends Promise<infer T> ? Promise<Result<T>> : Result<TReturn>
  } catch (error) {
    return { success: false, error } as TReturn extends Promise<infer T> ? Promise<Result<T>> : Result<TReturn>
  }
}
