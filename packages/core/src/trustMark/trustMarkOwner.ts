import { z } from 'zod'
import { jsonWebKeySetSchema } from '../jsonWeb'

export const trustMarkOwnerSchema = z.record(
  z.string(),
  z.object({
    sub: z.string(),
    jwks: jsonWebKeySetSchema,
  })
)

export type TrustMarkOwner = z.input<typeof trustMarkOwnerSchema>
