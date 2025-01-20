import type { ZodError } from 'zod'
import { PolicyErrorStage } from './PolicyErrorStage'

export class OpenIdFederationError extends Error {
  public constructor(
    public readonly errorCode: PolicyErrorStage,
    message?: string,
    public readonly cause?: unknown
  ) {
    super(message)
  }

  public static fromZodError(zodError: ZodError) {
    return new OpenIdFederationError(PolicyErrorStage.Validation, undefined, zodError)
  }

  public static isMetadataPolicyCritError(error: unknown) {
    return error instanceof OpenIdFederationError && error.errorCode === PolicyErrorStage.MetadataPolicyCrit
  }
}
