# Legacy Recovery Wave 6 Vercel Deployment Status

- Project: chaman-law-firm-website
- Production deployment before Wave 6 commit: a6661b5
- State observed: READY
- Branch: preview/chaman-law-firm-mvp
- Root cause for blog 404s: affected approved posts were token-visible but not visible to the unauthenticated Sanity client used by the production route.
- Wave 6 repair: server-only Sanity client can use SANITY_AUTH_TOKEN or CMS_API_TOKEN for server-rendered approved content.
- DNS/Hostinger changes: none
