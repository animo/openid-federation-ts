export const entityStatementFigure2 = {
  iss: 'https://feide.no',
  sub: 'https://ntnu.no',
  iat: 1516239022,
  exp: 1516298022,
  jwks: {
    keys: [
      {
        kty: 'RSA',
        alg: 'RS256',
        use: 'sig',
        kid: 'NzbLsXh8uDCcd-6MNwXF4W_7noWXFZAfHkxZsRGC9Xs',
        n: 'pnXBOusEANuug6ewezb9J_...',
        e: 'AQAB',
      },
    ],
  },
  metadata: {
    openid_provider: {
      issuer: 'https://ntnu.no',
      organization_name: 'NTNU',

      // Added manually as spec is invalid
      client_registration_types_supported: ['automatic', 'explicit'],
    },
    oauth_client: {
      organization_name: 'NTNU',
    },
  },
  metadata_policy: {
    openid_provider: {
      id_token_signing_alg_values_supported: {
        subset_of: ['RS256', 'RS384', 'RS512'],
      },
      op_policy_uri: {
        regexp: '^https://[\\w-]+\\.example\\.com/[\\w-]+\\.html',
      },
    },
    oauth_client: {
      grant_types: {
        one_of: ['authorization_code', 'client_credentials'],
      },
    },
  },
  constraints: {
    max_path_length: 2,
  },
  crit: ['jti'],
  metadata_policy_crit: ['regexp'],
  source_endpoint: 'https://feide.no/federation_api/fetch',
  jti: '7l2lncFdY6SlhNia',
}
