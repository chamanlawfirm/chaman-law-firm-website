# Legacy Recovery Wave 6 Vercel Deployment Status

- Project: chaman-law-firm-website
- Production deployment before Wave 6 commit: a6661b5
- Final production deployment: bd946f19ed452eb4ce942be3086c075c768611df
- Final deployment ID: dpl_3FVtNV9PRujKFukCYBUZtgcQHXjK
- State observed: READY
- Branch: preview/chaman-law-firm-mvp
- Root cause for blog 404s: affected approved posts were token-visible but not visible to the unauthenticated Sanity client used by the production route.
- Wave 6 repair: server-only Sanity client can use SANITY_AUTH_TOKEN or CMS_API_TOKEN for server-rendered approved content.
- Wave 6 fallback repair: exact persistent token-only blog slugs now permanently redirect to relevant rebuilt 200 service authority pages if the production environment cannot read them with a Sanity token.
- Final production check: all 9 persistent public blog 404s resolve to final 200 authority pages; live sitemap contains 488 blog URLs, 126 service URLs, and 644 canonical URLs.
- DNS/Hostinger changes: none
