import { z } from 'zod'
import {
  addOperator,
  defaultOperator,
  essentialOperator,
  oneOfOperator,
  subsetOfOperator,
  supersetOfOperator,
  valueOperator,
} from './operator'

export const allSupportedPolicies = {
  [addOperator.key]: addOperator,
  [defaultOperator.key]: defaultOperator,
  [essentialOperator.key]: essentialOperator,
  [oneOfOperator.key]: oneOfOperator,
  [subsetOfOperator.key]: subsetOfOperator,
  [supersetOfOperator.key]: supersetOfOperator,
  [valueOperator.key]: valueOperator,
} as const

export type SupportedPolicyKey = keyof typeof allSupportedPolicies

export const isExistingPolicyKey = (key: string): key is SupportedPolicyKey => key in allSupportedPolicies

export const metadataPolicySchema = z
  .object(
    Object.entries(allSupportedPolicies).reduce(
      // biome-ignore lint/performance/noAccumulatingSpread: In this case we want to use the spread operator
      (acc, [key, policy]) => ({ ...acc, [key]: policy.operatorSchema }),
      {} as {
        [key in keyof typeof allSupportedPolicies]: (typeof allSupportedPolicies)[key]['operatorSchema']
      }
    )
  )
  .and(z.record(z.string(), z.any()))
  .superRefine((data, ctx) => {
    const dataKeys = Object.keys(data)

    for (const dataKey of dataKeys) {
      if (!isExistingPolicyKey(dataKey)) continue
      const { operator } = allSupportedPolicies[dataKey]

      if (dataKeys.some((key) => key !== operator.key && !operator.canBeCombinedWith.includes(key))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `policy operator '${
            operator.key
          }' can only be combined with one of: [${operator.canBeCombinedWith.join(
            ', '
          )}]. keys: [${Object.keys(data).join(',')}]`,
        })
      }
    }

    return data
  })

export type MetadataPolicyOperator = z.input<typeof metadataPolicySchema>
