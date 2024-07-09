export const entityConfigurationFigure69 = {
  iss: 'https://wiki.ligo.org',
  sub: 'https://wiki.ligo.org',
  iat: 1676045527,
  exp: 1676063610,
  aud: 'https://op.umu.se',
  metadata: {
    openid_relying_party: {
      application_type: 'web',
      client_name: 'LIGO Wiki',
      contacts: ['ops@ligo.org'],
      grant_types: ['authorization_code'],
      id_token_signed_response_alg: 'RS256',
      signed_jwks_uri: 'https://wiki.ligo.org/jwks.jose',
      redirect_uris: ['https://wiki.ligo.org/openid/callback'],
      response_types: ['code'],
      subject_type: 'public',

      // Added manually as the spec is invalid
      client_registration_types: ['automatic'],
    },
  },
  jwks: {
    keys: [
      {
        kty: 'RSA',
        use: 'sig',
        kid: 'U2JTWHY0VFg0a2FEVVdTaHptVDJsNDNiSDk5MXRBVEtNSFVkeXZwb',
        e: 'AQAB',
        n: '4AZjgqFwMhTVSLrpzzNcwaCyVD88C_Hb3Bmor97vH-2AzldhuVb8K...',
      },
    ],
  },
  authority_hints: ['https://incommon.org'],
}
