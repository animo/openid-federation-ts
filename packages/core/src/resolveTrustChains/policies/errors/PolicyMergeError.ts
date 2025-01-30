import type { MetadataPolicyOperator } from '../../../metadata'

export type PolicyOperatorMergeErrorDetails = {
  path: string
  operatorA: MetadataPolicyOperator
  operatorB: MetadataPolicyOperator
}

export class PolicyOperatorMergeError extends Error {
  public readonly details: PolicyOperatorMergeErrorDetails

  constructor(message: string, details: PolicyOperatorMergeErrorDetails) {
    super(message)
    this.name = 'PolicyOperatorMergeError'
    this.details = details
  }
}
