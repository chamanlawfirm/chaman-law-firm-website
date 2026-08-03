# Legacy Activation GSC Indexing Pack

## Submit

- https://chamanlawfirm.com/sitemap.xml

## Inspect Final 200 Canonical URLs

- Use the production sitemap as the canonical URL source: https://chamanlawfirm.com/sitemap.xml
- Newly activated public blog targets are represented in `src/data/legacy-blog-redirect-slugs.mjs`.
- Inspect a representative first batch from the newly activated blog set, then continue in batches from the same slug file.
- Request indexing for final canonical `/resources/blog/[slug]` URLs only.
- Inspect old root legacy URLs only to confirm Google recognizes the one-hop redirect.

## Do Not Submit

- Hidden/source records
- Substantive legal holds
- Low-value retired URLs
- Redirect source URLs as canonical indexing requests
