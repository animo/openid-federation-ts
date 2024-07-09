export const entityStatementFigure70 = {
  iss: 'https://op.umu.se',
  sub: 'https://wiki.ligo.org',
  aud: 'https://wiki.ligo.org',
  iat: 1601457619,
  exp: 1601544019,
  trust_anchor_id: 'https://edugain.geant.org',
  metadata: {
    openid_relying_party: {
      client_id: 'm3GyHw',
      client_secret_expires_at: 1604049619,
      client_secret: 'cb44eed577f3b5edf3e08362d47a0dc44630b3dc6ea99f7a79205',
      client_id_issued_at: 1601457619,
      application_type: 'web',
      client_name: 'LIGO Wiki',
      contacts: ['ops@edugain.geant.org', 'ops@incommon.org', 'ops@ligo.org'],
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
  authority_hints: ['https://incommon.org'],
  jwks: {
    keys: [
      {
        kty: 'RSA',
        use: 'sig',
        kid: 'U2JTWHY0VFg0a2FEVVdTaHptVDJsNDNiSDk5MXRBVEtNSFVkeXZwb',
        e: 'AQAB',
        n: '4AZjgqFwMhTVSLrpzzNcwaCyVD88C_Hb3Bmor97vH-2AzldhuVb8K...',
      },
      {
        kty: 'EC',
        use: 'sig',
        kid: 'LWtFcklLOGdrW',
        crv: 'P-256',
        x: 'X2S1dFE7zokQDST0bfHdlOWxOc8FC1l4_sG1Kwa4l4s',
        y: '812nU6OCKxgc2ZgSPt_dkXbYldG_smHJi4wXByDHc6g',
      },
    ],
  },
}
