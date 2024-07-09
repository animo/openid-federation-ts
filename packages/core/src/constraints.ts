import { z } from 'zod'

export const constraintSchema = z.object({
  max_path_length: z.number().optional(),
  naming_constraints: z
    .object({
      permitted: z.array(z.string()).optional(),
      excluded: z.array(z.string()).optional(),
    })
    .optional(),
  allowed_entity_types: z
    .array(
      z.string().refine((s) => s !== 'federation_entity', {
        message: `Value cannot be "federation_entity"`,
      })
    )
    .optional(),
})

/**
 *
 * {@link https://openid.net/specs/openid-federation-1_0.html#name-constraints | Constraints}
 *
 * Trust Anchors and Intermediate Entities MAY define constraining criteria that apply to their Subordinates. They are expressed in the constraints claim of a Subordinate Statement, as described in {@link https://openid.net/specs/openid-federation-1_0.html#entity-statement | Section 3}.
 *
 */
export type Constraint = z.input<typeof constraintSchema>
