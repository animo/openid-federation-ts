import type { VerifyCallback } from '../utils'
import { createJwtSignableInput } from './createJsonWebTokenSignableInput'
import { getUsedJsonWebKey } from './getUsedJsonWebKey'

type VerifyJsonWebTokenOptions = {
  verifyJwtCallback: VerifyCallback
  header: Record<string, unknown>
  claims: Record<string, unknown>
  claimsThatContainTheKid?: Record<string, unknown>
  signature: Uint8Array
}

export const verifyJsonWebToken = async ({
  claims,
  claimsThatContainTheKid = claims,
  header,
  signature,
  verifyJwtCallback,
}: VerifyJsonWebTokenOptions) => {
  const jwk = getUsedJsonWebKey(header, claimsThatContainTheKid)

  // Create a byte array of the data to be verified
  const toBeVerified = createJwtSignableInput(header, claims)

  try {
    const isValid = await verifyJwtCallback({
      signature,
      jwk,
      data: toBeVerified,
    })

    // TODO: better error message
    if (!isValid) {
      throw new Error('Signature in the JWT is invalid')
    }
  } catch (e: unknown) {
    if (typeof e === 'string') {
      throw new Error(e)
    }

    throw e
  }
}
