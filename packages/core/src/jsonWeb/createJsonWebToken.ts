import { Buffer } from 'buffer'
import { base64ToBase64URL } from '../utils/encoding'

/**
 *
 * Create a json web token according to {@link https://datatracker.ietf.org/doc/html/rfc7519 | RFC7519 }
 *
 */
export const createJsonWebToken = (
  header: Record<string, unknown>,
  payload: Record<string, unknown>,
  signature: Uint8Array
) => {
  const encodedHeader = base64ToBase64URL(Buffer.from(JSON.stringify(header)).toString('base64'))
  const encodedPayload = base64ToBase64URL(Buffer.from(JSON.stringify(payload)).toString('base64'))

  const encodedSignature = base64ToBase64URL(Buffer.from(signature).toString('base64'))

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`
}
