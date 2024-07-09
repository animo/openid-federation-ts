import { z } from 'zod'
import { MetadataMergeStrategy } from '../MetadataMergeStrategy'
import type { MetadataOperator } from '../MetadataOperator'
import { MetadataOrderOfApplication } from '../MetadataOrderOfApplication'
import { createPolicyOperatorSchema } from '../utils'

export const defaultOperator: MetadataOperator = {
  key: 'default',
  parameterJsonValues: [
    z.string(),
    z.number(),
    z.boolean(),
    z.record(z.string().or(z.number()), z.unknown()),
    z.array(z.unknown()),
  ],
  operatorJsonValues: [
    z.string(),
    z.number(),
    z.boolean(),
    z.record(z.string().or(z.number()), z.unknown()),
    z.array(z.unknown()),
  ],
  canBeCombinedWith: ['add', 'one_of', 'subset_of', 'superset_of', 'essential'],
  orderOfApplication: MetadataOrderOfApplication.AfterAdd,
  mergeStrategy: MetadataMergeStrategy.OperatorValuesEqual,
}

export const defaultOperatorSchema = createPolicyOperatorSchema(defaultOperator)
