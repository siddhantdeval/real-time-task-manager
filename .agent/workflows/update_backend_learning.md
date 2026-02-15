---
description: Update backend learning documentation and technical docs based on recent changes. Strict scope: Backend only.
---

1. **Analyze Backend Changes**:
   - Review conversation history and file changes **strictly within the `backend/` directory**.
   - Ignore frontend or root-level configuration changes unless they directly impact the backend.
   - identifying key backend architectural decisions, new patterns (e.g., in `backend/src/services`), or infrastructure changes (e.g., `backend/docker-compose.yml`).

2. **Update Backend Learning Documentation**:
   - Target Directory: `backend/learning/` (e.g., `nodejs_learning.md`, `redis_learning.md`).
   - Action:
     - Check if a relevant markdown file exists in `backend/learning/`.
     - Append new learnings using the following strict format:e
       - **Topic/Concept**
       - **Context** (Backend-specific reasoning)
       - **Implementation** (Reference `backend/src/...` files)
       - **Gotchas** (Backend specific edge cases)

3. **Update Backend Technical Documentation**:
   - Target Directory: `backend/docs/`.
   - Action:
     - Update `backend/docs/api_reference.md` if `backend/src/routes/` or `backend/src/controllers/` changed.
     - Update `backend/docs/data_flow.md` if data flow involves new backend services.
     - Update `backend/docs/authentication_system.md` if `backend/src/services/auth.service.ts` or related middleware changed.

4. **Ask to Verify Backend correctness (Optional Command)**:
   - If unsure about a change, verify by running tests strictly in the backend directory:
   - // turbo
     ```bash
     cd backend && npm run test --if-present
     ```

5. **Ask to Commit Changes**:
   - Commit message must be prefixed with `docs(backend):`.