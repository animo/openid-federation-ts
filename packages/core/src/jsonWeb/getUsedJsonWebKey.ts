import { z } from 'zod'
import { jsonWebKeySetSchema } from './jsonWebKeySet'

const headerSchema = z
  .object({
    kid: z.string(),
  })
  .passthrough()

const payloadSchema = z.object({ jwks: jsonWebKeySetSchema }).passthrough()

export const getUsedJsonWebKey = (header: Record<string, unknown>, payload: Record<string, unknown>) => {
  const validatedHeader = headerSchema.parse(header)
  const validatedPayload = payloadSchema.parse(payload)

  // Get the key from the `claims.jwks` by the `header.kid`
  const key = validatedPayload.jwks?.keys.find((key) => key.kid === validatedHeader.kid)

  if (!key) {
    throw new Error(`key with id: '${header.kid}' could not be found in the claims`)
  }

  return key
}
