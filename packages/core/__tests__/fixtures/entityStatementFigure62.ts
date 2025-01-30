export const entityStatementFigure62 = {
  exp: 1568397247,
  iat: 1568310847,
  iss: 'https://swamid.se',
  sub: 'https://umu.se',
  source_endpoint: 'https://swamid.se/fedapi',
  jwks: {
    keys: [
      {
        e: 'AQAB',
        kid: 'endwNUZrNTJsX2NyQlp4bjhVcTFTTVltR2gxV2RV...',
        kty: 'RSA',
        n: 'vXdXzZwQo0hxRSmZEcDIsnpg-CMEkor50SOG-1XUlM...',
      },
    ],
  },
  metadata_policy: {
    openid_provider: {
      id_token_signing_alg_values_supported: {
        subset_of: ['RS256', 'ES256', 'ES384', 'ES512'],
      },
      token_endpoint_auth_methods_supported: {
        subset_of: ['client_secret_jwt', 'private_key_jwt'],
      },
      userinfo_signing_alg_values_supported: {
        subset_of: ['ES256', 'ES384', 'ES512'],
      },
    },
  },
}
