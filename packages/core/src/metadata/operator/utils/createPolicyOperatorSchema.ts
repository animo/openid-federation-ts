import { z } from 'zod'
import type { MetadataOperator } from '../MetadataOperator'

export const createPolicyOperatorSchema = (operator: MetadataOperator) =>
  z
    .object({
      [operator.key]: operator.operatorJsonValues.reduce((acc, schema) => acc.or(schema)),
    })
    .superRefine((data, ctx) => {
      if (!Object.keys(data).every((key) => operator.canBeCombinedWith.includes(key))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `policy operator '${
            operator.key
          }' can only be combined with one of: [${operator.canBeCombinedWith.join(', ')}]`,
        })
      }

      return data
    })
