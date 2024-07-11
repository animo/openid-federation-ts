import { type EntityConfigurationClaims, fetchEntityConfiguration } from '../entityConfiguration'
import { verifyJsonWebToken } from '../jsonWeb/verifyJsonWebToken'
import { type VerifyCallback, fetcher } from '../utils'
import { entityStatementJwtSchema } from './entityStatementJwt'

export type FetchEntityStatementOptions = {
  iss: string
  sub: string
  verifyJwtCallback: VerifyCallback
  /**
   *
   * The issuers entity configuration
   *
   * If this is not passed in, it will be fetched from the provided `iss` argument.
   *
   */
  issEntityConfiguration?: EntityConfigurationClaims
  /**
   *
   * Fetch endpoint to get the statements from.
   *
   * If this is not passed in, it will be fetched from the `entityConfiguration.source_endpoint`
   *
   */
  endpoint?: string
}

export const fetchEntityStatement = async ({
  sub,
  verifyJwtCallback,
  iss,
  endpoint,
  issEntityConfiguration,
}: FetchEntityStatementOptions) => {
  const issEntityConfigurationClaims =
    issEntityConfiguration ?? (await fetchEntityConfiguration({ entityId: iss, verifyJwtCallback }))

  const fetchEndpoint = endpoint ?? issEntityConfigurationClaims.source_endpoint

  if (!fetchEndpoint) {
    throw new Error('No fetch endpoint provided or in the issuer configuration')
  }

  const entityStatementJwt = await fetcher.get({
    url: fetchEndpoint,
    searchParams: { iss, sub },
    requiredContentType: 'application/entity-statement+jwt',
  })

  // Parse the JWT into its claims and header claims
  const { claims, header, signature } = entityStatementJwtSchema.parse(entityStatementJwt)

  await verifyJsonWebToken({
    signature,
    verifyJwtCallback,
    header,
    claims,
    claimsThatContainTheKid: issEntityConfigurationClaims,
  })

  return claims
}
