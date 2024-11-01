import type { EntityConfigurationClaims } from '../entityConfiguration'
import { ErrorCode } from '../error/ErrorCode'
import { OpenIdFederationError } from '../error/OpenIdFederationError'
import type { VerifyCallback } from '../utils'
import type { EntityStatementClaims } from './entityStatementClaims'
import { fetchEntityStatement } from './fetchEntityStatement'

export type FetchEntityStatementChainOptions = {
  entityConfigurations: Array<EntityConfigurationClaims>
  verifyJwtCallback: VerifyCallback
}

export const fetchEntityStatementChain = async ({
  verifyJwtCallback,
  entityConfigurations,
}: FetchEntityStatementChainOptions) => {
  if (entityConfigurations.length === 0) {
    throw new OpenIdFederationError(
      ErrorCode.Validation,
      'Cannot establish a statement chain for zero entity configurations'
    )
  }

  // Reverse the configurations as we have to fetch the entity configuration of the trust anchor first
  // A copy is done here as the reverse method  mutates in place
  const reversedConfigurations = [...entityConfigurations].reverse()

  const promises: Array<Promise<EntityStatementClaims>> = []

  for (let i = 0; i < reversedConfigurations.length; i++) {
    // Get the configuration of the issuer
    const configuration = reversedConfigurations[i]

    // Get the configuration of the subject, i.e. the next in the chain
    const subjectConfiguration = reversedConfigurations[i + 1]

    // If we have no subject configuration we have reached the leaf entity as the `configuration`
    if (!subjectConfiguration) continue

    const fetchEndpoint = configuration?.source_endpoint

    if (!fetchEndpoint) {
      throw new OpenIdFederationError(
        ErrorCode.Validation,
        `No source endpoint found for configuration for: '${configuration?.sub}'`
      )
    }

    promises.push(
      fetchEntityStatement({
        verifyJwtCallback,
        endpoint: fetchEndpoint,
        iss: configuration.iss,
        sub: subjectConfiguration.sub,
        issEntityConfiguration: configuration,
      })
    )
  }

  // The trust anchors (i.e. the last item of the list) entity configuration will be used instead of a statement issued by a superior
  return [entityConfigurations[entityConfigurations.length - 1], ...(await Promise.all(promises))].reverse()
}
