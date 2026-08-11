# Legacy Recovery Wave 2 Redirect Scale Status

The project uses `src/proxy.ts` plus `src/data/legacy-blog-redirect-slugs.ts` for data-driven exact root-slug blog redirects. Wave 2 updated the public slug export rather than adding another large static redirect block to `next.config.mjs`.

- Root legacy redirect source updated: yes
- Exported root-slug redirect set: 462 slugs
- Redirect behavior: `/{slug}` -> 308 -> `/resources/blog/{slug}`
- Chain/loop policy: one hop only
- Homepage dumping: not used
- Hidden targets: excluded by public slug export
- Chaman Properties targets: not used
