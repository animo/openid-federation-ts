import { z } from 'zod'
import type { MetadataOperator } from '../MetadataOperator'

export const createPolicyOperatorSchema = (operator: MetadataOperator) =>
  z
    .object({
      [operator.key]: operator.operatorJsonValues.reduce((acc, schema) => acc.or(schema)).optional(),
    })
    .passthrough()
    .superRefine((data, ctx) => {
      const dataKeys = Object.keys(data)

      if (
        dataKeys.includes(operator.key) &&
        dataKeys.some((key) => key !== operator.key && !operator.canBeCombinedWith.includes(key))
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `policy operator '${
            operator.key
          }' can only be combined with one of: [${operator.canBeCombinedWith.join(
            ', '
          )}]. keys: [${Object.keys(data).join(',')}]`,
        })
      }

      return data
    })
