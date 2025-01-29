export type PolicyValidationErrorDetails = {
  path: string
  policyValue: unknown
  targetValue: unknown
}

export class PolicyValidationError extends Error {
  public readonly details: PolicyValidationErrorDetails

  public constructor(message: string, details: PolicyValidationErrorDetails) {
    super(message)
    this.name = 'PolicyValidationError'
    this.details = details
  }
}
