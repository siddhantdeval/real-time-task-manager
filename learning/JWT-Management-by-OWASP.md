# JWT Management by OWASP

This document compiles the core recommendations from the **OWASP JSON Web Token (JWT) Cheat Sheet**, tailored for secure backend implementations. Each recommendation outlines the specific issue it addresses, the underlying vulnerability, and practical implementation steps.

These guidelines apply exclusively to stateless tokens where the claims and authentication state are stored directly within the token string itself.

### 1. Weak Secret Keys (Symmetric Signatures)
*   **The Issue:** Using simple or easily guessable secrets (like "password", "my-secret-key", or the company name) to sign the JWT using algorithms like HS256.
*   **Vulnerability:** **Offline Dictionary / Brute Force Attack**. An attacker can capture a JWT and run automated offline tools (like Hashcat or John the Ripper) to crack the signature mathematically. Once the secret is known, the attacker can forge administrative JWTs indefinitely.
*   **Implementation:** Generate the signing secret using a cryptographically secure method, ensuring it has high entropy and length equal to or greater than the hash function itself (e.g., at least 256 bits/32 bytes for HS256).

### 2. Accepting "none" Algorithm
*   **The Issue:** Relying on the JWT header `alg` field to determine how to verify the signature without enforcing strict algorithm whitelists.
*   **Vulnerability:** **Signature Bypass (Alg: none Attack)**. An attacker can decode the JWT, modify the payload (e.g., change `role: "user"` to `role: "admin"`), modify the header to state `"alg": "none"`, strip the signature off, and submit it. Vulnerable parsers will accept it as fully authenticated without verifying the signature mathematically.
*   **Implementation:** Explicitly hardcode the expected algorithm in the JWT verification library configuration (e.g., `algorithms: ['RS256']`). Never blindly trust the header parameter for security decisions.

### 3. Lack of Token Revocation (Stateless Trap)
*   **The Issue:** Assuming stateless JWTs cannot be revoked until their expiration (`exp`) time naturally expires.
*   **Vulnerability:** **Prolonged Account Compromise**. If an administrator needs to ban a user, or if a user reports their token stolen, the system is helpless to stop the token from working until `exp` passes.
*   **Implementation:** Implement a "Deny List" or "Blocklist". When a token needs to be invalidated early, store the token's unique identifier (`jti` claim) in a fast access store (like Redis) until its natural expiration. Every incoming request must quickly check if the incoming token's `jti` is on the blocklist before processing the request.

### 4. Excessive Token Lifespan
*   **The Issue:** Setting the `exp` claim to very long periods (e.g., 30 days or never) to avoid building token refresh architectures.
*   **Vulnerability:** **Increased Window of Vulnerability**. Stolen, intercepted, or leaked tokens grant long-term access with no way to force re-authentication absent an implemented blocklist structure.
*   **Implementation:** Keep JWT lifespans extremely short (e.g., 5 to 15 minutes). Implement a "Refresh Token" pattern to grant new short-lived access tokens quietly in the background. The refresh token themselves should be stateful, highly secure, and revocable (following the rules in Part 1).

### 5. Storing Sensitive Data in the Payload
*   **The Issue:** Storing Personally Identifiable Information (PII) like Social Security Numbers, exact home addresses, internal API connection strings, or unhashed passwords directly in the JWT claims payload.
*   **Vulnerability:** **Information Disclosure**. Standard JWT payloads are merely Base64 encoded, not fully encrypted. Anyone who intercepts the token can instantly decode it and read the data clearly without needing the secret key.
*   **Implementation:** Only store opaque identifiers (like a `userId` UUID) and necessary, non-sensitive authorization claims (like `roles`). If sensitive data *must* travel in the token to achieve true statelessness, utilize JWE (JSON Web Encryption) which encrypts the internal payload entirely instead of merely signing it (JWS).

---

## Part 2: Optional & Advanced Enhancements

These recommendations provide defense-in-depth and represent maturity in enterprise JWT architectures.

### 6. Enforcing strict 'typ' Validation
*   **The Issue:** Accepting any signed token structured like a JWT, without verifying its explicit type.
*   **Vulnerability:** **Token Confusion Attacks**. If an application issues different types of tokens (e.g., Access Tokens, Refresh Tokens, Email Verification Tokens) using the same secret key, an attacker could potentially use an Email Verification token as an Access Token if the server only checks the signature.
*   **Implementation:** Explicitly set the `typ` (Type) property in the Jose Header to `JWT` (or a custom media type like `application/at+jwt` for access tokens). During verification, the backend must strictly assert that the `typ` header matches the expected token type for that specific endpoint.

### 7. Issuer (iss) and Audience (aud) Claims Verification
*   **The Issue:** Relying only on signature validity without confirming *who* issued the token and *who* the token is meant for.
*   **Vulnerability:** **Cross-Service Replay Attacks**. In a microservice architecture, an attacker could grab a perfectly valid JWT meant for the `billing-service` and submit it to the `analytics-service`, which might blindly accept it if it shares the same public key.
*   **Implementation:** The JWT payload must always include the `iss` (Issuer - e.g., `https://auth.example.com`) and `aud` (Audience - e.g., `https://api.example.com/billing`). The resource server MUST verify that `iss` matches the trusted identity provider and `aud` matches its own identity.

### 8. Key Rotation and JWKS (JSON Web Key Set)
*   **The Issue:** Hardcoding a single static secret key or public/private key pair that is never changed.
*   **Vulnerability:** **Catastrophic Key Compromise**. If a static key is eventually leaked or cracked, all past, present, and future JWTs are compromised until the code is patched and servers are restarted.
*   **Implementation:** Instead of static keys, implement dynamic Key Rotation using a JWKS endpoint (`/.well-known/jwks.json`). The JWT header specifies the `kid` (Key ID) it was signed with. The backend regularly fetches the JWKS and verifies the token against the specific public key matching that `kid`. Keys can then be rotated automatically on a schedule (e.g., every 90 days) without downtime.
