export enum MetadataMergeStrategy {
  /**
   *
   * Allowed only when the operator values are equal. If not, this MUST result in a policy error.
   *
   */
  OperatorValuesEqual = 0,
  /**
   *
   * The result of merging the values of two these operators is the union of the operator values.
   *
   */
  Union = 1,
  /**
   *
   * The result of merging the values of two these operators is the intersection of the operator values. If the intersection is empty, this MUST result in a policy error.
   *
   */
  Intersection = 2,
  /**
   *
   * If a Superior has specified essential=true, then a Subordinate MUST NOT change that. If a Superior has specified essential=false, then a Subordinate is allowed to change that to essential=true. If a Superior has not specified essential, then a Subordinate can set essential to true or false. If those conditions are not met, this MUST result in a policy error.
   *
   */
  SuperiorFollowsIfTrue = 3,
}
