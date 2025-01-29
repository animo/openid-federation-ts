import type { EntityStatementClaims } from '../../entityStatement'
import { OpenIdFederationError } from '../../error/OpenIdFederationError'
import { PolicyErrorStage } from '../../error/PolicyErrorStage'
import { isExistingPolicyKey, metadataPolicySchema } from '../../metadata'
import type { MetadataPolicy } from '../../metadata/metadataPolicy'
import { objectToEntries } from '../../utils/data'
import { MetadataHelper } from './MetadataHelper'
import { combineExistingMetadataPolicyOperators } from './combineExistingMetadataPolicyOperators'

export function combineMetadataPolicies({
  statements,
}: {
  /**
   * The entity statements of the chain without the leaf entity
   */
  statements: Array<EntityStatementClaims>
}): {
  mergedPolicy: MetadataPolicy
} {
  if (statements.length === 0) throw new OpenIdFederationError(PolicyErrorStage.Generic, 'Chain is empty')
  const mergedPolicyMap = new MetadataHelper({})

  // We start from the TA and go down to the intermediate
  for (let i = statements.length - 1; i >= 0; i--) {
    const entityStatement = statements[i]
    if (!entityStatement) continue
    // When the current entity doesn't have a metadata policy we can skip it
    if (!entityStatement.metadata_policy) continue

    const metadataPolicyCrit = entityStatement.metadata_policy_crit

    for (const [serviceKey, serviceProperties] of objectToEntries(entityStatement.metadata_policy)) {
      for (const [servicePropertyKey, newPolicyRules] of objectToEntries(serviceProperties)) {
        if (newPolicyRules === undefined) continue

        const contextPath = `${serviceKey}.${servicePropertyKey}`

        // When the metadata_policy_crit is not empty we need to check if it contains a policy method that is not supported and is used by the new policy rule
        if (metadataPolicyCrit) {
          const methodsToCheck = Object.keys(newPolicyRules)
          const unsupportedMethodsAndRequired = methodsToCheck.filter(
            (method) => !isExistingPolicyKey(method) && metadataPolicyCrit.includes(method)
          )
          if (unsupportedMethodsAndRequired.length > 0) {
            throw new OpenIdFederationError(
              PolicyErrorStage.MetadataPolicyCrit,
              `Unsupported policy method and is required by the metadata_policy_crit: ${unsupportedMethodsAndRequired.join(', ')}`
            )
          }
        }

        const existingPolicyRule = mergedPolicyMap.getPropertyValue(serviceKey, servicePropertyKey)
        if (!existingPolicyRule) {
          // When there is no existing policy rule yet we can set the new policy rule
          mergedPolicyMap.setPropertyValue(serviceKey, servicePropertyKey, newPolicyRules)
          continue
        }

        // So we found a new property which we already have in the map yet so this can be a federation_entity property for example
        // We need to combine the existing policy rule together with the new one
        const combinedPolicyRulesRaw = combineExistingMetadataPolicyOperators({
          contextPath: contextPath,
          existingPolicyRules: existingPolicyRule,
          newPolicyRules: newPolicyRules,
        })

        // Check if the the new properties are able to be combined
        const combinedPolicyRules = metadataPolicySchema.safeParse(combinedPolicyRulesRaw)
        if (!combinedPolicyRules.success) throw combinedPolicyRules.error

        mergedPolicyMap.setPropertyValue(serviceKey, servicePropertyKey, combinedPolicyRules.data)
      }
    }
  }

  return {
    mergedPolicy: mergedPolicyMap.asMetadataPolicy(),
  }
}
