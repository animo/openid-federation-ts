import { Buffer } from 'node:buffer'

/**
 *
 * Converts a JSON header and payload into a byte array which can be used to verify and sign a JWT
 *
 */
export const createJwtSignableInput = (header: Record<string, unknown>, payload: Record<string, unknown>) => {
  if (Object.keys(header).length === 0) {
    throw new Error('Can not create JWT with an empty header')
  }

  if (Object.keys(payload).length === 0) {
    throw new Error('Can not create JWT with an empty payload')
  }

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url')
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url')

  const toBeSignedString = `${encodedHeader}.${encodedPayload}`

  return new Uint8Array(Buffer.from(toBeSignedString))
}
