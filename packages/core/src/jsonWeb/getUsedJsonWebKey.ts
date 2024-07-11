import { z } from 'zod'
import { validate } from '../utils/validate'
import { jsonWebKeySetSchema } from './jsonWebKeySet'

export const getUsedJsonWebKey = (header: Record<string, unknown>, claims: Record<string, unknown>) => {
  const validatedHeader = validate({
    schema: z
      .object({
        kid: z.string(),
      })
      .passthrough(),
    data: header,
    errorMessage: 'invalid header claims. Should contain a key id',
  })
  const validatedClaims = validate({
    schema: z.object({ jwks: jsonWebKeySetSchema }).passthrough(),
    data: claims,
    errorMessage: 'Invalid payload claims. Should contain a json web key set',
  })

  // Get the key from the `claims.jwks` by the `header.kid`
  const key = validatedClaims.jwks?.keys.find((key) => key.kid === validatedHeader.kid)

  if (!key) {
    throw new Error(`key with id: '${header.kid}' could not be found in the claims`)
  }

  return key
}
