import { z } from 'zod'

export const swapValidators = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  newValidator: z.ZodSchema
): z.ZodObject<Record<string, typeof newValidator>> => {
  return z.object(
    Object.keys(schema.shape).reduce(
      (acc, key) => {
        acc[key as keyof typeof acc] = newValidator
        return acc
      },
      {} as { [k in keyof T]: z.ZodSchema }
    )
  )
}
