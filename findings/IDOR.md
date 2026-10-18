# Finding: Cross-Account Order Access (IDOR/Broken Access Control)

## Severity

Medium (historical rating)

## Category

OWASP A01 Broken Access Control

## Affected endpoint

`GET /api/orders/:id`

## Test evidence

In the recorded lab test, Account A requesting an order owned by Account B received HTTP 404 with an order-not-found response. Account A could retrieve its own orders. Source review also found the order lookup scoped by both order ID and authenticated user ID.

## Impact if regressed

A missing ownership check could expose another user's order and associated personal/order data.

## Recommendation

Keep ownership checks in every object-level read/write route and repeat cross-account tests after changes. Use disposable test accounts and orders.

## Status

**Not reproduced in the tested state; ownership enforcement was observed in the recorded test and source review. Retest after material changes.** This is not a guarantee for every endpoint.
