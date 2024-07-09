import { jsonWebTokenSchema } from '../jsonWeb'
import { entityConfigurationClaimsSchema } from './entityConfigurationClaims'
import { entityConfigurationHeaderSchema } from './entityConfigurationHeader'

export const entityConfigurationJwtSchema = jsonWebTokenSchema({
  headerSchema: entityConfigurationHeaderSchema,
  claimsSchema: entityConfigurationClaimsSchema,
})
