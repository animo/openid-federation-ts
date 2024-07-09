export const entityConfigurationFigure8 = {
  iss: 'https://openid.sunet.se',
  sub: 'https://openid.sunet.se',
  iat: 1516239022,
  exp: 1516298022,
  metadata: {
    openid_relying_party: {
      application_type: 'web',
      redirect_uris: ['https://openid.sunet.se/rp/callback'],
      organization_name: 'SUNET',
      logo_uri: 'https://www.sunet.se/sunet/images/32x32.png',
      grant_types: ['authorization_code', 'implicit'],
      signed_jwks_uri: 'https://openid.sunet.se/rp/signed_jwks.jose',
      jwks_uri: 'https://openid.sunet.se/rp/jwks.json',
      client_registration_types: ['automatic'],
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
