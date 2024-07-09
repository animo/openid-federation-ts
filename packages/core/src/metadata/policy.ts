import { z } from 'zod'
import { addOperator, addOperatorSchema } from './operator'
import { defaultOperator, defaultOperatorSchema } from './operator'
import { essentialOperator, essentialOperatorSchema } from './operator'
import { oneOfOperator, oneOfOperatorSchema } from './operator'
import { supersetOfOperator, supersetOfOperatorSchema } from './operator'
import { subsetOfOperator, subsetOfOperatorSchema } from './operator'
import { valueOperator, valueOperatorSchema } from './operator'

export const metadataPolicySchema = z.object({
  [addOperator.key]: addOperatorSchema.optional(),
  [defaultOperator.key]: defaultOperatorSchema.optional(),
  [essentialOperator.key]: essentialOperatorSchema.optional(),
  [oneOfOperator.key]: oneOfOperatorSchema.optional(),
  [supersetOfOperator.key]: supersetOfOperatorSchema.optional(),
  [subsetOfOperator.key]: subsetOfOperatorSchema.optional(),
  [valueOperator.key]: valueOperatorSchema.optional(),
})

export type MetadataPolicyOperator = z.input<typeof metadataPolicySchema>
