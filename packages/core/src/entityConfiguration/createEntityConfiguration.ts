import { createJsonWebToken, createJwtSignableInput } from '../jsonWeb'
import { getUsedJsonWebKey } from '../jsonWeb'
import type { SignCallback } from '../utils'
import { validate } from '../utils/validate'
import { type EntityConfigurationClaimsOptions, entityConfigurationClaimsSchema } from './entityConfigurationClaims'
import { type EntityConfigurationHeaderOptions, entityConfigurationHeaderSchema } from './entityConfigurationHeader'

export type CreateEntityConfigurationOptions = {
  claims: EntityConfigurationClaimsOptions
  header: EntityConfigurationHeaderOptions
  signJwtCallback: SignCallback
}

/**
 *
 * Create an entity configuration
 *
 * The signing callback will be called with the `header.kid` value in the `claims.jwks.keys` and a signed JWT will be returned
 *
 */
export const createEntityConfiguration = async ({
  header,
  signJwtCallback,
  claims,
}: CreateEntityConfigurationOptions) => {
  // Validate the input
  const validatedHeader = validate({
    schema: entityConfigurationHeaderSchema,
    data: header,
    errorMessage: 'invalid header claims provided',
  })

  const validatedClaims = validate({
    data: claims,
    schema: entityConfigurationClaimsSchema,
    errorMessage: 'invalid payload claims provided',
  })

  // Create a signable input based on the header and payload
  const toBeSigned = createJwtSignableInput(header, claims)

  // Fetch the key that will be used for signing
  const jwk = getUsedJsonWebKey(validatedHeader, validatedClaims)

  // Call the signing callback so the user has to handle the crypto part
  const signature = await signJwtCallback({ toBeSigned, jwk })

  // return a json web token based on the header, claims and associated signature
  return createJsonWebToken(header, claims, signature)
}
