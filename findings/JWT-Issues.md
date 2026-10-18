# Finding: JWT Secret Exposure

## Severity

Medium


## Category

OWASP A02 Cryptographic Failures


## Description

JWT secret is hardcoded:

[REDACTED HISTORICAL JWT SECRET]


## Risk

If exposed, attackers can generate valid tokens.


## Recommendation

Move secret to:

.env

Example:

JWT_SECRET=<replace-with-a-strong-random-secret>


## Status

Open
