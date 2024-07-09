import { z } from 'zod'
import { jsonWebKeySchema } from './jsonWebKey'

export const jsonWebKeySetSchema = z.object({
  keys: z.array(jsonWebKeySchema),
})

export type JsonWebKeySet = z.input<typeof jsonWebKeySetSchema>
