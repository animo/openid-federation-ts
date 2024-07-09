export const entityStatementFigure54 = {
  exp: 1568397247,
  iat: 1568310847,
  iss: 'https://umu.se',
  sub: 'https://op.umu.se',
  source_endpoint: 'https://umu.se/oidc/fedapi',
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
  metadata_policy: {
    openid_provider: {
      contacts: {
        add: ['ops@swamid.se'],
      },
      organization_name: {
        value: 'University of Umeå',
      },
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
