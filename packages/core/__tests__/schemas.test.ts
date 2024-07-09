import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { constraintSchema } from '../src/constraints'
import { entityConfigurationClaimsSchema } from '../src/entityConfiguration'
import { entityStatementClaimsSchema } from '../src/entityStatement'
import { metadataSchema } from '../src/metadata/metadata'
import { trustMarkClaimsSchema } from '../src/trustMark'
import { trustMarkIssuerSchema } from '../src/trustMark'
import { trustMarkOwnerSchema } from '../src/trustMark'

import { federationEntityMetadata } from '../src/metadata'
import { metadataPolicySchema } from '../src/metadata/metadataPolicy'
import { constraintsFigure17 } from './fixtures/constraintsFigure17'
import { entityConfigurationFigure8 } from './fixtures/entityConfigurationFigure8'
import { entityConfigurationFigure9 } from './fixtures/entityConfigurationFigure9'
import { entityConfigurationFigure18 } from './fixtures/entityConfigurationFigure18'
import { entityConfigurationFigure43 } from './fixtures/entityConfigurationFigure43'
import { entityConfigurationFigure50 } from './fixtures/entityConfigurationFigure50'
import { entityConfigurationFigure52 } from './fixtures/entityConfigurationFigure52'
import { entityConfigurationFigure56 } from './fixtures/entityConfigurationFigure56'
import { entityConfigurationFigure60 } from './fixtures/entityConfigurationFigure60'
import { entityConfigurationFigure69 } from './fixtures/entityConfigurationFigure69'
import { entityStatementFigure2 } from './fixtures/entityStatementFigure2'
import { entityStatementFigure26 } from './fixtures/entityStatementFigure26'
import { entityStatementFigure54 } from './fixtures/entityStatementFigure54'
import { entityStatementFigure58 } from './fixtures/entityStatementFigure58'
import { entityStatementFigure62 } from './fixtures/entityStatementFigure62'
import { entityStatementFigure70 } from './fixtures/entityStatementFigure70'
import { federationEntityMetadataFigure7 } from './fixtures/federationEntityMetadataFigure7'
import { metadataFigure63 } from './fixtures/metadataFigure63'
import { metadataPolicyFigure12 } from './fixtures/metadataPolicyFigure12'
import { trustMarkClaimsFigure19 } from './fixtures/trustMarkClaimsFigure19'
import { trustMarkClaimsFigure21 } from './fixtures/trustMarkClaimsFigure21'
import { trustMarkClaimsFigure22 } from './fixtures/trustMarkClaimsFigure22'
import { trustMarkClaimsFigure23 } from './fixtures/trustMarkClaimsFigure23'
import { trustMarkClaimsFigure24 } from './fixtures/trustMarkClaimsFigure24'
import { trustMarkIssuersFigure4 } from './fixtures/trustMarkIssuersFigure4'
import { trustMarkOwnersFigure3 } from './fixtures/trustMarkOwnersFigure3'
import { trustMarkClaimsFigure20 } from './fixtures/trustmarkClaimsFigure20'

