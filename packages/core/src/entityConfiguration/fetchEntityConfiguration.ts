import { verifyJsonWebToken } from '../jsonWeb/verifyJsonWebToken'
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

  await verifyJsonWebToken({ signature, verifyJwtCallback, header, claims })

  return claims
}
