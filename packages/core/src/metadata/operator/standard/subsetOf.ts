import { z } from 'zod'
import { MetadataMergeStrategy } from '../MetadataMergeStrategy'
import type { MetadataOperator } from '../MetadataOperator'
import { MetadataOrderOfApplication } from '../MetadataOrderOfApplication'
import { createPolicyOperatorSchema } from '../utils'

export const subsetOfOperator: MetadataOperator = {
  key: 'subset_of',
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
  canBeCombinedWith: ['add', 'default', 'superset_of', 'essential'],
  orderOfApplication: MetadataOrderOfApplication.AfterOneOf,
  mergeStrategy: MetadataMergeStrategy.Intersection,
}

export const subsetOfOperatorSchema = createPolicyOperatorSchema(subsetOfOperator)
