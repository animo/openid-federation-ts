import type { z } from 'zod'
import { entityStatementClaimsSchema } from './entityStatement'

export const entityConfigurationSchema = entityStatementClaimsSchema.refine((data) => data.iss === data.sub, {
  message: 'iss and sub must be equal',
  path: ['iss', 'sub'],
})

export type EntityConfiguration = z.input<typeof entityConfigurationSchema>
