import { z } from 'zod'
import { jsonWebKeySchema } from './jsonWebKey'

export const jsonWebKeySetSchema = z.object({
  keys: z.array(jsonWebKeySchema),
})

export type JsonWebKeySetOptions = z.input<typeof jsonWebKeySetSchema>

export type JsonWebKeySet = z.output<typeof jsonWebKeySetSchema>
