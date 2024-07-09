export const metadataPolicyFigure12 = {
  openid_relying_party: {
    grant_types: {
      default: ['authorization_code'],
      subset_of: ['authorization_code', 'refresh_token'],
      superset_of: ['authorization_code'],
    },
    token_endpoint_auth_method: {
      one_of: ['private_key_jwt', 'self_signed_tls_client_auth'],
      essential: true,
    },
    token_endpoint_auth_signing_alg: {
      one_of: ['PS256', 'ES256'],
    },
    subject_type: {
      value: 'pairwise',
    },
    contacts: {
      add: ['helpdesk@federation.example.org'],
    },
  },
}
