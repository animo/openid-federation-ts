import type { MetadataPolicyOperator } from '../../../metadata'

type Details = {
  path: string
  operatorA: MetadataPolicyOperator
  operatorB: MetadataPolicyOperator
}

export class PolicyOperatorMergeError extends Error {
  public readonly details: Details

  constructor(message: string, details: Details) {
    super(message)
    this.name = 'PolicyMergeError'
    this.details = details
  }
}
