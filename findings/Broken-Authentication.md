# Finding: Authentication Strength Controls

## Severity

Medium (historical rating; reassess after testing)

## Category

OWASP Top 10 - A07 Identification and Authentication Failures

## Description

The historical finding recorded a weak JWT secret in source and raised the absence of account lockout and password-complexity enforcement.

## Current evidence and limitations

- The current login route reads `JWT_SECRET` from the environment and fails closed if it is missing.
- The current login route uses bcrypt password comparison and issues tokens with a one-hour expiry.
- The consolidated assessment does not conclusively verify login rate limiting, account lockout, password policy, or MFA.
- Turnstile verification is present in the reviewed registration/login route, but its deployment configuration and effectiveness require environment-specific verification.

## Recommendations

Verify and document rate limiting, password policy, account lockout decisions, and MFA requirements. Keep secrets outside source control, rotate any secret that was exposed, and test controls against the deployed configuration.

## Status

**Partially addressed; remaining authentication-strength controls require verification.**
