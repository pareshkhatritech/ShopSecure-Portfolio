# Finding: Broken Authentication

## Severity

Medium


## Category

OWASP Top 10 - A07 Identification and Authentication Failures


## Description

The application uses JWT authentication.

Testing identified:

- Weak secret stored in source code
- No account lockout mechanism
- No password complexity enforcement


## Impact

Attackers may attempt:

- Token attacks
- Credential attacks
- Account takeover


## Recommendation

Implement:

- Environment-based JWT secret
- Strong password policy
- Login rate limiting
- MFA


## Status

Open
