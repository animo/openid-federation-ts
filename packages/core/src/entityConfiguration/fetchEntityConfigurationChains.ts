import { OpenIdFederationError } from '../error/OpenIdFederationError'
import { PolicyErrorStage } from '../error/PolicyErrorStage'
import type { FetchCallback, VerifyCallback } from '../utils'
import type { EntityConfigurationClaims } from './entityConfigurationClaims'
import { fetchEntityConfiguration } from './fetchEntityConfiguration'

export type FetchEntityConfigurationChainOptions = {
  leafEntityId: string
  trustAnchorEntityIds: Array<string>
  verifyJwtCallback: VerifyCallback
  fetchCallback?: FetchCallback
}

/**
 *
 * Fetch an entity configuration chain until one of the trust anchors is hit (per chain)
 *
 * returns a list of chains (a list of lists of entity configurations)
 *
 */
export const fetchEntityConfigurationChains = async (
  options: FetchEntityConfigurationChainOptions
): Promise<Array<Array<EntityConfigurationClaims>>> => {
  if (options.trustAnchorEntityIds.length === 0) {
    throw new OpenIdFederationError(
      PolicyErrorStage.Validation,
      'Cannot establish a configuration chain for zero trust anchors'
    )
  }

  // inner function so we can expose a more user-friendly API
  const __fetchEntityConfigurationChains = async (
    currentEntityId: string,
    path: Array<EntityConfigurationClaims> = []
  ): Promise<Array<Array<EntityConfigurationClaims>>> => {
    // Fetch the entity configuration of the current entity id
    const configuration = await fetchEntityConfiguration({
      verifyJwtCallback: options.verifyJwtCallback,
      fetchCallback: options.fetchCallback,
      entityId: currentEntityId,
    })

    // Append the configuration to the visited paths
    const localPath = [...path, configuration]

    const allPaths: Array<Array<EntityConfigurationClaims>> = []

    // Found a trust anchor
    if (options.trustAnchorEntityIds.includes(configuration.sub)) {
      allPaths.push(localPath)
    }

    // Fetch the superior entity configurations
    if (configuration.authority_hints) {
      const promises: Array<Promise<Array<Array<EntityConfigurationClaims>>>> = []

      for (const superior of configuration.authority_hints) {
        // Do not fetch superiors we already have in the local map to avoid loops
        if (localPath.map((v) => v.sub).includes(superior)) continue

        // Recursively fetch the entity chains
        promises.push(__fetchEntityConfigurationChains(superior, localPath))
      }

      const results = await Promise.allSettled(promises)
      for (const res of results) {
        if (res.status === 'fulfilled') {
          allPaths.push(...res.value)
        }
      }
    }

    // Return a list of chains
    return allPaths
  }

  return __fetchEntityConfigurationChains(options.leafEntityId)
}
