export const entityConfigurationFigure50 = {
  authority_hints: ['https://umu.se'],
  exp: 1568397247,
  iat: 1568310847,
  iss: 'https://op.umu.se',
  sub: 'https://op.umu.se',
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
    openid_provider: {
      issuer: 'https://op.umu.se/openid',
      signed_jwks_uri: 'https://op.umu.se/openid/jwks.jose',
      authorization_endpoint: 'https://op.umu.se/openid/authorization',
      client_registration_types_supported: ['automatic', 'explicit'],
      request_parameter_supported: true,
      grant_types_supported: ['authorization_code', 'implicit', 'urn:ietf:params:oauth:grant-type:jwt-bearer'],
      id_token_signing_alg_values_supported: ['ES256', 'RS256'],
      logo_uri: 'https://www.umu.se/img/umu-logo-left-neg-SE.svg',
      op_policy_uri: 'https://www.umu.se/en/website/legal-information/',
      response_types_supported: ['code', 'code id_token', 'token'],
      subject_types_supported: ['pairwise', 'public'],
      token_endpoint: 'https://op.umu.se/openid/token',
      federation_registration_endpoint: 'https://op.umu.se/openid/fedreg',
      token_endpoint_auth_methods_supported: [
        'client_secret_post',
        'client_secret_basic',
        'client_secret_jwt',
        'private_key_jwt',
      ],
    },
  },
}
