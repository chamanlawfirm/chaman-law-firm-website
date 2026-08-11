# Final GA4 Certification

Generated: 2026-08-05T22:16:54.233Z

- App code supports GA4 through `NEXT_PUBLIC_GA_MEASUREMENT_ID`: GREEN
- Consent-gated loading in CookieConsent: GREEN
- Duplicate tag evidence in source: not detected by source scan.
- Dashboard Realtime verification: AMBER, requires Principal/analytics access.

Manual action required:
1. Confirm `NEXT_PUBLIC_GA_MEASUREMENT_ID` is configured in Vercel Production.
2. Open https://chamanlawfirm.com/ in a clean browser.
3. Accept analytics.
4. Confirm Realtime pageview in GA4 for production hostname only.
5. Repeat on /resources/blog, a practice page, a service page, and /contact.
