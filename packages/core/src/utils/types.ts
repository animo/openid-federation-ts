import type { JsonWebKey } from '../jsonWeb'

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export type SignCallback = (options: {
  toBeSigned: Uint8Array
  jwk: JsonWebKey
}) => Promise<Uint8Array>

export type VerifyCallback = (options: {
  data: Uint8Array
  signature: Uint8Array
  jwk: JsonWebKey
}) => Promise<boolean>
