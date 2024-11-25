import { type EntityConfigurationClaims, fetchEntityConfiguration } from '../entityConfiguration'
import { verifyJwtSignature } from '../jsonWeb/verifyJsonWebToken'
import { type VerifyCallback, fetcher } from '../utils'
import { validate } from '../utils/validate'
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

  const fetchEndpoint = endpoint ?? issEntityConfigurationClaims.metadata?.federation_entity?.federation_fetch_endpoint

  if (!fetchEndpoint) {
    throw new Error('No fetch endpoint provided or in the issuer configuration')
  }

  const entityStatementJwt = await fetcher.get({
    url: fetchEndpoint,
    searchParams: { iss, sub },
    requiredContentType: 'application/entity-statement+jwt',
  })

  // Parse the JWT into its claims and header claims
  const { claims } = validate({
    schema: entityStatementJwtSchema,
    data: entityStatementJwt,
    errorMessage: 'fetched entity statement JWT is invalid',
  })

  await verifyJwtSignature({
    verifyJwtCallback,
    jwt: entityStatementJwt,
    jwks: issEntityConfigurationClaims.jwks,
  })

  return claims
}
