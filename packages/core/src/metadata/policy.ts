import type { z } from 'zod'
import {
  addOperatorSchema,
  defaultOperatorSchema,
  essentialOperatorSchema,
  oneOfOperatorSchema,
  subsetOfOperatorSchema,
  supersetOfOperatorSchema,
  valueOperatorSchema,
} from './operator'

export const metadataPolicySchema = addOperatorSchema
  .and(defaultOperatorSchema.optional())
  .and(essentialOperatorSchema.optional())
  .and(oneOfOperatorSchema.optional())
  .and(supersetOfOperatorSchema.optional())
  .and(subsetOfOperatorSchema.optional())
  .and(valueOperatorSchema.optional())

export type MetadataPolicyOperator = z.input<typeof metadataPolicySchema>
