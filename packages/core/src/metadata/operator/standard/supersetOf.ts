import { z } from 'zod'
import { MetadataMergeStrategy } from '../MetadataMergeStrategy'
import type { MetadataOperator } from '../MetadataOperator'
import { MetadataOrderOfApplication } from '../MetadataOrderOfApplication'
import { createPolicyOperatorSchema } from '../utils'

export const supersetOfOperator: MetadataOperator = {
  key: 'superset_of',
  parameterJsonValues: [
    z.array(z.string()),
    z.array(z.record(z.string().or(z.number()), z.unknown())),
    z.array(z.number()),
  ],
  operatorJsonValues: [
    z.array(z.string()),
    z.array(z.record(z.string().or(z.number()), z.unknown())),
    z.array(z.number()),
  ],
  canBeCombinedWith: ['add', 'default', 'subset_of', 'essential'],
  orderOfApplication: MetadataOrderOfApplication.AfterSubsetOf,
  mergeStrategy: MetadataMergeStrategy.Union,
}

export const supersetOfOperatorSchema = createPolicyOperatorSchema(supersetOfOperator)
