# ShopSecure — Application Security Assessment Lab

A hands-on web application security project focused on testing, secure implementation, and remediation verification.

> **Scope:** Authorized security lab. Not a production deployment or public demo service.

## Technology

- Nginx frontend
- Express.js backend API
- MySQL database
- Docker Compose
- JWT authentication and role-based authorization

## Architecture

Browser → Nginx frontend (port 5173) → Express API (container port 3000) → MySQL (container port 3306)

The backend and database use internal Docker networking. Do not expose their ports publicly.

## Security work

- Authentication enforcement on protected endpoints
- Administrative role authorization
- Cross-account order-access checks
- Checkout input validation and stock handling
- Environment-based database credentials
- Removal of plaintext demo-account inserts from the fresh-install seed
- Production-only backend dependencies
- HTTP response-header hardening

See [the security assessment](docs/security-assessment.md) for test evidence, limitations, and remaining work.

## Running the lab

Prerequisites: Docker Engine, Docker Compose, Git, and the required application/database environment variables.

1. Clone the repository.
2. Configure the required environment variables. Use unique lab secrets and never commit `.env` files.
3. Review `docker-compose.yml`.
4. Start with `docker compose up -d --build`.
5. Check with `docker compose ps` and `docker compose logs --tail=100`.

The frontend uses port 5173 in this lab. Restrict access to authorized testing IPs or use it locally. Do not expose backend or database ports to the internet.

The SQL seed does not create plaintext demo accounts. Create test users through the application so passwords follow its hashing flow.

## Responsible use

- Test only systems you own or have permission to assess.
- Use disposable test accounts and non-sensitive data.
- Never use real payment-card details.
- Do not publish tokens, passwords, private keys, production data, or environment files.
- Results apply only to the tested application state; they do not guarantee the absence of vulnerabilities.

## Project status

This is an evolving security lab. Older finding documents may describe issues that were open or required verification when recorded. The consolidated report distinguishes historical notes from later verified results.

## License

This project is made available for portfolio and educational purposes. All rights reserved. No permission is granted to redistribute or use the code without the author's consent.
