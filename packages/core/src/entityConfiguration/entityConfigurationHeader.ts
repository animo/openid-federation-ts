import { z } from 'zod'

/**
 *
 * @todo define exact scheme
 *
 */
export const entityConfigurationHeaderSchema = z
  .object({
    kid: z.string(),
    typ: z.literal('entity-statement+jwt'),
  })
  .passthrough()

export type EntityConfigurationHeader = z.input<typeof entityConfigurationHeaderSchema>
