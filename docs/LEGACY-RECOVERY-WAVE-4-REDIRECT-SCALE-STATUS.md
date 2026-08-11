# Legacy Recovery Wave 4 Redirect Scale Status

Generated: 2026-08-11

- Blog root redirects remain data-driven through `src/data/legacy-blog-redirect-slugs.ts` and `src/proxy.ts`.
- Wave 4 refreshed the public blog redirect export to 499 slugs.
- Static/service recovery added a focused 12-source exact redirect batch, expanded to 24 slash/no-slash variants.
- No homepage dumping, Chaman Properties targets, preview targets, chains, or hidden targets were intentionally introduced.
- Production sitemap QA returned 0 confirmed 404s and 0 transport errors during the Wave 4 run.
