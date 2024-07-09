import { constraintSchema } from './constraints'
import { jsonWebKeySetSchema } from './jsonWeb'
import { metadataPolicySchema, metadataSchema } from './metadata'
import { trustMarkIssuerSchema, trustMarkOwnerSchema, trustMarkSchema } from './trustMark'
import { dateSchema } from './utils'

import { z } from 'zod'

export const entityStatementClaimsSchema = z.object({
  iss: z.string(),
  sub: z.string(),
  iat: dateSchema,
  exp: dateSchema,
  jwks: jsonWebKeySetSchema,
  authority_hints: z.array(z.string().url()).optional(),
  metadata: metadataSchema.optional(),
  metadata_policy: metadataPolicySchema.optional(),
  constraints: constraintSchema.optional(),
  crit: z.array(z.string()).optional(),
  metadata_policy_crit: z.array(z.string()).optional(),
  trust_marks: z.array(trustMarkSchema).optional(),
  trust_mark_issuers: trustMarkIssuerSchema.optional(),
  trust_mark_owners: trustMarkOwnerSchema.optional(),
  source_endpoint: z.string().url().optional(),
})

export type EntityStatementClaims = z.input<typeof entityStatementClaimsSchema>
