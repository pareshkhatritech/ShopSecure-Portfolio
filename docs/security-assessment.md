# ShopSecure — Security Assessment Report

## 1. Executive summary

This report records security testing and remediation performed against the ShopSecure application in an authorized lab. Work covered authentication, authorization, order ownership, checkout validation, configuration hygiene, dependency installation, and HTTP response headers.

The results below are limited to the tests and source review actually performed. They do not constitute an exhaustive penetration test or certify the application as secure.

## 2. Scope

- Nginx-served frontend
- Express.js backend API
- MySQL database
- JWT authentication and role-based administrative controls
- Product, order, checkout, and administrative endpoints

Testing was performed against the lab deployment and source code. No production system was in scope.

## 3. Verified results

### Authentication enforcement

Requests to protected order and profile endpoints without a token returned HTTP 403 with a token-required message. Invalid-token requests returned HTTP 401. The public product listing returned HTTP 200 without authentication, as expected for the tested application behavior.

### Order authorization

Source-level review and the automated portfolio test confirmed that the individual order lookup query scopes access by both the order ID and the authenticated user's ID. The evidence summarized in the authentication-testing report does not independently verify a runtime cross-account request, so this report does not claim that runtime result as confirmed here.

A controlled cross-account runtime test using disposable lab accounts and orders remains recommended.

### Administrative authorization

Regular-user requests to administrative dashboard, user-management, product-management, and order-management endpoints were rejected with an admin-access-required response. A regular-user role-change attempt was also rejected. Source review found token verification and administrator authorization middleware on the reviewed admin routes.

### Checkout negative tests

The application rejected an empty cart, zero quantity, nonexistent product ID, invalid demo payment last-four value, quantity exceeding stock, and duplicate product entries whose combined quantity exceeded stock. The tested product stock remained unchanged after rejected insufficient-stock requests.

Source review found transaction handling, row locking, duplicate-item aggregation, stock validation, conditional stock decrement, and rollback handling. A successful checkout was not performed for this evidence set.

### HTTP response headers

The tested API response returned HTTP 200 and included `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and `Referrer-Policy: strict-origin-when-cross-origin`. The response did not expose `X-Powered-By` or return a wildcard `Access-Control-Allow-Origin: *` header.

This does not prove all browser CORS scenarios are safe. Content Security Policy, HSTS, and HTTPS were not fully verified as deployed protections in the lab.

## 4. Remediations applied

- Removed hardcoded database credential fallbacks from backend configuration.
- Removed plaintext demo-account inserts from the fresh-install SQL seed.
- Removed tracked local backup files and added backup ignore rules.
- Configured the backend container to install production dependencies only and set `NODE_ENV=production`.
- Removed permissive wildcard CORS middleware and disabled Express `X-Powered-By`.
- Clarified the JWT secret placeholder in the finding documentation.
- Retained environment-variable-based configuration for application and database secrets.

The SQL seed change affects fresh database initialization; it does not delete accounts from an existing persistent database volume.

## 5. Items requiring further verification

### SQL injection

The legacy finding describes an SQL-injection-style login test but marks the issue as needing verification. The available evidence does not establish whether the current login implementation is exploitable or fully remediated. Review query construction and parameterized-query usage, then repeat controlled tests against the current version.

### Authentication strength

The legacy authentication finding raises login rate limiting, account lockout, password complexity, and MFA. Current behavior for these controls was not conclusively verified in the evidence summarized here. Test and document each control before making claims about its status.

### HTTPS and security headers

The tested response did not include a Content Security Policy or HSTS, and HTTPS was not configured in the lab at the time of testing. For a public deployment, configure TLS first, then review CSP and verify headers over HTTPS. Enable HSTS only when HTTPS is correctly deployed.

### Dependency audit

The previously recorded full backend audit reported three high-severity findings in the development dependency chain involving `nodemon`, `chokidar`, and `braces`. The production-only audit reported zero vulnerabilities, and the production container excludes development dependencies. Re-run audits before publication; these are point-in-time results, not a guarantee about future versions.

## 6. Credential hygiene

Secrets should be supplied through environment variables or a secret manager, not hardcoded in source. Do not commit `.env` files, tokens, passwords, private keys, or production data.

Historical Git commits contained old backup files and demo credentials. Deleting them in later commits does not remove their earlier contents from Git history. Any real credential or token that was exposed should be rotated or invalidated. A clean publication repository does not revoke previously exposed credentials.

## 7. Limitations

- Testing was limited to the described lab deployment and source review.
- Full browser-based CORS testing was not completed.
- Successful end-to-end checkout was not exercised for the summarized negative-test evidence.
- SQL injection resistance, rate limiting, password policy, account lockout, and MFA need further verification.
- HTTPS and HSTS were not configured in the tested lab state.
- No exhaustive review of every endpoint, dependency, or deployment control is claimed.

## 8. Conclusion

The assessment verified authentication and authorization enforcement, order ownership checks, checkout rejection of several invalid requests, and selected response-header controls. Configuration and deployment changes were applied to reduce avoidable exposure. Further testing is required before making broader claims about SQL injection resistance, authentication-strength controls, browser CORS behavior, or production readiness.
