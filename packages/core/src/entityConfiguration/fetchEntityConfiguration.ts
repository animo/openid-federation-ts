import { verifyJwtSignature } from '../jsonWeb/verifyJsonWebToken'
import { type VerifyCallback, addPaths, fetcher } from '../utils'
import { validate } from '../utils/validate'
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

  // Parse the JWT into its claims
  const { claims } = validate({
    schema: entityConfigurationJwtSchema,
    data: entityConfigurationJwt,
    errorMessage: 'fetched entity configuration JWT is invalid',
  })

  await verifyJwtSignature({ jwt: entityConfigurationJwt, verifyJwtCallback })

  return claims
}
