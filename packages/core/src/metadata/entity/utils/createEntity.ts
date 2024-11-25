import type { z } from 'zod'
import { commonMetadataSchema } from '../../common'
import { swapValidators } from '../../operator'
import { metadataPolicySchema } from '../../policy'

export const createEntity = <T extends string, S extends z.ZodRawShape>({
  identifier,
  additionalValidation = {} as S,
  passThroughUnknownProperties = false,
}: {
  identifier: T
  additionalValidation?: S
  passThroughUnknownProperties?: boolean
}) => {
  const schema = commonMetadataSchema.extend(additionalValidation)
  return {
    identifier,
    schema: passThroughUnknownProperties ? schema : schema.passthrough(),
    policySchema: swapValidators(schema, metadataPolicySchema.optional()),
  }
}
