# Finding: Incomplete HTTP Security Header Verification

## Severity

Low — preliminary assessment; reassess after deployment verification.

## Category

OWASP Security Misconfiguration

## Scope

HTTP response headers observed during testing of the ShopSecure lab API.

## Verified observations

The tested API response included:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`

The tested response did not expose `X-Powered-By` or return a wildcard
`Access-Control-Allow-Origin: *` header.

## Remaining verification

- Content-Security-Policy (CSP) was not observed in the documented test.
- Strict-Transport-Security (HSTS) was not observed in the documented test.
- HTTPS deployment was not fully verified.
- Browser-based CORS behavior was not comprehensively tested.

These observations are limited to the response and lab state tested. They
do not establish that every endpoint or browser interaction has the same
behavior.

## Recommendation

Review and configure an appropriate Content-Security-Policy. Configure TLS
before enabling HSTS, then verify the deployed headers over HTTPS. Test
CORS behavior using the intended browser origins and document the results.

## Status

Partially addressed — selected headers were observed; CSP, HSTS, HTTPS,
and broader CORS behavior require further verification.
