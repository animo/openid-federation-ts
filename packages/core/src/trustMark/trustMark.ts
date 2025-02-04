import { z } from 'zod'
import { jsonWebTokenSchema } from '../jsonWeb'
import { dateSchema } from '../utils'

export const trustMarkClaimsSchema = z.object({
  iss: z.string(),
  sub: z.string(),
  id: z.string(),
  iat: dateSchema,
  exp: dateSchema.optional(),
  ref: z.string().url().optional(),
})

export const trustMarkSchema = z.object({
  id: z.string(),
  trust_mark: jsonWebTokenSchema({
    claimsSchema: trustMarkClaimsSchema,
  }),
})

export type TrustMark = z.output<typeof trustMarkSchema>
