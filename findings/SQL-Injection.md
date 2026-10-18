# Finding: SQL Injection

## Severity
High

## Category
OWASP Top 10 - A03 Injection

## Affected Component

Backend API

Endpoint:

POST /api/login


## Description

The application accepts user input and queries the database using SQL statements.

Improper handling of input may allow attackers to manipulate SQL queries.

## Testing

Tested endpoint:

POST /api/login


Payload:

email=' OR '1'='1


## Impact

An attacker may:

- Bypass authentication
- Access unauthorized data
- Extract database information


## Recommendation

Use:

- Prepared statements
- Input validation
- Parameterized queries


## Status

Needs verification