describe('zod validation schemas', () => {
  describe('validate valid test vectors', () => {
    it('should validate figure 2  -- entity statement', () => {
      assert.doesNotThrow(() => entityStatementClaimsSchema.parse(entityStatementFigure2))
    })

    it('should validate figure 3  -- trust mark owners', () => {
      assert.doesNotThrow(() => trustMarkOwnerSchema.parse(trustMarkOwnersFigure3))
    })

    it('should validate figure 4  -- trust mark issuers', () => {
      assert.doesNotThrow(() => trustMarkIssuerSchema.parse(trustMarkIssuersFigure4))
    })

    it('should validate figure 7  -- federation entity metadata', () => {
      assert.doesNotThrow(() => federationEntityMetadata.schema.parse(federationEntityMetadataFigure7))
    })

    it('should validate figure 8  -- entity configuration', () => {
      assert.doesNotThrow(() => entityConfigurationClaimsSchema.parse(entityConfigurationFigure8))
    })

    it('should validate figure 9  -- entity configuration', () => {
      assert.doesNotThrow(() => entityConfigurationClaimsSchema.parse(entityConfigurationFigure9))
    })

    it('should validate figure 12 -- metadata policy', () => {
      assert.doesNotThrow(() => metadataPolicySchema.parse(metadataPolicyFigure12))
    })

    it('should validate figure 17 -- constraints', () => {
      assert.doesNotThrow(() => constraintSchema.parse(constraintsFigure17))
    })

    it('should validate figure 18 -- entity configuration', () => {
      assert.doesNotThrow(() => entityConfigurationClaimsSchema.parse(entityConfigurationFigure18))
    })

    it('should validate figure 19 -- trust mark claims', () => {
      assert.doesNotThrow(() => trustMarkClaimsSchema.parse(trustMarkClaimsFigure19))
    })

    it('should validate figure 20 -- trust mark claims', () => {
      assert.doesNotThrow(() => trustMarkClaimsSchema.parse(trustMarkClaimsFigure20))
    })

    it('should validate figure 21 -- trust mark claims', () => {
      assert.doesNotThrow(() => trustMarkClaimsSchema.parse(trustMarkClaimsFigure21))
    })

    it('should validate figure 22 -- trust mark claims', () => {
      assert.doesNotThrow(() => trustMarkClaimsSchema.parse(trustMarkClaimsFigure22))
    })

    it('should validate figure 23 -- trust mark claims', () => {
      assert.doesNotThrow(() => trustMarkClaimsSchema.parse(trustMarkClaimsFigure23))
    })

    it('should validate figure 24 -- trust mark claims', () => {
      assert.doesNotThrow(() => trustMarkClaimsSchema.parse(trustMarkClaimsFigure24))
    })

    it('should validate figure 26 -- entity statement', () => {
      assert.doesNotThrow(() => entityStatementClaimsSchema.parse(entityStatementFigure26))
    })

    it('should validate figure 43 -- entity configuration', () => {
      assert.doesNotThrow(() => entityConfigurationClaimsSchema.parse(entityConfigurationFigure43))
    })

    it('should validate figure 50 -- entity configuration', () => {
      assert.doesNotThrow(() => entityConfigurationClaimsSchema.parse(entityConfigurationFigure50))
    })

    it('should validate figure 52 -- entity configuration', () => {
      assert.doesNotThrow(() => entityConfigurationClaimsSchema.parse(entityConfigurationFigure52))
    })

    it('should validate figure 54 -- entity statement', () => {
      assert.doesNotThrow(() => entityStatementClaimsSchema.parse(entityStatementFigure54))
    })

    it('should validate figure 56 -- entity configuration', () => {
      assert.doesNotThrow(() => entityConfigurationClaimsSchema.parse(entityConfigurationFigure56))
    })

    it('should validate figure 58 -- entity statement', () => {
      assert.doesNotThrow(() => entityStatementClaimsSchema.parse(entityStatementFigure58))
    })

    it('should validate figure 60 -- entity configutation', () => {
      assert.doesNotThrow(() => entityConfigurationClaimsSchema.parse(entityConfigurationFigure60))
    })

    it('should validate figure 62 -- entity statement', () => {
      assert.doesNotThrow(() => entityStatementClaimsSchema.parse(entityStatementFigure62))
    })

    it('should validate figure 63 -- metadata', () => {
      assert.doesNotThrow(() => metadataSchema.parse(metadataFigure63))
    })

    it('should validate figure 69 -- entity configuration', () => {
      assert.doesNotThrow(() => entityConfigurationClaimsSchema.parse(entityConfigurationFigure69))
    })

    it('should validate figure 70 -- entity statement', () => {
      assert.doesNotThrow(() => entityStatementClaimsSchema.parse(entityStatementFigure70))
    })
  })
})
