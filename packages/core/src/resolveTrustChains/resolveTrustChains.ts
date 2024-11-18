// * Fetch the entity configurations, until the trust anchors are hit
// * Fetch the entity statements back until the entityId is hit
// * Merge and apply the policies, trickeling down
// * Return a list of trust chains where the policies are applied, ending up at the `entityId` again
// * Errors
//    * when no trust anchor could be found
//    * when no trust chain with valid applied could be found
// resolveTrustChains(entityId: string, trustAnchorEntityIds: Array<string>) -> Promise<Array<TrustChain>>

import { type fetchEntityConfiguration, fetchEntityConfigurationChains } from '../entityConfiguration'
import { fetchEntityStatementChain } from '../entityStatement'
import { ErrorCode } from '../error/ErrorCode'
import { OpenIdFederationError } from '../error/OpenIdFederationError'
import type { VerifyCallback } from '../utils'

type Options = {
  verifyJwtCallback: VerifyCallback
  entityId: string
  trustAnchorEntityIds: Array<string>
}

// TODO: Use more direct types instead of Awaited return types
type TrustChain = {
  chain: Awaited<ReturnType<typeof fetchEntityStatementChain>>
  // TODO: Not sure if this needs to be the entity configuration with all the policies applied
  leafEntityConfiguration: Awaited<ReturnType<typeof fetchEntityConfiguration>>
  trustAnchorEntityConfiguration: Awaited<ReturnType<typeof fetchEntityConfiguration>>
}

// TODO: Apply the policies
// TODO: Look into what we want to return in this function. Because the entity configuration is also very valuable
// TODO: We might also need to return the entity configuration which has all the policies applied. So that a chain has both the statements and the configuration

/**
 * Resolves the trust chains for the given entityId and trust anchor entityIds.
 *
 * @param options - The options for the trust chain resolution.
 * @returns A promise that resolves to an array of trust chains. (The first item in the trust chain is the leaf entity configuration, the last item is the trust anchor entity configuration)
 */
export const resolveTrustChains = async (options: Options): Promise<Array<TrustChain>> => {
  const { entityId, trustAnchorEntityIds, verifyJwtCallback } = options

  const now = new Date()

  const entityConfigurationChains = await fetchEntityConfigurationChains({
    leafEntityId: entityId,
    trustAnchorEntityIds,
    verifyJwtCallback,
  })

  const trustChains: Array<TrustChain> = []

  for (const entityConfigurationChain of entityConfigurationChains) {
    // The last item in the chain is the trust anchor's entity configuration
    const entityStatementChain = await fetchEntityStatementChain({
      entityConfigurations: entityConfigurationChain,
      verifyJwtCallback,
    })

    if (entityStatementChain.some((statement) => statement.exp < now)) {
      // Skip expired chains
      continue
    }

    // TODO: Merge all the policies and check them against the metadata of the leaf entity

    const leafEntityConfiguration = entityConfigurationChain[0]
    // Should never happen but for the type safety
    if (!leafEntityConfiguration)
      throw new OpenIdFederationError(ErrorCode.Validation, 'No leaf entity configuration found')

    const trustAnchorEntityConfiguration = entityConfigurationChain[entityConfigurationChain.length - 1]
    if (!trustAnchorEntityConfiguration)
      throw new OpenIdFederationError(ErrorCode.Validation, 'No trust anchor entity configuration found')

    trustChains.push({
      chain: entityStatementChain,
      trustAnchorEntityConfiguration,
      leafEntityConfiguration,
    })
  }

  return trustChains
}
