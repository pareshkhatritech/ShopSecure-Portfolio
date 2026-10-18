# Finding: SQL Injection

## Severity

High (historical rating; reassess after retesting)

## Category

OWASP Top 10 - A03 Injection

## Affected component

`POST /api/login`

## Historical test note

The original finding recorded the payload `email=' OR '1'='1` but did not provide evidence that it bypassed authentication or altered the query. Treat that note as a test case, not proof of an exploitable vulnerability.

## Current evidence

Source review of the current login route shows a parameterized query (`WHERE email = ?`) with the email supplied separately as a query parameter. The consolidated assessment still calls for controlled retesting against the current running version; source review alone is not a complete dynamic test.

## Recommendation

Keep database queries parameterized, validate input, and repeat controlled authentication-bypass tests using disposable lab accounts. Record request, response, and application version before changing the status to fully verified.

## Status

**Not confirmed in current evidence; dynamic verification remains required.** This status does not assert that the application is vulnerability-free.
