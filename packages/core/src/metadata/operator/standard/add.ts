import { z } from 'zod'
import { MetadataMergeStrategy } from '../MetadataMergeStrategy'
import type { MetadataOperator } from '../MetadataOperator'
import { MetadataOrderOfApplication } from '../MetadataOrderOfApplication'
import { createPolicyOperatorSchema } from '../utils'

export const addOperator: MetadataOperator = {
  key: 'add',
  parameterJsonValues: [
    z.array(z.string()),
    z.array(z.record(z.string().or(z.number())), z.unknown()),
    z.array(z.number()),
  ],
  operatorJsonValues: [
    z.array(z.string()),
    z.array(z.record(z.string().or(z.number())), z.unknown()),
    z.array(z.number()),
  ],
  canBeCombinedWith: ['default', 'subset_of', 'superset_of', 'essential'],
  orderOfApplication: MetadataOrderOfApplication.AfterValue,
  mergeStrategy: MetadataMergeStrategy.Union,
}

export const addOperatorSchema = createPolicyOperatorSchema(addOperator)
