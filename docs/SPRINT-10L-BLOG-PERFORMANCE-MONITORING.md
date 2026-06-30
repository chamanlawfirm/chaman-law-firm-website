# Sprint 10L - Blog Performance Monitoring

Date: 2026-07-01

## Current Baseline

- Production domain: `https://chamanlawfirm.com`.
- Public blog posts: 101.
- Blog index: `/resources/blog`.
- Pagination format: `/resources/blog?page=2`, `/resources/blog?page=3`.
- `/resources/blog/page/2` remains intentionally invalid.

## Expected Behaviour

- Blog index returns 200.
- Query-param pagination returns 200.
- Sitemap contains production URLs only.
- Robots points to production sitemap and blocks `/studio` and `/api`.
- Hidden/unapproved content must return 404 and stay out of sitemap.

## Sprint 10L Status

The 100-post recovery selection and image map were prepared, but no new Sanity posts were created because the active Sanity credentials could not create assets or documents. Blog performance should therefore remain unchanged from Sprint 10K.

## Monitoring Items

- Recheck sitemap count after Sanity permissions are fixed and Sprint 10L is rerun.
- Recheck build page count after the 40 controlled approvals are actually public.
- Continue watching for oversized Sanity query payload warnings as article volume grows.
- Keep future approval batches controlled and verify pagination after every batch.
