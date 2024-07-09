export const entityConfigurationFigure18 = {
  iss: 'https://rp.example.it/spid/',
  sub: 'https://rp.example.it/spid/',
  iat: 1516239022,
  exp: 1516298022,
  // Added property as the example in the spec is invalid
  jwks: { keys: [] },
  trust_marks: [
    {
      id: 'https://www.spid.gov.it/certification/rp',
      trust_mark:
        'eyJraWQiOiJmdWtDdUtTS3hwWWJjN09lZUk3Ynlya3N5a0E1bDhPb2RFSXVyOHJoNFlBIiwidHlwIjoidHJ1c3QtbWFyaytqd3QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL3d3dy5hZ2lkLmdvdi5pdCIsInN1YiI6Imh0dHBzOi8vcnAuZXhhbXBsZS5pdC9zcGlkIiwiaWF0IjoxNTc5NjIxMTYwLCJpZCI6Imh0dHBzOi8vd3d3LnNwaWQuZ292Lml0L2NlcnRpZmljYXRpb24vcnAiLCJsb2dvX3VyaSI6Imh0dHBzOi8vd3d3LmFnaWQuZ292Lml0L3RoZW1lcy9jdXN0b20vYWdpZC9sb2dvLnN2ZyIsInJlZiI6Imh0dHBzOi8vZG9jcy5pdGFsaWEuaXQvZG9jcy9zcGlkLWNpZS1vaWRjLWRvY3MvaXQvdmVyc2lvbmUtY29ycmVudGUvIn0.AGf5Y4MoJt22rznH4i7Wqpb2EF2LzE6BFEkTzY1dCBMCK-8P_vj4Boz7335pUF45XXr2jx5_waDRgDoS5vOO-wfc0NWb4Zb_T1RCwcryrzV0z3jJICePMPM_1hZnBZjTNQd4EsFNvKmUo_teR2yzAZjguR2Rid30O5PO8kJtGaXDmz-rWaHbmfLhlNGJnqcp9Lo1bhkU_4Cjpn2bdX7RN0JyfHVY5IJXwdxUMENxZd-VtA5QYiw7kPExT53XcJO89ebe_ik4D0dl-vINwYhrIz2RPnqgA1OdbK7jg0vm8Tb3aemRLG7oLntHwqLO-gGYr6evM2_SgqwA0lQ9mB9yhw',
    },
  ],
  metadata: {
    openid_relying_party: {
      application_type: 'web',
      client_registration_types: ['automatic'],
      client_name: 'https://rp.example.it/spid/',
      contacts: ['ops@rp.example.it'],
    },
  },
}
