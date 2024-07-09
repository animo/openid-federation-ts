export const entityConfigurationFigure43 = {
  iss: 'https://openid.sunet.se',
  sub: 'https://openid.sunet.se',
  iat: 1516239022,
  exp: 1516298022,
  metadata: {
    federation_entity: {
      contacts: ['ops@sunet.se'],
      federation_fetch_endpoint: 'https://sunet.se/openid/fedapi',
      homepage_uri: 'https://www.sunet.se',
      organization_name: 'SUNET',
    },
    openid_provider: {
      issuer: 'https://openid.sunet.se',
      signed_jwks_uri: 'https://openid.sunet.se/jwks.jose',
      authorization_endpoint: 'https://openid.sunet.se/authorization',
      client_registration_types_supported: ['automatic', 'explicit'],
      grant_types_supported: ['authorization_code'],
      id_token_signing_alg_values_supported: ['ES256', 'RS256'],
      logo_uri: 'https://www.umu.se/img/umu-logo-left-neg-SE.svg',
      op_policy_uri: 'https://www.umu.se/en/website/legal-information/',
      response_types_supported: ['code'],
      subject_types_supported: ['pairwise', 'public'],
      token_endpoint: 'https://openid.sunet.se/token',
      federation_registration_endpoint: 'https://op.umu.se/openid/fedreg',
      token_endpoint_auth_methods_supported: ['private_key_jwt'],
    },
  },
  jwks: {
    keys: [
      {
        alg: 'RS256',
        e: 'AQAB',
        kid: 'key1',
        kty: 'RSA',
        n: 'pnXBOusEANuug6ewezb9J_...',
        use: 'sig',
      },
    ],
  },
  authority_hints: ['https://edugain.org/federation'],
}
