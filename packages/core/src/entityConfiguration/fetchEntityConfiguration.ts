import { createJwtSignableInput } from '../jsonWeb'
import { getUsedJsonWebKey } from '../jsonWeb'
import { type VerifyCallback, addPaths, fetcher } from '../utils'
import { entityConfigurationJwtSchema } from './entityConfigurationJwt'

export type FetchEntityConfigurationOptions = {
  entityId: string
  verifyJwtCallback: VerifyCallback
}

/**
 *
 * {@link https://openid.net/specs/openid-federation-1_0.html#section-9.1 | Federation Entity Request}
 *
 */
export const fetchEntityConfiguration = async ({ entityId, verifyJwtCallback }: FetchEntityConfigurationOptions) => {
  // Create the entity URL
  const federationUrl = addPaths(entityId, '.well-known', 'openid-federation')

  // Fetch the JWT entity configuration
  const entityConfigurationJwt = await fetcher.get({
    url: federationUrl,
    requiredContentType: 'application/entity-statement+jwt',
  })

  // Parse the JWT into its claims and header claims
  const { claims, header, signature } = entityConfigurationJwtSchema.parse(entityConfigurationJwt)

  const jwk = getUsedJsonWebKey(header, claims)

  // TODO: create byte array of the JWT that has to be verified
  const toBeVerified = createJwtSignableInput(header, claims)

  try {
    const isValid = await verifyJwtCallback({
      signature,
      jwk,
      data: toBeVerified,
    })
    // TODO: better error message
    if (!isValid) {
      throw new Error('Signature in the JWT is invalid')
    }
  } catch (e: unknown) {
    if (typeof e === 'string') {
      throw new Error(e)
    }

    throw e
  }

  return claims
}
