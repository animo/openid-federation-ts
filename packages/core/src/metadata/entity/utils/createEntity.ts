import type { z } from 'zod'
import { commonMetadataSchema } from '../../common'
import { swapValidators } from '../../operator'
import { metadataPolicySchema } from '../../policy'

export const createEntity = ({
  identifier,
  additionalValidation = {},
}: {
  identifier: string
  additionalValidation?: z.ZodRawShape
}) => {
  const schema = commonMetadataSchema.extend(additionalValidation)
  return {
    identifier,
    schema,
    policySchema: swapValidators(schema, metadataPolicySchema),
  }
}
