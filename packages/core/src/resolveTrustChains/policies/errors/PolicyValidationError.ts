type Details = {
  path: string
  policyValue: unknown
  targetValue: unknown
}

export class PolicyValidationError extends Error {
  public readonly details: Details

  public constructor(message: string, details: Details) {
    super(message)
    this.name = 'PolicyValidationError'
    this.details = details
  }
}
