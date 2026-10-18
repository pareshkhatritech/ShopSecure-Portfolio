# Finding: Missing Security Headers

## Severity

Low


## Category

OWASP Security Misconfiguration


## Description

Application should implement HTTP security headers.


Missing headers may include:

- Content-Security-Policy
- X-Frame-Options
- Strict-Transport-Security


## Recommendation

Implement Helmet middleware.


Example:

app.use(helmet());


## Status

Open
