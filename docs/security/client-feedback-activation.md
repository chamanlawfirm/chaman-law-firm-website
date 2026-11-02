# Confidential client feedback activation — pending backend infrastructure

## Implementation state
- Public route: `/client-feedback` (indexing disabled).
- Form component: `src/components/FeedbackForm.tsx`.
- Server endpoint: `POST /api/client-feedback` — validation, origin check, no-store, fails closed.
- Server storage integration: `src/lib/client-feedback.ts`. It writes using an isolated server-only service credential to a dedicated Supabase project.
- No verified law-firm Supabase project or management authentication was available when implemented. The connected Supabase project was `chaman-properties-listings`; **do not store confidential law-firm complaints in it without explicit user approval and a fully assessed separation model**.
- There is **no active management dashboard and no configured Gmail notifier yet**; do not claim otherwise.
- Public page shows a non-accepting, clear setup notice until `FEEDBACK_PUBLIC_ENABLED=true` is deliberately configured **in addition** to the two required server environment variables. A production storage schema is not automatically created.

## Activation checklist
1. Obtain an authorised Chaman Law Firm database project with proper data-processing, backup, region, retention and permissions decisions.
2. Review and apply `docs/security/client-feedback-schema.sql`; verify both tables are inaccessible to `anon` and `authenticated` roles, plus direct PostgREST attempts.
3. Set Vercel **server-only** production vars `FEEDBACK_SUPABASE_URL` (https://<project-ref>.supabase.co) and `FEEDBACK_SUPABASE_SERVICE_KEY` (server secret, never NEXT_PUBLIC). Restrict admin access to the environment.
4. Implement audited management authentication and RBAC before enabling management browsing. Ordinary lawyers and staff must be denied all read, update and export access.
5. Implement a verified email sender with idempotent notification retries; send only reference, timestamp and rating summary to `chamanlawfirm@gmail.com`. No client complaints or contact details in the email.
6. Add shared distributed rate-limiting and idempotency protection, with consent and accessible anti-bot safeguards before allowing public production submissions.
7. Test name-only, phone-only, unknown, multiple representatives, no contact, requested follow-up, validation failures, positive and negative ratings, private storage, denial of unauthenticated read, audit events, retry and backup/restore.
8. Confirm data retention with management, update privacy information and deploy with monitoring. Only then set `FEEDBACK_PUBLIC_ENABLED=true` in the production server environment. Never turn on automatic deletion without written approval.

## Data security
The public reference is random and non-sequential. No submitted details are reflected in a URL, logs or analytics by this code. Stored JSON fields require further organisational retention and access-control review. Management may have infrastructure-level access and must adhere to confidentiality and evidence-preservation requirements.

## Rollback
Set `FEEDBACK_PUBLIC_ENABLED=false` (or remove it) to disable public submission acceptance, then redeploy. Preserve database records and audit evidence. Restoring the previous commit also removes the page.
