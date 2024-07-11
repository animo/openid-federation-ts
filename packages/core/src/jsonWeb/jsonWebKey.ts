import { z } from 'zod'

export const jsonWebKeySchema = z.object({
  kty: z.string(),
  // TODO: spec mentions kid may be undefined, but we always need a key id for open id federation
  kid: z.string(),
  use: z.string().optional(),
  key_ops: z.string().optional(),
  alg: z.string().optional(),
  x5u: z.string().optional(),
  x5c: z.string().optional(),
  x5t: z.string().optional(),
  'x5t#S256': z.string().optional(),
})

export type JsonWebKey = z.input<typeof jsonWebKeySchema>
