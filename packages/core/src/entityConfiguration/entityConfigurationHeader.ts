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

export type EntityConfigurationHeaderOptions = z.input<typeof entityConfigurationHeaderSchema>

export type EntityConfigurationHeader = z.output<typeof entityConfigurationHeaderSchema>
