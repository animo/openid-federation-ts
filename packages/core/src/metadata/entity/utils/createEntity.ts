import type { z } from 'zod'
import { commonMetadataSchema } from '../../common'
import { swapValidators } from '../../operator'
import { metadataPolicySchema } from '../../policy'

export const createEntity = <T extends string>({
  identifier,
  additionalValidation = {},
}: {
  identifier: T
  additionalValidation?: z.ZodRawShape
}) => {
  const schema = commonMetadataSchema.extend(additionalValidation)
  return {
    identifier,
    schema,
    policySchema: swapValidators(schema, metadataPolicySchema.optional()),
  }
}
