import { z } from 'zod'

export const jsonWebKeySchema = z.object({
  kty: z.string(),
  use: z.string().optional(),
  key_ops: z.string().optional(),
  alg: z.string().optional(),
  kid: z.string().optional(),
  x5u: z.string().optional(),
  x5c: z.string().optional(),
  x5t: z.string().optional(),
  'x5t#S256': z.string().optional(),
})
