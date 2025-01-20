export async function tryCatch<T>(
  fn: () => Promise<T>
): Promise<{ success: true; value: T } | { success: false; error: unknown }> {
  try {
    return { success: true, value: await fn() } as const
  } catch (error) {
    return { success: false, error } as const
  }
}
