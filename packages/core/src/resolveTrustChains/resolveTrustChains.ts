// * Fetch the entity configurations, until the trust anchors are hit
// * Fetch the entity statements back until the entityId is hit
// * Merge and apply the policies, trickeling down
// * Return a list of trust chains where the policies are applied, ending up at the `entityId` again
// * Errors
//    * when no trust anchor could be found
//    * when no trust chain with valid applied could be found
// resolveTrustChains(entityId: string, trustAnchorEntityIds: Array<string>) -> Promise<Array<TrustChain>>

import { fetchEntityConfigurationChains } from '../entityConfiguration'
import { fetchEntityStatementChain } from '../entityStatement'
import type { VerifyCallback } from '../utils'

type Options = {
  verifyJwtCallback: VerifyCallback
  entityId: string
  trustAnchorEntityIds: Array<string>
}

type TrustChain = Awaited<ReturnType<typeof fetchEntityStatementChain>>

// TODO: Apply the policies

export const resolveTrustChains = async (options: Options): Promise<Array<TrustChain>> => {
  const { entityId, trustAnchorEntityIds, verifyJwtCallback } = options

  const now = new Date()

  const entityConfigurationChains = await fetchEntityConfigurationChains({
    leafEntityId: entityId,
    trustAnchorEntityIds,
    verifyJwtCallback,
  })

  const trustChains: Array<TrustChain> = []

  for (const chain of entityConfigurationChains) {
    // The last item in the chain is the trust anchor's entity configuration
    const entityStatementChain = await fetchEntityStatementChain({
      entityConfigurations: chain,
      verifyJwtCallback,
    })

    if (entityStatementChain.some((statement) => statement.exp < now)) {
      // Skip expired chains
      continue
    }

    // TODO: Merge all the policies and check them against the metadata of the leaf entity

    trustChains.push(entityStatementChain)
  }

  return trustChains
}
