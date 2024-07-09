import { z } from 'zod'
import { MetadataMergeStrategy } from '../MetadataMergeStrategy'
import type { MetadataOperator } from '../MetadataOperator'
import { MetadataOrderOfApplication } from '../MetadataOrderOfApplication'
import { createPolicyOperatorSchema } from '../utils'

export const oneOfOperator: MetadataOperator = {
  key: 'one_of',
  parameterJsonValues: [z.string(), z.record(z.string().or(z.number()), z.unknown()), z.number()],
  operatorJsonValues: [
    z.array(z.string()),
    z.array(z.record(z.string().or(z.number()), z.unknown())),
    z.array(z.number()),
  ],
  canBeCombinedWith: ['default', 'essential'],
  orderOfApplication: MetadataOrderOfApplication.AfterDefault,
  mergeStrategy: MetadataMergeStrategy.Intersection,
}

export const oneOfOperatorSchema = createPolicyOperatorSchema(oneOfOperator)
