import type { ZodError } from 'zod'
import { ErrorCode } from './ErrorCode'

// TODO: Extend to get more properties on the error
export class OpenIdFederationError extends Error {
  public constructor(
    public errorCode: ErrorCode,
    message?: string,
    public context?: Error
  ) {
    super(message)
  }

  public static fromZodError(zodError: ZodError) {
    return new OpenIdFederationError(ErrorCode.Validation, undefined, zodError)
  }
}
