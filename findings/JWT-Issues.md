# Finding: JWT Secret Exposure

## Severity

Medium (historical rating)

## Category

OWASP A02 Cryptographic Failures

## Historical issue

An earlier version stored the JWT signing secret in source. The historical secret is intentionally not reproduced here.

## Current evidence

The current login route reads `JWT_SECRET` from the process environment and returns a server configuration error rather than issuing a token when the value is missing. Runtime secret strength and deployment configuration must still be checked separately.

## Recommendation

Supply a unique, high-entropy `JWT_SECRET` through the deployment environment or a secret manager. Never commit the real value. If a real secret was ever committed, rotate it; removing it from the current file does not erase it from Git history.

Example placeholder only:

```dotenv
JWT_SECRET=replace-with-a-unique-random-secret
```

## Status

**Addressed in current source review; verify runtime configuration and rotate any historically exposed secret.**
