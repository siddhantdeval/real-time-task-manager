# Session Management by OWASP

This document compiles the core recommendations from the **OWASP Session Management Cheat Sheet**, tailored for secure backend implementations. Each recommendation outlines the specific issue it addresses, the underlying vulnerability, and practical implementation steps.

These guidelines apply strictly to stateful, server-managed sessions (e.g., storing a `sessionId` in a cookie attached to a Redis backend).

### 1. Inadequate Session Entropy (Length & Randomness)
*   **The Issue:** Using weak or predictable identifiers (like sequential integers or UUID v4) for session tokens.
*   **Vulnerability:** **Brute-force / Guessing Attacks**. If the session ID format is relatively small or has low randomness, an attacker can systematically guess active session IDs to hijack a legitimate user's session without their credentials.
*   **Implementation:** Generate session IDs using a Cryptographically Secure Pseudo-Random Number Generator (CSPRNG) yielding at least 128 bits of entropy (preferably 256 bits).
    ```javascript
    // Node.js implementation
    const crypto = require('crypto');
    const sessionId = crypto.randomBytes(32).toString('hex'); // 256-bit entropy
    ```

### 2. Session Fixation Prevention
*   **The Issue:** Allowing an unauthenticated user to dictate a session ID, or failing to regenerate the session ID immediately after a successful login.
*   **Vulnerability:** **Session Fixation**. An attacker sets a known session ID in the victim's browser. When the victim logs in, that same session ID becomes authenticated. The attacker, who already knows the ID, now has access to the authenticated account.
*   **Implementation:** Explicitly destroy any existing session associated with the request *before* creating the new authenticated session. Always assign a brand new session ID upon successful authentication (login, token refresh) and privilege escalation (e.g., switching from standard user to admin).

### 3. Missing Absolute Session Timeout
*   **The Issue:** Relying solely on an "Idle Timeout" (sliding expiration) where sessions are continuously extended upon activity, allowing a session to live indefinitely.
*   **Vulnerability:** **Session Hijacking (Long-Lived Attack Window)**. If an attacker silently steals a session cookie or token, they can continue to use it forever as long as they poke the server periodically.
*   **Implementation:** Implement a hard limit on session lifetime (e.g., 24 hours). The server must store the `createdAt` timestamp alongside the session data. Even if the user is active, when `currentTime - createdAt > absoluteTimeoutLimit`, force the user to re-authenticate and establish a new session entirely.

### 4. Poor Concurrent Session Management
*   **The Issue:** Generating infinite new sessions per user upon login without tracking or restricting the number of active sessions associated with a single account.
*   **Vulnerability:** **Prolonged Account Compromise**. If an account is hacked, the attacker creates a concurrent session. If the legitimate user logs out, they only kill *their* session; the attacker's session remains active. It also masks the compromise from the true owner.
*   **Implementation:**
    1.  Store all session IDs associated with a user in an indexed format (e.g., a Redis Set `user:sessions:<userId>`).
    2.  Allow users to view active sessions (including IP and User-Agent metadata).
    3.  Provide functionality to "Log out of all other devices."
    4.  *(Optional but recommended)* Implement a strict concurrent session limit (e.g., maximum 5 active devices).

### 5. Failure to Invalidate on Credential Change
*   **The Issue:** Leaving existing sessions alive after a user changes their password or resets a forgotten password.
*   **Vulnerability:** **Persistent Compromise Mitigation Failure**. If an attacker had access to the account, a password reset will lock them out of *future* logins, but they will still be actively logged in using their existing hijacked session.
*   **Implementation:** The password update/reset business logic must trigger a backend query to fetch and explicitly delete all active session references for that `userId` across the entire infrastructure.

### 6. Weak Cookie Security Flags (Prefixing)
*   **The Issue:** Naming cookies generically (e.g., `sessionId`) and failing to strictly scope the cookie.
*   **Vulnerability:** **Cookie Tossing / Shadowing attacks**. A vulnerable sub-domain can set a malicious `sessionId` for the parent domain, tricking the backend server.
*   **Implementation:** In addition to `Secure`, `HttpOnly`, and `SameSite`, use the `__Host-` prefix (e.g., `__Host-sessionId`). This instructs the browser that the cookie MUST only be sent to the exact domain that set it (no sub-domains) and MUST only be sent over a secure connection.

---

## Part 2: Optional & Advanced Enhancements

These recommendations provide defense-in-depth and are highly recommended for applications handling highly sensitive data (e.g., financial or healthcare platforms).

### 7. Binding Sessions to Client Identity (Fingerprinting)
*   **The Issue:** Relying purely on the token/cookie for authentication without verifying the physical device.
*   **Vulnerability:** **Cookie Theft/Replay across Networks**. If an attacker steals a cookie, they can use it from a completely different country or ISP.
*   **Implementation:** Store the User's IP Address and `User-Agent` in the session backend during login. On every subsequent request, verify that the IP and Agent closely match the original values. *Note: IP binding can cause issues for mobile users switching between WiFi and Cellular networks, so use anomaly detection rather than strict locking if mobility is required.*

### 8. Timing Attacks on Session Verification
*   **The Issue:** Using standard string comparison operators (like `===`) to compare incoming session tokens against stored tokens in the database or cache.
*   **Vulnerability:** **Timing Attack**. Standard string comparison fails early. An attacker can use high-precision timers to measure exactly how long the server takes to reject a guess, allowing them to guess the session ID character by character.
*   **Implementation:** Always use a constant-time comparison function provided by cryptographic libraries when verifying security-sensitive tokens.
    ```javascript
    const crypto = require('crypto');
    const isMatched = crypto.timingSafeEqual(Buffer.from(inputToken), Buffer.from(storedToken));
    ```

### 9. Defense Against Cross-Site Tracing (XST)
*   **The Issue:** Web servers leaving the `TRACE` HTTP method enabled.
*   **Vulnerability:** **XST (Cross-Site Tracing)**. An attacker can use XSS to send a `TRACE` request to the server. The server responds by echoing back the exact request, which includes the `HttpOnly` cookie in the body of the response, bypassing the Javascript restriction.
*   **Implementation:** Explicitly disable the HTTP `TRACE` method at the reverse proxy (Nginx/Apache) or application framework level.
