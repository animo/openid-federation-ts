import { z } from 'zod'
import { jsonWebKeySetSchema } from '../jsonWeb'

export const commonMetadataSchema = z.object({
  // -- 5.2.1 Extensions for JWK Sets in Entity Metadata
  signed_jwks_uri: z.string().url().optional(),
  jwks_uri: z.string().url().optional(),
  jwks: jsonWebKeySetSchema.optional(),

  // -- 5.2.2 informational Metadata Extensions --
  organization_name: z.string().optional(),
  contacts: z.array(z.string()).min(1).optional(),
  logo_uri: z.string().url().optional(),
  policy_uri: z.string().url().optional(),
  homepage_uri: z.string().url().optional(),
})
