export const entityStatementFigure26 = {
  iss: 'https://edugain.org/federation',
  sub: 'https://openid.sunet.se',
  exp: 1568397247,
  iat: 1568310847,
  source_endpoint: 'https://edugain.org/federation/federation_fetch_endpoint',
  jwks: {
    keys: [
      {
        e: 'AQAB',
        kid: 'dEEtRjlzY3djcENuT01wOGxrZlkxb3RIQVJlMTY0...',
        kty: 'RSA',
        n: 'x97YKqc9Cs-DNtFrQ7_vhXoH9bwkDWW6En2jJ044yH...',
      },
    ],
  },
  metadata: {
    federation_entity: {
      organization_name: 'SUNET',
    },
  },
  metadata_policy: {
    openid_provider: {
      subject_types_supported: {
        value: ['pairwise'],
      },
      token_endpoint_auth_methods_supported: {
        default: ['private_key_jwt'],
        subset_of: ['private_key_jwt', 'client_secret_jwt'],
        superset_of: ['private_key_jwt'],
      },
    },
  },
}
