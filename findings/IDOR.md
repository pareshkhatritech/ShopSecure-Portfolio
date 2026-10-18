# Finding: IDOR Testing

## Severity

Medium


## Category

OWASP A01 Broken Access Control


## Description

Testing required to verify whether users can access resources belonging to other users.


## Test

Modify object IDs in requests.


Example:

GET /api/orders/1

GET /api/orders/2


## Impact

Unauthorized data exposure.


## Recommendation

Validate ownership on every request.


## Status

Testing Required
