# SQL Injection Testing

## Objective

Verify that the ShopSecure application is protected against SQL Injection.

---

## Target

POST /api/login

---

## Test Environment

Application: ShopSecure

Authentication: JWT

Database: MySQL

---

## Test Cases

### Test 1

Email:

```
admin@test.com
```

Password:

```
Password123
```

Expected Result:

```
Login Successful
```

---

### Test 2

Email:

```
' OR '1'='1
```

Password:

```
anything
```

Expected Result:

```
Invalid credentials
```

---

### Test 3

Email:

```
admin@test.com'--
```

Password:

```
anything
```

Expected Result:

```
Invalid credentials
```

---

### Test 4

Email:

```
' UNION SELECT NULL--
```

Password:

```
anything
```

Expected Result:

```
Invalid credentials
```

---

## Result

All SQL Injection attempts should fail if parameterized queries are used.

---

## Notes

Verify that login uses prepared statements or parameterized queries.
