import { z } from 'zod'

/**
 *
 * @todo define extact scheme
 *
 */
export const entityStatementHeaderSchema = z
  .object({
    kid: z.string(),
    typ: z.literal('entity-statement+jwt'),
  })
  .passthrough()

export type EntityStatementHeaderOptions = z.input<typeof entityStatementHeaderSchema>

export type EntityStatementHeader = z.output<typeof entityStatementHeaderSchema>
