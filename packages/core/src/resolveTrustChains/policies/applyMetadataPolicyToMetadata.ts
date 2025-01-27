import { objectToEntries } from '../../utils/data'

import { cloneDeep } from '../../utils/data'

import {
  type Metadata,
  type MetadataPolicyOperator,
  type SupportedPolicyKey,
  allSupportedPolicies,
  isExistingPolicyKey,
} from '../../metadata'
import { MetadataHelper } from './MetadataHelper'
import { PolicyValidationError } from './errors/PolicyValidationError'
import { type PolicyValue, union } from './utils'

export async function applyMetadataPolicyToMetadata({
  leafMetadata,
  policyMetadata,
}: { leafMetadata: Metadata; policyMetadata: Record<string, Record<string, MetadataPolicyOperator>> }) {
  const resolvedLeafMetadata = new MetadataHelper(cloneDeep(leafMetadata))

  for (const [serviceKey, service] of objectToEntries(policyMetadata)) {
    for (const [servicePropertyKey, policyValue] of objectToEntries(service)) {
      const policies = objectToEntries(policyValue)
        .filter(([key]) => isExistingPolicyKey(key))
        .sort(
          ([policyKeyA], [policyKeyB]) =>
            allSupportedPolicies[policyKeyA as SupportedPolicyKey].orderOfApplication -
            allSupportedPolicies[policyKeyB as SupportedPolicyKey].orderOfApplication
        )

      const path = `${serviceKey}.${servicePropertyKey}`

      for (const [policyPropertyKey, valueFromPolicy] of policies) {
        switch (policyPropertyKey) {
          case 'value':
            if (valueFromPolicy === null) {
              // When the policy value is null, we delete the property
              resolvedLeafMetadata.deleteProperty(serviceKey, servicePropertyKey)
              break
            }

            resolvedLeafMetadata.setPropertyValue(serviceKey, servicePropertyKey, valueFromPolicy)
            break
          case 'add': {
            const targetValue = resolvedLeafMetadata.getPropertyValue<PolicyValue>(serviceKey, servicePropertyKey) ?? []
            if (!Array.isArray(targetValue))
              throw new PolicyValidationError('Cannot apply add policy because the target is not an array', {
                path,
                policyValue: valueFromPolicy,
                targetValue,
              })

            const newValue = union(targetValue, valueFromPolicy)
            resolvedLeafMetadata.setPropertyValue(serviceKey, servicePropertyKey, newValue)
            break
          }
          case 'one_of': {
            const targetValue = resolvedLeafMetadata.getPropertyValue<PolicyValue>(serviceKey, servicePropertyKey)
            // With one_of it's allowed to not have a value and can be enforced with essential
            if (targetValue === undefined) break

            if (!Array.isArray(valueFromPolicy))
              throw new PolicyValidationError('Cannot apply one_of policy because the value is not an array', {
                path,
                policyValue: valueFromPolicy,
                targetValue,
              })

            if (!valueFromPolicy.some((value) => value === targetValue))
              throw new PolicyValidationError('Cannot apply one_of policy because the intersection is empty', {
                path,
                policyValue: valueFromPolicy,
                targetValue,
              })
            break
          }
          case 'default':
            if (resolvedLeafMetadata.hasProperty(serviceKey, servicePropertyKey)) continue

            resolvedLeafMetadata.setPropertyValue(serviceKey, servicePropertyKey, valueFromPolicy)
            break
          case 'subset_of': {
            const targetValue = resolvedLeafMetadata.getPropertyValue<PolicyValue>(serviceKey, servicePropertyKey)
            if (!Array.isArray(targetValue))
              throw new PolicyValidationError('Cannot apply subset_of policy because the target is not an array', {
                path,
                policyValue: valueFromPolicy,
                targetValue,
              })
            if (!Array.isArray(valueFromPolicy))
              throw new PolicyValidationError('Cannot apply subset_of policy because the value is not an array', {
                path,
                policyValue: valueFromPolicy,
                targetValue,
              })

            const newValue = targetValue.filter((value) => valueFromPolicy.includes(value))

            if (newValue.length === 0) {
              resolvedLeafMetadata.deleteProperty(serviceKey, servicePropertyKey)
              break
            }

            resolvedLeafMetadata.setPropertyValue(serviceKey, servicePropertyKey, newValue)

            break
          }
          case 'superset_of': {
            const targetValue = resolvedLeafMetadata.getPropertyValue<PolicyValue>(serviceKey, servicePropertyKey)
            if (!Array.isArray(targetValue))
              throw new PolicyValidationError('Cannot apply superset_of policy because the target is not an array', {
                path,
                policyValue: valueFromPolicy,
                targetValue,
              })
            if (!Array.isArray(valueFromPolicy))
              throw new PolicyValidationError('Cannot apply superset_of policy because the value is not an array', {
                path,
                policyValue: valueFromPolicy,
                targetValue,
              })

            if (!targetValue.every((value) => valueFromPolicy.includes(value)))
              throw new PolicyValidationError('The target does not contain all the values from the policy superset', {
                path,
                policyValue: valueFromPolicy,
                targetValue,
              })
            break
          }
          case 'essential': {
            if (!valueFromPolicy) break

            const targetValue = resolvedLeafMetadata.getPropertyValue<PolicyValue>(serviceKey, servicePropertyKey)
            if (targetValue === undefined)
              throw new PolicyValidationError('The policy is required to have a value', {
                path,
                policyValue: valueFromPolicy,
                targetValue,
              })

            if (Array.isArray(targetValue) && targetValue.length === 0)
              throw new PolicyValidationError('The target is empty and is essential to have a value', {
                path,
                policyValue: valueFromPolicy,
                targetValue,
              })
            break
          }
        }
      }
    }
  }

  return {
    resolvedLeafMetadata: resolvedLeafMetadata.metadata,
  }
}
