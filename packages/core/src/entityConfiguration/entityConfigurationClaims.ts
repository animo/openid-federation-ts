import type { z } from 'zod'
import { entityStatementClaimsSchema } from '../entityStatement'

export const entityConfigurationClaimsSchema = entityStatementClaimsSchema.refine((data) => data.iss === data.sub, {
  message: 'iss and sub must be equal',
  path: ['iss', 'sub'],
})

export type EntityConfigurationClaimsOptions = z.input<typeof entityConfigurationClaimsSchema>

export type EntityConfigurationClaims = z.output<typeof entityConfigurationClaimsSchema>
