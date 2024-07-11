import type { z } from 'zod'
import { entityStatementClaimsSchema } from '../entityStatement'

export const entityConfigurationClaimsSchema = entityStatementClaimsSchema.refine((data) => data.iss === data.sub, {
  message: 'iss and sub must be equal',
  path: ['iss', 'sub'],
})

type EntityConfigurationClaimsInput = z.input<typeof entityConfigurationClaimsSchema>

type EntityConfigurationClaimsOutput = z.output<typeof entityConfigurationClaimsSchema>

export type EntityConfigurationClaims = EntityConfigurationClaimsInput | EntityConfigurationClaimsOutput
