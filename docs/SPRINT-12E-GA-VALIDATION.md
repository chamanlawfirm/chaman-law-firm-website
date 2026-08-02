# Sprint 12E GA Validation

Generated: 2026-08-02T14:30:05.613Z

The codebase contains consent-gated GA support through `NEXT_PUBLIC_GA_MEASUREMENT_ID`, layout wiring, and the cookie consent component. Dashboard validation is still manual because credentials/property access were not exposed.

Validation checklist:

- Confirm production GA/GTM property is configured in Vercel.
- Confirm tracking loads only after analytics consent.
- Confirm no duplicate tag.
- Confirm no preview hostname contamination.
- Confirm page views on homepage, blog, consultation, contact, and live article pages.
